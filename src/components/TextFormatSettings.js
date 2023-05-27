import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import styles from "./TextFormatSettings.module.scss";
import OptionsList from "./common/OptionsList";
import { AppContext } from "../AppContext";
import { saveSettings } from "../helpers/dataHelper";
import { TextFormats } from "../helpers/textFormatHelper";

const items = TextFormats.map((format) => format.name);

const getItem = (textFormat) =>
  TextFormats.find((f) => f.value.toString() === textFormat.toString()).name;

const TextFormatSettings = ({ isCollapsed }) => {
  const context = useContext(AppContext);
  const [selected, setSelected] = useState(getItem(context?.textFormat));

  const onItemSelected = (item) => {
    setSelected(item);
    const format = TextFormats.find((f) => f.name === item);
    const ctx = { ...context, textFormat: format.value }

    context.setContext(ctx);
    saveSettings(ctx);
  };

  return (
    <div className={styles.wrapper}>
      <OptionsList
        items={items}
        onItemSelected={onItemSelected}
        title="Text options"
        isCollapsed={isCollapsed}
      >
        <span>
          {selected}
        </span>
      </OptionsList>
    </div>
  );
};

TextFormatSettings.propTypes = {
  isCollapsed: PropTypes.bool
};

export default TextFormatSettings;
