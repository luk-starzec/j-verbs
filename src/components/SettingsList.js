import React, { useEffect, useMemo, useState } from 'react'
import ColumnSettings from './ColumnSettings'
import RowFilter from './RowFilter'
import TextFormatSettings from './TextFormatSettings'
import styles from "./SettingsList.module.scss"
import { ReactComponent as SettingsIcon } from "../assets/settings_icon.svg"

const SettingsList = () => {
    const [isExpanded, setIsexpanded] = useState()
    const [optionsCollapsed, setOptionsColapsed] = useState();

    useEffect(() => {
        setOptionsColapsed(false)
    }, [optionsCollapsed])

    const handleTest = () => {
        setOptionsColapsed(true)
        setIsexpanded(!isExpanded)
    }

    const wrapperCss = useMemo(
        () => (`${styles["wrapper"]} ${isExpanded ? styles["wrapper_visible"] : ""}`),
        [isExpanded]
    );

    const buttonTitle = useMemo(
        () => (isExpanded ? "Hide options" : "Show options"),
        [isExpanded]
    );

    return (
        <div className={wrapperCss}>

            <div className={styles.optionsWrapper}>
                <ColumnSettings isCollapsed={optionsCollapsed} />
                <RowFilter isCollapsed={optionsCollapsed} />
                <TextFormatSettings isCollapsed={optionsCollapsed} />
            </div>

            <div className={styles.buttonWrapper}>
                <button className={styles.button} title={buttonTitle} onClick={handleTest}>
                    <SettingsIcon className={styles.icon} />
                </button>
            </div>
        </div>
    )
}

export default SettingsList