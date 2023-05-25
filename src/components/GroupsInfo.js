import React from 'react'
import styles from "./GroupsInfo.module.scss"
import { getVerbGroups } from './RowFilter'

const verbGroups = getVerbGroups();

const GroupsInfo = () => {

  const renderItem = (verbGroup) => {
    const colorCss = styles[`itemColor_${verbGroup.symbol}`]
    return (
      <li className={styles.item}>
        <div className={styles.itemColor + " " + colorCss}></div>
        <div className={styles.itemName}>{verbGroup.label}</div>
      </li >)
  }

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {verbGroups.map(i => renderItem(i))}
      </ul>
    </div>
  )
}

export default GroupsInfo