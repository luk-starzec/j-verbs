import React, { useContext } from "react";
import styles from "./ColumnList.module.scss";
import { AppContext } from "../AppContext";
import Checkbox, { CHECKED, INDETERMINATE, UNCHECKED } from "./common/Checkbox";
import { unique } from "../helpers/arrayHelper";
import { saveSettings } from "../helpers/dataHelper";

const ColumnList = () => {
    const context = useContext(AppContext);

    const renderElements = (columns) => {
        if (columns === null || columns.length === 0) return null;

        const emptyGroup = columns.filter((r) => r.group == null || r.group === "");
        const namedGroup = columns.filter((r) => r.group && r.group !== "");
        const groupNames = namedGroup.map((i) => i.group).filter(unique);

        return (
            <ul className={styles.list}>
                {emptyGroup.map((i) => renderItem(i))}
                {groupNames.map((i) =>
                    renderGroupItem(
                        i,
                        namedGroup.filter((r) => r.group === i)
                    )
                )}
            </ul>
        );
    };

    const renderGroupItem = (groupName, items) => {
        const allCount = items.length;
        const checkedCount = items.filter((r) => r.isChecked).length;

        let status;
        if (checkedCount === allCount) {
            status = CHECKED;
        } else if (checkedCount === 0) {
            status = UNCHECKED;
        } else {
            status = INDETERMINATE;
        }

        return (
            <li className={styles.listItem} key={`gr_${groupName}`}>
                <Checkbox
                    value={groupName}
                    status={status}
                    onChange={(e) => handleGroupItemClick(e.target)}
                    labelClassName={styles.label}
                >
                    {groupName}
                    {renderItemsList(items)}
                </Checkbox>
            </li>
        );
    };

    const renderItemsList = (items) => {
        if (!items || items.length === 0) return null;

        return items && <ul className={styles.list}>{renderItems(items)}</ul>;
    };

    const renderItems = (items) => {
        if (!items || items.length === 0) return null;

        return items.map((item) => renderItem(item));
    };

    const handleGroupItemClick = (checkbox) => {
        const isChecked = checkbox.checked;
        const name = checkbox.value;

        const children =
            checkbox.parentElement.parentElement.lastChild.getElementsByTagName(
                "input"
            );

        for (let element of children) {
            element.checked = isChecked;
        }
        setGroupIsChecked(name, isChecked);
    };

    const handleColumnItemClick = (checkbox) => {
        const isChecked = checkbox.checked;
        const name = checkbox.value;
        setItemIsChecked(name, isChecked);
    };

    const setItemIsChecked = (itemName, isChecked) => {
        const result = context.columns.map((i) => ({
            ...i,
            isChecked: i.name === itemName ? isChecked : i.isChecked,
        }));

        const ctx = { ...context, columns: result }
        context.setContext(ctx);
        saveSettings(ctx);
    };

    const setGroupIsChecked = (groupName, isChecked) => {
        const result = context.columns.map((i) => ({
            ...i,
            isChecked: i.group === groupName ? isChecked : i.isChecked,
        }));
        context.setContext({ ...context, columns: result });
    };

    const renderItem = (item) => (
        <li className={styles.listItem} key={`item_${item.name}`}>
            <Checkbox
                value={item.name}
                status={item.isChecked ? CHECKED : UNCHECKED}
                disabled={item.isDisabled ? "disabled" : ""}
                onChange={(e) => handleColumnItemClick(e.target)}
                labelClassName={styles.label}
            >
                {item.label}
                {item.description != null && item.description.length > 0 && (
                    <span className={styles.description}> ({item.description})</span>
                )}
            </Checkbox>
        </li>
    );

    return (
        <div className={styles.wrapper}>
            {context && renderElements(context.columns)}
        </div>
    );
};

export default ColumnList