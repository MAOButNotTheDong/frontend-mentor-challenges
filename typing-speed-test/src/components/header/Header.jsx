import logoLarge from '../../assets/images/logo-large.svg';
import logoSmall from '../../assets/images/logo-small.svg'
import bestIcon from '../../assets/images/icon-personal-best.svg';

import styles from './header.module.scss';

const Header = ({ record }) => {

    const wpm = record?.wpm ?? '--';

    return (
        <header className={styles.header}>
            <picture>
                <source srcset={logoSmall} media="(max-width: 600px)" />
                <img src={logoLarge} alt="logo" />
            </picture>
            <div className={styles.personalBest}>
                <img src={bestIcon} alt="best" />
                <span>
                    <span className={styles.desktop}>Personal best:{' '}</span>
                    <span className={styles.mobile}>Best:{' '}</span>
                    <span className={styles.wpmScore}>{wpm} WPM</span>
                </span>

            </div>
        </header>
    );
};

export default Header;
