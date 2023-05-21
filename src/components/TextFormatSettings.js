import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import styles from "./TextFormatSettings.module.scss";
import OptionsList from "./common/OptionsList";
import { AppContext } from "../AppContext";

export const KANA = 1;
export const ROMAJI = 2;

const formats = [
  { name: "あ", value: [KANA] },
  { name: "a", value: [ROMAJI] },
  { name: "あ/a", value: [KANA, ROMAJI] },
];

const items = formats.map((format) => format.name);

const getItem = (textFormat) =>
  formats.find((f) => f.value.toString() === textFormat.toString()).name;

const TextFormatSettings = ({ isCollapsed }) => {
  const context = useContext(AppContext);
  const [selected, setSelected] = useState(getItem(context?.textFormat));

  const onItemSelected = (item) => {
    setSelected(item);
    const format = formats.find((f) => f.name === item);
    context.setContext({ ...context, textFormat: format.value });
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
