import clsx from 'clsx';

import styles from './buttonGroup.module.scss';

const ButtonGroup = ({ value, label, options, className, onClick, disabled }) => {
    return (
        <div className={clsx(styles.buttonGroup, className)}>
            <span className={styles.label}>{label}:</span>
            <div className={styles.buttonsContainer}>
                {options.map((option, index) => {
                    const isActive = value === option.value;
                    return (
                        <button
                            key={index}
                            className={clsx(styles.button, isActive && styles.active)}
                            onClick={() => onClick(option.value)}
                            disabled={disabled}>
                            {option.label}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default ButtonGroup;
