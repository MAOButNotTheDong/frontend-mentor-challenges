import { useCallback, useState, useEffect, useRef } from 'react';

import Header from '../header/Header';
import TypingComponent from '../typingComponent/TypingComponent';
import Bar from '../bar/Bar';
import Results from '../results/Results';

import data from '../../../data.json';

import styles from './app.module.scss';
import { useLocalStorage } from '../../hooks/useLocalStorage';

const getRandomText = (difficulty) => {
    const texts = data[difficulty];
    const index = Math.floor(Math.random() * texts.length);
    return texts[index].text;
};

const App = () => {
    const [state, setState] = useState('idle');
    const changeState = useCallback((newState) => setState(prev => prev === newState ? prev : newState), []);
    const [typedText, setTypedText] = useState('');
    const typedTextRef = useRef('');

    const { difficulty, setDifficulty, mode, setMode, record, setRecord } = useLocalStorage();

    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [showingTime, setShowingTime] = useState('00:00');

    const [resultType, setResultType] = useState('baseline');
    const [showingMistakes, setShowingMistakes] = useState(0);
    const [text, setText] = useState(getRandomText(difficulty));

    const currentIndex = useRef(0);
    const hiddenInputRef = useRef(null);
    const inputTextRef = useRef([]);
    const words = useRef(new Set());
    const mistakes = useRef(new Set());
    const totalMistakes = useRef(new Set());
    const time = useRef(0);
    const timerOverRef = useRef(null);
    const tickTimerRef = useRef(null);

    const padStartZero = (value) => value < 10 ? '0' + value : value;

    const formatTime = useCallback(() => {
        let time_ = time.current;
        if (Number.isInteger(mode)) {
            time_ = mode - time_; // remaining time;
        }

        if (time_ < 0) {
            return '00:00';
        }

        const seconds = time_ % 60;
        const minutes = Math.floor((time_ - seconds) / 60);
        return `${padStartZero(minutes)}:${padStartZero(seconds)}`
    }, [mode]);

    const updateStatistics = useCallback(() => {
        time.current++;
        setWpm(Math.floor(words.current.size / time.current * 60));
        const index = currentIndex.current;
        if (index != 0) {
            setAccuracy(Math.min(100, Math.floor(Math.abs((index - totalMistakes.current.size)) / index * 100)));
        }
        setShowingTime(formatTime(time.current));
    }, [formatTime])

    const onReset = () => {
        currentIndex.current = 0;
        inputTextRef.current = [];
        time.current = 0;
        words.current = new Set();
        mistakes.current = new Set();
        totalMistakes.current = new Set();
        setWpm(0);
        setShowingTime('00:00');
        setAccuracy(100);
        setText(getRandomText(difficulty));
        typedTextRef.current = '';
        setTypedText('');
        changeState('idle');
    }

    const onStart = () => {
        changeState('running');
    }

    const onWaiting = () => {
        changeState('waiting')
    }

    const setLetterState = (state) => {
        const el = inputTextRef.current[currentIndex.current];
        if (!el) return;

        el.classList.remove('correct', 'wrong', 'cursor');

        if (state) el.classList.add(state);
    };

    const removeLetterStates = (...states) => {
        const el = inputTextRef.current[currentIndex.current];
        if (!el) return;

        inputTextRef.current[currentIndex.current].classList.remove(...states);
    }

    const onChange = (e) => {
        let input = e.target.value;

        if (state === 'waiting') {
            changeState('running');
        }

        if (input.length - typedTextRef.current.length > 1 || typedTextRef.current.length - input.length > 1) {
            e.target.value = typedTextRef.current;
            return;
        }


        const index = currentIndex.current;
        const mistakes_ = mistakes.current;

        if (typedTextRef.current.length - input.length == 1) {
            removeLetterStates('correct', 'wrong', 'cursor');

            currentIndex.current = index - 1;

        } else {

            if (index > 0 && /\p{L}/u.test(text[index - 1]) && !/\p{L}/u.test(text[index])) {
                words.current.add(index);
            }

            const char = input[index];

            if (text[index] !== char) {
                mistakes_.add(index, char);
                totalMistakes.current.add(index, char);
                setLetterState('wrong')
            } else {
                setLetterState('correct')
            }

            if (index + 1 >= text.length) {
                changeState('finished');
                return;
            }

            currentIndex.current++;
        }

        setLetterState('cursor');
        typedTextRef.current = input;
        setTypedText(input);
        if (inputTextRef.current[currentIndex.current]?.getBoundingClientRect().top !== hiddenInputRef.current?.getBoundingClientRect().top) {
            updateInputPosition();
        }

    };

    const updateInputPosition = useCallback(() => {
        const span = inputTextRef.current[currentIndex.current];
        if (!span || !hiddenInputRef.current) return;

        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const { top, bottom } = span.getBoundingClientRect();
        const spanHeight = bottom - top;
        if (bottom > viewportHeight - spanHeight) {
            window.scrollBy({ top: Math.min(bottom - viewportHeight + 5 * spanHeight, viewportHeight), behavior: 'instant' });
        }

        const rect = span.getBoundingClientRect();
        hiddenInputRef.current.style.top = `${rect.top}px`;
        hiddenInputRef.current.style.left = `${rect.left}px`;
    }, []);

    const setFocus = useCallback(() => {
        updateInputPosition();
        hiddenInputRef.current.focus();
    }, [updateInputPosition]);

    const onFocus = () => {
        setLetterState('cursor');
    }

    const onBlur = () => {
        removeLetterStates('correct', 'wrong', 'cursor');
    }

    useEffect(() => {
        setText(getRandomText(difficulty));
    }, [difficulty])

    useEffect(() => {
        if (state === 'finished') {
            if (!record) {
                setResultType('baseline');
                setRecord(wpm, accuracy);
            } else {
                if (wpm > record.wpm) {
                    setResultType('newPB');
                    setRecord(wpm, accuracy);
                } else {
                    setResultType('completed');
                }
            }
            setShowingMistakes(totalMistakes.current.size);
            changeState('show-result');
        }
    }, [state, accuracy, wpm, changeState, record, setRecord])

    useEffect(() => {
        if (state === 'running' && tickTimerRef.current === null) {
            if (mode !== 'passage' && Number.isInteger(mode)) {
                timerOverRef.current = setTimeout(() => changeState('finished'), mode * 1000);
            }
            tickTimerRef.current = setInterval(updateStatistics, 1000);
        }

        if (state === 'running' || state === 'waiting') {
            setLetterState('cursor');
            setFocus();
        }

        if (state === 'reset') {
            changeState('idle');
        }

        return () => {
            clearTimeout(timerOverRef.current);
            clearInterval(tickTimerRef.current);
            timerOverRef.current = null;
            tickTimerRef.current = null;
        };
    }, [state, changeState, updateStatistics, mode, text, setFocus]);

    return (
        <div className={styles.container}>
            <Header record={record} />
            <main>
                {state === 'show-result'
                    ? <Results type={resultType} wpm={wpm} accuracy={accuracy} totalLetters={text.length} mistakes={showingMistakes} onReset={onReset} />
                    : <>
                        <Bar
                            state={state}
                            wpm={wpm}
                            accuracy={accuracy}
                            showingTime={showingTime}
                            difficulty={difficulty}
                            setDifficulty={setDifficulty}
                            mode={mode}
                            setMode={setMode} />
                        <input
                            ref={hiddenInputRef}
                            className={styles.hiddenInput}
                            type="text"
                            inputMode="text"
                            autoFocus
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
                            value={typedText}
                            onChange={onChange}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onPaste={(e) => e.preventDefault()}
                            onDrop={(e) => e.preventDefault()} />
                        <TypingComponent state={state} inputTextRef={inputTextRef} text={text} onStart={onStart} onWaiting={onWaiting} onReset={onReset} setFocus={setFocus} />
                    </>
                }
                {/* <Results type='newPB' wpm={912} accuracy={86} totalLetters={text.length} mistakes={showingMistakes} /> */}
            </main>
        </div>
    );
};

export default App;
