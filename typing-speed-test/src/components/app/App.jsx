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

    const { difficulty, setDifficulty, mode, setMode, record, setRecord } = useLocalStorage();

    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [showingTime, setShowingTime] = useState('00:00');

    const [resultType, setResultType] = useState('baseline');
    const [showingMistakes, setShowingMistakes] = useState(0);
    const [text, setText] = useState(getRandomText(difficulty));

    const currentIndex = useRef(0);
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
        changeState('idle');
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
        const onKeyDown = (e) => {
            if (e.key.length !== 1 && e.key !== 'Backspace') return;

            if (state === 'waiting') {
                changeState('running');
            }

            const index = currentIndex.current;
            const mistakes_ = mistakes.current;

            if (e.key === 'Backspace') {
                if (mistakes_.has(index - 1)) {
                    mistakes_.delete(index - 1);
                }

                inputTextRef.current[currentIndex.current].classList.remove('wrong', 'correct', 'cursor');
                currentIndex.current = Math.max(index - 1, 0);
                inputTextRef.current[currentIndex.current].classList.remove('wrong', 'correct');
                inputTextRef.current[currentIndex.current].classList.add('cursor');
                return;
            }

            if (index > 0 && /\p{L}/u.test(text[index - 1]) && !/\p{L}/u.test(text[index])) {
                words.current.add(index);
            }

            if (text[index] !== e.key) {
                mistakes_.add(index, e.key);
                totalMistakes.current.add(index, e.key);
                inputTextRef.current[currentIndex.current].classList.remove('correct', 'cursor');
                inputTextRef.current[currentIndex.current].classList.add('wrong');
            } else {
                inputTextRef.current[currentIndex.current].classList.remove('wrong', 'cursor');
                inputTextRef.current[currentIndex.current].classList.add('correct');
            }

            if (index + 1 >= text.length) {
                changeState('finished');
                return;
            }

            currentIndex.current++;
            inputTextRef.current[currentIndex.current].classList.remove('wrong', 'correct');
            inputTextRef.current[currentIndex.current].classList.add('cursor');
        };

        if (state === 'running' && tickTimerRef.current === null) {
            if (mode !== 'passage' && Number.isInteger(mode)) {
                timerOverRef.current = setTimeout(() => changeState('finished'), mode * 1000);
            }
            tickTimerRef.current = setInterval(updateStatistics, 1000);
        }

        if (state === 'running' || state === 'waiting') {
            document.addEventListener('keydown', onKeyDown);
        }

        if (state === 'reset') {
            changeState('idle');
        }

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            clearTimeout(timerOverRef.current);
            clearInterval(tickTimerRef.current);
            timerOverRef.current = null;
            tickTimerRef.current = null;
        };
    }, [state, changeState, updateStatistics, mode, text]);

    return (
        <div className={styles.container}>
            <Header record={record} />
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

                    <TypingComponent state={state} inputTextRef={inputTextRef} text={text} changeState={changeState} onReset={onReset} />
                </>

            }
        </div>
    );
};

export default App;
