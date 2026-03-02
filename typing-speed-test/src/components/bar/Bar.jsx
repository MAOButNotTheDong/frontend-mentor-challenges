import clsx from 'clsx';

import ButtonGroup from '../ui/buttons/ButtonGroup';
import DropDownMenu from '../ui/DropDownMenu';

import { DIFF_OPTIONS, MODE_OPTIONS } from '../utils/Options';
import styles from './bar.module.scss';

const StatBar = ({ state, wpm, accuracy, showingTime, difficulty, setDifficulty, mode, setMode }) => {
    return (
        <div className={styles.bar}>
            <div className={styles.barFlex}>
                <div className={styles.statBar}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>WPM:</span>
                        <span className={styles.statValue}>{wpm}</span>
                    </div>

                    <span className={styles.verticalDivider} />

                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Accuracy:</span>
                        <span className={clsx(styles.statValue, accuracy === 100 ? (state === 'running' ? styles.accuracyGreen : styles.accuracy) : styles.accuracyRed)}>{accuracy}%</span>
                    </div>

                    <span className={styles.verticalDivider} />

                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Time:</span>
                        <span className={clsx(styles.statValue, state === 'running' && styles.time)}>{showingTime}</span>
                    </div>
                </div>

                <div className={styles.settingsBar}>
                    <ButtonGroup
                        label="Difficulty"
                        value={difficulty}
                        options={DIFF_OPTIONS}
                        onClick={(value) => setDifficulty(value)}
                        disabled={state !== 'idle'} />

                    <span className={styles.verticalDivider} />

                    <ButtonGroup
                        label="Mode"
                        value={mode}
                        options={MODE_OPTIONS}
                        onClick={(value) => setMode(value)}
                        disabled={state !== 'idle'} />
                </div>

                <div className={styles.settingsBarMobile}>
                    <DropDownMenu
                        label="Difficulty"
                        value={difficulty}
                        options={DIFF_OPTIONS}
                        onClick={(value) => setDifficulty(value)}
                        disabled={state !== 'idle'} />

                    <DropDownMenu
                        label="Mode"
                        value={mode}
                        options={MODE_OPTIONS}
                        onClick={(value) => setMode(value)}
                        disabled={state !== 'idle'} />
                </div>
            </div>

            <span className={styles.divider} />
        </div>
    );
};

export default StatBar;
