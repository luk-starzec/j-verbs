import React, { useContext, useEffect, useMemo, useState } from "react";
import styles from "./VerbList.module.scss";
import { AppContext } from "../AppContext";
import { unique } from "../helpers/arrayHelper";
import { KANA, ROMAJI } from "./TextFormatSettings";
import { VerbGroups } from "./RowFilter";

const VerbList = () => {
  const [headerItems, setHeaderItems] = useState({ topRow: [], bottomRow: [] });
  const [verbs, setVerbs] = useState([]);
  const context = useContext(AppContext);

  const visibleColumns = useMemo(
    () => context.columns.filter((r) => r.isChecked),
    [context?.columns]
  );

  const isKanaVisible = useMemo(
    () => context?.textFormat?.find((f) => f === KANA),
    [context?.textFormat]
  );

  const isRomajiVisible = useMemo(
    () => context?.textFormat?.find((f) => f === ROMAJI),
    [context?.textFormat]
  );

  const renderTableHeader = (items) => (
    <thead>
      <tr>{items.topRow.map((i) => renderHeaderRow(i))}</tr>
      <tr>{items.bottomRow.map((i) => renderHeaderRow(i))}</tr>
    </thead>
  );

  const renderHeaderRow = ({ label, description, key, rowSpan, colSpan }) => (
    <th rowSpan={rowSpan} colSpan={colSpan} key={key}>
      <div className={styles.headerLabel}>{label}</div>
      <div className={styles.headerDescription}>{description}</div>
    </th>
  );

  const renderTableBody = (items) => {
    var columns = visibleColumns.map((i) => i.name);
    return (
      <tbody>{items.map((el, i) => renderRow(el, columns, `v_${i}`))}</tbody>
    );
  };

  const isColumnVisible = (columns, columnName) =>
    columns.find((r) => r === columnName) != null;

  const getRowCss = (item) => {
    let rowCss = styles[`row${item.group}`];

    if (item.tags) {
      item.tags.split(";").forEach((tag) => {
        rowCss = rowCss + " " + styles[`row${tag}Tag`];
      });
    }
    return rowCss;
  };

  const prepareCells = (item, columns) => {
    let cells = [];
    for (let field in item.columns) {
      if (!isColumnVisible(columns, field)) continue;

      const value = item.columns[field];
      const cell =
        typeof value === "string"
          ? { kana: value, isKanaOnly: true }
          : { kana: value.kana, romaji: value.romaji };

      cells.push(cell);
    }
    return cells;
  };

  const renderRow = (item, columns, rowKey) => {
    const rowCss = getRowCss(item);
    const cells = prepareCells(item, columns);

    return (
      <tr key={rowKey} className={rowCss}>
        {cells.map((el, i) => (
          <td key={`${rowKey}_${i}`}>
            {(isKanaVisible || el.isKanaOnly) && (
              <div className={styles.cellMainText}>{el.kana}</div>
            )}
            {isRomajiVisible && (
              <div className={styles.cellSubText}>{el.romaji}</div>
            )}
          </td>
        ))}
      </tr>
    );
  };

  const prepareTopHeaderItems = (emptyGroupColumns, namedGroupColumns) => {
    const emptyGroupItems = emptyGroupColumns.map((i) => ({
      ...i,
      key: `c_${i.name}`,
      colSpan: 1,
      rowSpan: 2,
    }));

    const groupNames = namedGroupColumns.map((i) => i.group).filter(unique);
    const namedGroupItems = groupNames.map((i) => ({
      label: i,
      key: `gr_${i}`,
      colSpan: namedGroupColumns.filter((r) => r.group === i).length,
      rowSpan: 1,
    }));

    return emptyGroupItems.concat(namedGroupItems);
  };

  const prepareBottomHeaderItems = (namedGroupColumns) =>
    namedGroupColumns.map((i) => ({
      ...i,
      key: `col_${i.name}`,
      colSpan: 1,
      rowSpan: 1,
    }));

  const isEmptyGroupColumn = (column) =>
    column.group == null || column.group === "";

  useEffect(() => {
    if (!context) return;

    const emptyGroupColumns = visibleColumns.filter((r) =>
      isEmptyGroupColumn(r)
    );
    const namedGroupColumns = visibleColumns.filter(
      (r) => !isEmptyGroupColumn(r)
    );

    setHeaderItems({
      topRow: prepareTopHeaderItems(emptyGroupColumns, namedGroupColumns),
      bottomRow: prepareBottomHeaderItems(namedGroupColumns),
    });
  }, [context, visibleColumns]);

  useEffect(() => {
    const selectedGroups = context.verbGroups.map(
      (i) => Object.entries(VerbGroups).filter((f) => f[1] === i)[0][0]
    );
    //console.log(selectedGroups);
    const filteredVerbs = context.verbs.filter((v) =>
      selectedGroups.includes(v.group.toUpperCase())
    );
    //console.log(items);
    setVerbs(filteredVerbs);
  }, [context, context.verbs, context.verbsGroups]);

  return (
    <>
      {context && (
        <table className={styles.table}>
          {renderTableHeader(headerItems)}
          {renderTableBody(verbs)}
        </table>
      )}
    </>
  );
};

export default VerbList;
