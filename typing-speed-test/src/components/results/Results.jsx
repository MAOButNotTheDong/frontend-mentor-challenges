import clsx from 'clsx';

import RestartButton from '../ui/buttons/RestartButton';

import IconCompleted from '../../assets/images/icon-completed.svg?react';
import IconNewPB from '../../assets/images/icon-new-pb.svg?react';
import StarOne from '../../assets/images/pattern-star-1.svg?react';
import StarTwo from '../../assets/images/pattern-star-2.svg?react';
import Confetti from '../../assets/images/pattern-confetti.svg?react';

import styles from './results.module.scss';

const RESULT_TYPE = {
    baseline: {
        icon: IconCompleted,
        title: 'Baseline Established!',
        subtitle: "You're set the bar. Now the real challenge begins—time to beat it.",
        buttonLabel: 'Beat This Score',
    },
    newPB: {
        icon: IconNewPB,
        title: 'High Score Smashed!',
        subtitle: "You're getting faster. That was incredible typing.",
        buttonLabel: 'Beat This Score',
    },
    completed: {
        icon: IconCompleted,
        title: 'Test Complete!',
        subtitle: 'Solid run. Keep pushing to beat your high score.',
        buttonLabel: 'Go Again'
    }

}


const Results = ({ wpm, accuracy, totalLetters = 0, mistakes, type, onReset }) => {


    const { icon: Icon, title, subtitle, buttonLabel } = RESULT_TYPE[type] ?? RESULT_TYPE.baseline;
    const correct = totalLetters - mistakes;

    return (
        <div className={styles.results}>
            {type === 'baseline' || type === 'completed'
                ? <>
                    <StarOne className={styles.star1} />
                    <StarTwo className={styles.star2} />
                </>
                : null
            }
            <Icon className={clsx(styles.resultIcon, Icon == IconCompleted && styles.completedIcon)} />
            <h1 className={styles.title}>{title}</h1>
            <h2 className={styles.subtitle}>{subtitle}</h2>
            <div className={styles.statBar}>
                <div className={styles.statItem}>
                    <span className={styles.statLabel}>WPM:</span>
                    <span className={styles.statValue}>{wpm}</span>
                </div>

                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Accuracy:</span>
                    <span className={clsx(styles.statValue, accuracy === 100 ? styles.accuracyGreen : styles.accuracyRed)}>{accuracy}%</span>
                </div>

                <div className={styles.statItem}>
                    <span className={styles.statLabel}>Characters:</span>
                    <span className={styles.statValue}>
                        <span className={styles.correct}>{correct}</span>
                        <span className={styles.grey}>/</span>
                        <span className={styles.mistakes}>{mistakes}</span>
                    </span>
                </div>
            </div>
            <RestartButton className={styles.restartButton} onClick={onReset}>{buttonLabel}</RestartButton>
            {type === 'newPB' && <Confetti className={styles.confetti} />}
        </div>
    );
};

export default Results;
