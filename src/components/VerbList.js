import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSpeechSynthesis } from 'react-recipes';
import styles from "./VerbList.module.scss";
import { AppContext } from "../AppContext";
import { getVerbGroup } from "../helpers/verbGroupHelper";
import { KANA, ROMAJI } from "../helpers/textFormatHelper";
import { unique } from "../helpers/arrayHelper";
import GroupsInfo from "./GroupsInfo";
import VerbHeaderRow from "./VerbHeaderRow";
import VerbRow from "./VerbRow";


const prepareTopHeaderCells = (emptyGroupColumns, namedGroupColumns) => {
  const emptyGroupItems = emptyGroupColumns.map((column) => ({
    ...column,
    key: `h_c_${column.name}`,
    colSpan: 1,
    rowSpan: 2,
  }));

  const groupNames = namedGroupColumns.map((column) => column.group).filter(unique);
  const namedGroupItems = groupNames.map((group) => ({
    label: group,
    key: `h_gr_${group}`,
    colSpan: namedGroupColumns.filter((r) => r.group === group).length,
    rowSpan: 1,
  }));

  return emptyGroupItems.concat(namedGroupItems);
};

const prepareBottomHeaderCells = (namedGroupColumns) =>
  namedGroupColumns.map((column) => ({
    ...column,
    key: `h_col_${column.name}`,
    colSpan: 1,
    rowSpan: 1,
  }));

const isEmptyGroupColumn = (column) => column.group == null || column.group === "";

const prepareHeaderCells = (visibleColumns) => {
  const emptyGroupColumns = visibleColumns.filter(r => isEmptyGroupColumn(r));
  const namedGroupColumns = visibleColumns.filter(r => !isEmptyGroupColumn(r));

  return ({
    topRow: prepareTopHeaderCells(emptyGroupColumns, namedGroupColumns),
    bottomRow: prepareBottomHeaderCells(namedGroupColumns),
  });
}

const prepareRowCells = (row, columnNames, isKanaVisible, isRomajiVisible, enVoice, jpVoice) => {
  const cells = [];

  for (let columnName of columnNames) {
    const value = row.columns[columnName]

    let voice = null;
    if (columnName === 'eng')
      voice = enVoice;
    else if (columnName !== 'inf-kanji')
      voice = jpVoice;

    const cell = typeof value === "string"
      ? { kana: value, isKanaVisible: true, voice }
      : { kana: value?.kana, isKanaVisible: isKanaVisible, romaji: value?.romaji, isRomajiVisible: isRomajiVisible, voice };

    cells.push(cell);
  }
  return cells;
};

const VerbList = () => {
  const [isReading, setIsReading] = useState(false);
  const [isReadingAll, setIsReadingAll] = useState(false);
  const [isReadingPaused, setIsReadingPaused] = useState(false);
  const [readingQueue, setReadingQueue] = useState([])
  const context = useContext(AppContext);

  const onReadEnd = () => {
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
  const clearReadingState = useCallback(() => {
    setIsReading(false)
    setIsReadingPaused(false)
  }, [])

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
    () => supported && jpVoice != null,
    [supported, jpVoice]
  );

  const visibleColumnNames = useMemo(
    () => context.columns.filter((r) => r.isChecked).map((i) => i.name),
    [context.columns]
  );

  const isKanaVisible = useMemo(
    () => context?.textFormat?.find((f) => f === KANA),
    [context?.textFormat]
  );

  const isRomajiVisible = useMemo(
    () => context?.textFormat?.find((f) => f === ROMAJI),
    [context?.textFormat]
  );

  const visibleColumns = useMemo(
    () => context.columns.filter((r) => r.isChecked),
    [context?.columns]
  );

  const rows = useMemo(
    () => {
      const selectedGroups = context.verbGroups.map((i) => getVerbGroup(i).symbol)
      const filteredVerbs = context.verbs.filter((v) => selectedGroups.includes(v.group))
      const rows = filteredVerbs.map(v => ({ ...v, cells: prepareRowCells(v, visibleColumnNames, isKanaVisible, isRomajiVisible, enVoice, jpVoice) }))

      return rows
    },
    [context.verbs, context.verbGroups, isKanaVisible, isRomajiVisible, visibleColumnNames, jpVoice, enVoice]
  );

  const header = useMemo(
    () => prepareHeaderCells(visibleColumns),
    [visibleColumns]
  )

  const onReadCell = useCallback((cell, rowIndex, columnIndex) => {
    setReadingQueue([{ cell, rowIndex, columnIndex, isMultiple: false }])
    setIsReadingPaused(false)
    setIsReadingAll(false)
  }, [])

  const onReadRow = useCallback((cells, rowIndex) => {
    setReadingQueue(cells.map((cell, i) => ({ cell, rowIndex, columnIndex: i, isMultiple: true })))
    setIsReadingPaused(false)
    setIsReadingAll(false)
  }, [])

  const onReadAll = useCallback(() => {
    const items = rows.flatMap((r, i) => r.cells.map((c, j) => ({ cell: c, rowIndex: i, columnIndex: j })))
    setReadingQueue(items.map((item) => ({ cell: item.cell, rowIndex: item.rowIndex, columnIndex: item.columnIndex, isMultiple: true })))
    setIsReadingPaused(false)
    setIsReadingAll(true)
  }, [rows])

  const onPauseRead = useCallback(() => {
    cancel()
    setIsReadingPaused(true)
    setIsReading(false)
  }, [])

  const onResumeRead = useCallback(() => {
    setIsReadingPaused(false)
    setIsReading(true)
  }, [])

  const onStopRead = useCallback(() => {
    cancel()
    setIsReadingAll(false)
    setReadingQueue([])
  }, [])

  useEffect(() => {
    onStopRead()
  }, [context.columns, context.verbs, context.verbGroups, onStopRead]);

  const getRowReadingCellColumnIndex = (rowIndex) => {
    const readingCell = readingQueue.length > 0 ? ({ rowIndex: readingQueue[0].rowIndex, columnIndex: readingQueue[0].columnIndex }) : null
    return readingCell?.rowIndex === rowIndex ? readingCell?.columnIndex : null
  }

  return (
    <>
      {context && (
        <>
          <table className={styles.table}>
            <VerbHeaderRow headerItems={header}
              isReadSupported={isReadSupported} isReadingAll={isReadingAll} isReadingPaused={isReadingAll && isReadingPaused}
              onReadAll={onReadAll} onPauseRead={onPauseRead} onResumeRead={onResumeRead} onStopRead={onStopRead} />
            <tbody>
              {rows.map((row, i) =>
                <VerbRow row={row} rowIndex={i} key={`row_${i}`}
                  isReadSupported={isReadSupported} isReading={isReading} isReadingPaused={isReadingPaused} readingCellColumnIndex={getRowReadingCellColumnIndex(i)}
                  onReadCell={onReadCell} onReadRow={onReadRow} onResumeRead={onResumeRead} onPauseRead={onPauseRead} onStopRead={onStopRead} />)}
            </tbody>
          </table>
          <GroupsInfo />
        </>
      )}
    </>
  );
};

export default VerbList;
