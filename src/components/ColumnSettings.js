import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./ColumnSettings.module.scss";
import icon from "../assets/table_icon.svg"
import ColumnList from "./ColumnList";

const ColumnSettings = ({ isCollapsed }) => {
  const [optionsVisible, setOptionsVisible] = useState(false);

  useEffect(() => {
    if (isCollapsed)
      handleHideOptions()
  }, [isCollapsed])

  const handleShowOptions = () => {
    setOptionsVisible(true);
  };

  const handleHideOptions = () => {
    setOptionsVisible(false)
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.optionsWrapper} ${optionsVisible ? styles.optionsWrapper_visible : ""}`}>
        <div className={styles.columnsWrapper}>
          <ColumnList />
        </div>
        <button className={styles.closeButtton} onClick={handleHideOptions} title="Close">
          <span>
            X
          </span>
        </button>
      </div>

      <button
        className={styles.optionsButton}
        title="Column options"
        onClick={() =>
          optionsVisible ? handleHideOptions() : handleShowOptions()
        }
      >
        <img src={icon} alt="..." className={styles.icon} />
      </button>

    </div>
  );
};

ColumnSettings.propTypes = {
  isCollapsed: PropTypes.bool
};

export default ColumnSettings;
