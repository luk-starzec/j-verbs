import React, { useContext, useEffect, useState } from "react";
import styles from "./RowFilter.module.scss";
import OptionsList from "./common/OptionsList";
import { AppContext } from "../AppContext";

export const VerbGroups = {
  U_VERBS: 1,
  RU_VERBS: 2,
  IRREGULAR: 3,
};

const verbGroupsList = [
  { name: "U verbs", value: VerbGroups.U_VERBS },
  { name: "RU verbs", value: VerbGroups.RU_VERBS },
  { name: "Irregular", value: VerbGroups.IRREGULAR },
];

const RowFilter = () => {
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
    const selectedValue = verbGroupsList.find(
      (f) => f.name === item.name
    ).value;

    let selectedVerbGroups = context.verbGroups;
    item.isChecked
      ? selectedVerbGroups.splice(selectedVerbGroups.indexOf(selectedValue), 1)
      : selectedVerbGroups.push(selectedValue);

    context.setContext({ ...context, verbGroups: selectedVerbGroups });
  };

  return (
    <div className={styles.wrapper}>
      <OptionsList
        items={items}
        onItemSelected={onItemSelected}
        optionsWrapperCss={styles.optionsWrapper}
      >
        <img src="assets/filter24.png" alt="..." />
      </OptionsList>
    </div>
  );
};

export default RowFilter;
