import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSpeechSynthesis } from 'react-recipes';
import styles from "./VerbList.module.scss";
import { AppContext } from "../AppContext";
import { unique } from "../helpers/arrayHelper";
import { KANA, ROMAJI } from "../helpers/textFormatHelper";
import GroupsInfo from "./GroupsInfo";
import { getVerbGroup } from "../helpers/verbGroupHelper";
import { VerbCell } from "./VerbCell";
import { ReadControl } from "./ReadControl";

const VerbList = () => {
  const [headerItems, setHeaderItems] = useState({ topRow: [], bottomRow: [] });
  const [verbs, setVerbs] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [isReadingPaused, setIsReadingPaused] = useState(false);
  const [readingQueue, setReadingQueue] = useState([])
  const context = useContext(AppContext);

  const onReadCell = (cell, rowIndex, columnIndex) => {
    cancel()
    setReadingQueue([{ cell, rowIndex, columnIndex, isMultiple: false }])
    setIsReadingPaused(false)
  }
  const onReadRow = (cells, rowIndex) => {
    setReadingQueue(cells.map((cell, i) => ({ cell, rowIndex, columnIndex: i, isMultiple: true })))
    setIsReadingPaused(false)
  }
  const onStopRead = () => {
    cancel()
    setReadingQueue([])
  }
  const onPauseRead = () => {
    cancel()
    setIsReadingPaused(true)
    setIsReading(false)
  }
  const onResumeRead = () => {
    setIsReadingPaused(false)
    setIsReading(true)
  }
  const onReadEnd = async () => {
    let i = 1;
    while (i < readingQueue.length && readingQueue[i].cell.voice == null) {
      i++
    }
    if (readingQueue.length > 0)
      setTimeout(() =>
        setReadingQueue(s => s.slice(i)),
        500)
    else
      clearReadingState()
  }
  const clearReadingState = () => {
    setIsReading(false)
    setIsReadingPaused(false)
  }

  const { speak, cancel, supported, voices } = useSpeechSynthesis({ onEnd: onReadEnd, });

  useEffect(() => {
    if (readingQueue.length === 0) {
      clearReadingState()
      return
    }
    const next = readingQueue[0]
    if (!next.cell.voice) {
      onReadEnd()
      return
    }
    if (!isReadingPaused) {
      setIsReading(next.isMultiple)
      speak({ text: next.cell.kana, voice: next.cell.voice });
    }
  }, [readingQueue, isReadingPaused]);

  const enVoice = useMemo(
    () => voices.find(r => r.lang.startsWith('en-')),
    [voices]
  );

  const jpVoice = useMemo(
    () => voices.find(r => r.lang.startsWith('ja-')),
    [voices]
  );

  const isReadSupported = useMemo(
    () => supported && jpVoice,
    [supported, jpVoice]
  );

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

  const renderTableHeader = useCallback((items) => (
    <thead>
      <tr>
        {isReadSupported &&
          <th rowSpan={2}></th>
        }
        {items.topRow.map((i) => renderHeaderRow(i))}
      </tr>
      <tr>
        {items.bottomRow.map((i) => renderHeaderRow(i))}
      </tr>
    </thead>
  ), [isReadSupported]);

  const renderHeaderRow = ({ label, description, key, rowSpan, colSpan }) => (
    <th rowSpan={rowSpan} colSpan={colSpan} key={key}>
      <div className={styles.headerLabel}>{label}</div>
      <div className={styles.headerDescription}>{description}</div>
    </th>
  );

  const tableHeader = useMemo(() =>
    renderTableHeader(headerItems),
    [headerItems, renderTableHeader])

  const renderTableBody = (items) => {
    var columns = visibleColumns.map((i) => i.name);
    return (
      <tbody>
        {items.map((el, i) => renderRow(el, columns, i))}
      </tbody>
    );
  };

  const getRowCss = (item) => {
    let rowCss = styles[`row_${item.group}`];

    if (item.tags) {
      item.tags.split(";").forEach((tag) => {
        rowCss = `${rowCss} ${styles[`row_${tag}Tag`]}`;
      });
    }
    return rowCss;
  };

  const prepareCells = (item, columns) => {
    const cells = [];

    for (let column of columns) {
      const value = item.columns[column]

      let voice = null;
      if (column === 'eng')
        voice = enVoice;
      else if (column !== 'inf-kanji')
        voice = jpVoice;

      const cell = typeof value === "string"
        ? { kana: value, isKanaVisible: true, voice }
        : { kana: value?.kana, isKanaVisible: isKanaVisible, romaji: value?.romaji, isRomajiVisible: isRomajiVisible, voice };

      cells.push(cell);
    }
    return cells;
  };

  const renderRow = (item, columns, rowIndex) => {
    const rowCss = getRowCss(item);
    const cells = prepareCells(item, columns);
    const rowKey = `row_${rowIndex}`;

    const readingCell = readingQueue.length > 0 ? readingQueue[0] : null;
    const isReadingRow = readingCell?.rowIndex === rowIndex;
    const showPlay = !isReading || !isReadingRow;
    const showPause = isReading && isReadingRow;
    const showStop = (isReading || isReadingPaused) && isReadingRow;
    const onPlay = () => (isReadingPaused && isReadingRow) ? onResumeRead() : onReadRow(cells, rowIndex);

    return (
      <tr key={rowKey} className={rowCss}>
        {isReadSupported &&
          <td className={styles.readControlCell}>
            <ReadControl
              showPlay={showPlay}
              showPause={showPause}
              showStop={showStop}
              onPlay={onPlay}
              onPause={onPauseRead}
              onStop={onStopRead} />
          </td>}
        {cells.map((cell, i) => (
          <VerbCell key={`cell_${rowKey}_${i}`}
            cell={cell}
            isReadSupported={isReadSupported}
            isReading={readingCell?.rowIndex === rowIndex && readingCell?.columnIndex === i}
            isPaused={isReadingPaused}
            onRead={() => onReadCell(cell, rowIndex, i)} />
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
    if (!context)
      return;

    const emptyGroupColumns = visibleColumns.filter(r => isEmptyGroupColumn(r));
    const namedGroupColumns = visibleColumns.filter(r => !isEmptyGroupColumn(r));

    setHeaderItems({
      topRow: prepareTopHeaderItems(emptyGroupColumns, namedGroupColumns),
      bottomRow: prepareBottomHeaderItems(namedGroupColumns),
    });

    onStopRead()
  }, [context, visibleColumns]);

  useEffect(() => {
    const selectedGroups = context.verbGroups.map((i) => getVerbGroup(i).symbol)
    const filteredVerbs = context.verbs.filter((v) => selectedGroups.includes(v.group))
    setVerbs(filteredVerbs);
    onStopRead()
  }, [context, context.verbs, context.verbsGroups]);

  return (
    <>
      {context && (
        <>
          <table className={styles.table}>
            {tableHeader}
            {renderTableBody(verbs)}
          </table>
          <GroupsInfo />
        </>
      )}
    </>
  );
};

export default VerbList;
