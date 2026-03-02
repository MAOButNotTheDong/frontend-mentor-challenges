import clsx from 'clsx';
import { useMemo } from 'react';

import styles from './inputTextView.module.scss';

const InputTextView = ({ className, text, inputTextRef, setFocus }) => {

    const letters = useMemo(() => text.split(''), [text]);

    return (
        <p className={clsx(styles.inputText, className)} onClick={setFocus}>
            {
                letters.map((char, index) => {
                    return <span ref={(ref) => inputTextRef.current[index] = ref} key={index}>{char}</span>
                })}
        </p>
    );
};

export default InputTextView;
