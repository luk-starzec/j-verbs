import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./RowFilter.module.scss";
import icon from "../assets/filter_icon.svg"
import OptionsList from "./common/OptionsList";
import { AppContext } from "../AppContext";
import { VerbGroups } from "../helpers/verbGroupHelper";
import { saveSettings } from "../helpers/dataHelper";

const verbGroupsList = [
  { name: VerbGroups.U_VERBS.label, value: VerbGroups.U_VERBS.id },
  { name: VerbGroups.RU_VERBS.label, value: VerbGroups.RU_VERBS.id },
  { name: VerbGroups.IRREGULAR.label, value: VerbGroups.IRREGULAR.id },
];

const RowFilter = ({ isCollapsed }) => {
  const context = useContext(AppContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const newItems = verbGroupsList.map((type) => ({
      name: type.name,
      isChecked: context.verbGroups.indexOf(type.value) >= 0,
    }));

    setItems(newItems);
  }, [context, context?.verbGroups]);

  const onItemSelected = (item) => {
    const selectedValue = verbGroupsList.find(f => f.name === item.name).value;

    let selectedVerbGroups = context.verbGroups;
    item.isChecked
      ? selectedVerbGroups.splice(selectedVerbGroups.indexOf(selectedValue), 1)
      : selectedVerbGroups.push(selectedValue);

    const ctx = { ...context, verbGroups: selectedVerbGroups }
    context.setContext(ctx);
    saveSettings(ctx);
  };

  return (
    <div className={styles.wrapper}>
      <OptionsList
        items={items}
        onItemSelected={onItemSelected}
        title="Row filter"
        optionsWrapperCss={styles.optionsWrapper}
        isCollapsed={isCollapsed}
      >
        <img src={icon} className={styles.icon} alt="..." />
      </OptionsList>
    </div>
  );
};

RowFilter.propTypes = {
  isCollapsed: PropTypes.bool
};

export default RowFilter;
