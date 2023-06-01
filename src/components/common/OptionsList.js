import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import checkIcon from "../../assets/check_icon.svg"
import closeIcon from "../../assets/close_icon.svg"
import styles from "./OptionsList.module.scss";

const OptionsList = (props) => {
  const { items, onItemSelected, title, isRightAligned, optionsWrapperCss, isCollapsed } = props;

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [listVisible, setListVisible] = useState(false);

  useEffect(() => {
    if (isCollapsed)
      handleHideOptions()
  }, [isCollapsed])

  const handleShowOptions = () => {
    setOptionsVisible(true);
    setTimeout(() => setListVisible(true), 100);
  };

  const handleHideOptions = () => {
    setListVisible(false);
    setTimeout(() => setOptionsVisible(false), 100);
  };

  const handleItemSelected = (item) => {
    if (typeof item === "string") handleHideOptions();

    if (onItemSelected) onItemSelected(item);
  };

  const wrapperCss = useMemo(
    () => (`${styles["wrapper"]} ${isRightAligned ? styles["wrapper_right"] : ""}`),
    [isRightAligned]
  );

  const optionsCss = useMemo(
    () =>
      styles.options +
      " " +
      (optionsVisible ? styles["options_visible"] : "") +
      " " +
      (listVisible ? styles["options_listVisible"] : ""),
    [optionsVisible, listVisible]
  );

  const renderItem = (item) => {
    const isString = typeof item === "string";
    const name = isString ? item : item.name;
    const key = name;
    const buttonCss =
      styles.itemButton + " " + (!isString ? styles["itemButton_withImg"] : "");

    return (
      <li
        className={styles.listItem}
        key={key}
        onClick={() => handleItemSelected(item)}
      >
        <button className={buttonCss}>
          {renderItemCheckbox(item)}
          <span className={styles.itemText}>{name}</span>
        </button>
      </li>
    );
  };

  const renderItemCheckbox = (item) => {
    switch (item.isChecked) {
      case true:
        return <img src={checkIcon} alt="+" />;
      case false:
        return <span className={styles.checkPlaceholder}></span>;
      default:
        return null;
    }
  };

  return (
    <div className={wrapperCss}>

      <div className={`${optionsCss} ${optionsWrapperCss}`}>

        <ul className={styles.list}>
          {items && items.map((i) => renderItem(i))}
        </ul>

        <button className={styles.closeButton} onClick={handleHideOptions} title="Close">
          <img src={closeIcon} alt="X" />
        </button>

      </div>

      <button
        className={styles.info}
        title={title}
        onClick={() =>
          optionsVisible ? handleHideOptions() : handleShowOptions()
        }
      >
        {props.children}
      </button>
    </div>
  );
};

OptionsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ name: PropTypes.string, isChecked: PropTypes.bool }),
    ])
  ).isRequired,
  onItemSelected: PropTypes.func.isRequired,
  title: PropTypes.string,
  isRightAligned: PropTypes.bool,
  optionsWrapperCss: PropTypes.string,
  isCollapsed: PropTypes.bool
};

export default OptionsList;
