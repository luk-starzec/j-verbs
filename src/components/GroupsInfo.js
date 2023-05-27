import React from 'react'
import styles from "./GroupsInfo.module.scss"
import { getVerbGroups } from '../helpers/verbGroupHelper';

const prepareItems = () => {
  let items = getVerbGroups().map(i => ({ text: i.label, symbol: i.symbol }));
  items.splice(1, 0, { text: "U verbs with iru/eru endings (exceptions)", symbol: "exceptionTag" })
  return items
}

const items = prepareItems();

const GroupsInfo = () => {

  const renderItem = (item) => {
    const colorCss = styles[`itemColor_${item.symbol}`]
    return (
      <li className={styles.item} key={item.symbol}>
        <div className={`${styles.itemColor} ${colorCss}`}></div>
        <div className={styles.itemName}>{item.text}</div>
      </li >)
  }

  return (
    <div className={styles.wrapper}>
      <ul className={styles.list}>
        {items.map(i => renderItem(i))}
      </ul>
    </div>
  )
}

export default GroupsInfo