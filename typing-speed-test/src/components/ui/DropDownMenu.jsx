import { useState } from "react";
import clsx from "clsx";

import styles from './dropDownMenu.module.scss';
import DownArrowIcon from '../../assets/images/icon-down-arrow.svg?react';

const DropDownMenu = ({ value, options, onClick, disabled }) => {
    const [open, setOpen] = useState(false);

    const onSelect = (value) => {
        setOpen(false);
        onClick(value);
    }

    return (
        <div className={styles.menuContainer}>
            <button className={styles.dropDownTrigger} onClick={() => setOpen(value => !value)}>
                {options.filter(opt => opt.value === value)[0].label}
                <DownArrowIcon />
            </button>

            {open &&
                <ul className={styles.dropDownMenu}>
                    {options.map((option, index) => {
                        const isActive = option.value === value;
                        return (
                            <li
                                key={index}
                                className={styles.select}
                                onClick={() => onSelect(option.value)}
                                disabled={disabled}>
                                <span className={clsx(styles.icon, isActive && styles.iconActive)}></span>
                                {option.label}
                            </li>
                        )
                    })}
                </ul>
            }
        </div>
    )
}

export default DropDownMenu;
