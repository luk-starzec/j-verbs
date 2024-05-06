import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useSpeechSynthesis } from 'react-recipes';
import styles from "./VerbList.module.scss";
import { AppContext } from "../AppContext";
import { getVerbGroup } from "../helpers/verbGroupHelper";
import GroupsInfo from "./GroupsInfo";
import VerbHeaderRow from "./VerbHeaderRow";
import VerbRow from "./VerbRow";

const VerbList = () => {
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

  const onStopRead = useCallback(() => {
    cancel()
    setReadingQueue([])
  }, [cancel])

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

  const visibleColumns = useMemo(
    () => context.columns.filter((r) => r.isChecked),
    [context?.columns]
  );

  const visibleColumnNames = useMemo(
    () => visibleColumns.map((i) => i.name),
    [visibleColumns]
  );

  useEffect(() => {
    const selectedGroups = context.verbGroups.map((i) => getVerbGroup(i).symbol)
    const filteredVerbs = context.verbs.filter((v) => selectedGroups.includes(v.group))
    setVerbs(filteredVerbs);
    onStopRead()
  }, [context, context.verbs, context.verbsGroups]);


  useEffect(() => {
    onStopRead()
  }, [context?.columns]);

  return (
    <>
      {context && (
        <>
          <table className={styles.table}>
            <VerbHeaderRow isReadSupported={isReadSupported} />
            <tbody>
              {verbs.map((verb, i) =>
                <VerbRow row={verb} columnNames={visibleColumnNames} rowIndex={i} key={`row_${i}`}
                  isReadSupported={isReadSupported} enVoice={enVoice} jpVoice={jpVoice}
                  readingQueue={readingQueue} isReading={isReading} isReadingPaused={isReadingPaused}
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
