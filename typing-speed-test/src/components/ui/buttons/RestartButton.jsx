import styles from './restartButton.module.scss';
import RestartIcon from '../../../assets/images/icon-restart.svg?react';
import clsx from 'clsx';

const RestartButton = ({ children, className, onClick }) => {
    return (
        <button className={clsx(styles.restartButton, className)} onClick={onClick}>
            {children}
            <RestartIcon className={styles.icon} />
        </button>
    );
};

export default RestartButton;
