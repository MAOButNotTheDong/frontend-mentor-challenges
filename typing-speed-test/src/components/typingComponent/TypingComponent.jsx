import clsx from 'clsx';

import InputTextView from '../inputTextView/InputTextView';
import RestartButton from '../ui/buttons/RestartButton';

import styles from './typingComponent.module.scss';

const TypingComponent = ({ state, text, inputTextRef, mistakes, onReset, onStart, onWaiting }) => {

    return (
        <div className={styles.typingComponent}>
            <div className={styles.textContainer}>

                {state !== 'idle' &&
                    <InputTextView className={styles.input} text={text} inputTextRef={inputTextRef} mistakes={mistakes} />
                }
                {state === 'idle' &&
                    <>
                        <p className={clsx(styles.input, styles.inputBlur, styles.noSelect)} onClick={onWaiting}>
                            {text}
                        </p>
                        <div className={styles.modal}>
                            <button className={styles.start} onClick={onStart}>Start Typing Test</button>
                            <p className={styles.startComment}>Or click the text and start typing</p>
                        </div>
                    </>
                }

            </div>

            {
                <div
                    className={clsx(styles.restartControl, state === 'idle' && styles.hidden)}
                    role="group"
                    aria-label="Test controls">
                    <span className={styles.divider} />
                    <RestartButton className={styles.restartButton} onClick={onReset}>Restart Test</RestartButton>
                </div>
            }
        </div>
    );
};

export default TypingComponent;
