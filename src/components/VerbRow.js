import React, { useContext, useMemo } from "react";
import styles from "./VerbRow.module.scss";
import { KANA, ROMAJI } from "../helpers/textFormatHelper";
import { AppContext } from "../AppContext";
import ReadControl from "./ReadControl";
import VerbCell from "./VerbCell";

const VerbRow = ({ row, columnNames, rowIndex, isReadSupported, enVoice, jpVoice, readingQueue, isReading, isReadingPaused, onReadCell, onReadRow, onResumeRead, onPauseRead, onStopRead }) => {
    const context = useContext(AppContext);

    const isKanaVisible = useMemo(
        () => context?.textFormat?.find((f) => f === KANA),
        [context?.textFormat]
    );

    const isRomajiVisible = useMemo(
        () => context?.textFormat?.find((f) => f === ROMAJI),
        [context?.textFormat]
    );

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

    const rowCss = getRowCss(row);
    const cells = prepareCells(row, columnNames);

    const readingCell = readingQueue.length > 0 ? readingQueue[0] : null;
    const isReadingRow = readingCell?.rowIndex === rowIndex;
    const showPlay = !isReading || !isReadingRow;
    const showPause = isReading && isReadingRow;
    const showStop = (isReading || isReadingPaused) && isReadingRow;
    const onPlay = () => (isReadingPaused && isReadingRow) ? onResumeRead() : onReadRow(cells, rowIndex);

    return (
        <tr className={rowCss}>
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
                <VerbCell key={`cell_${rowIndex}_${i}`}
                    cell={cell}
                    isReadSupported={isReadSupported}
                    isReading={readingCell?.rowIndex === rowIndex && readingCell?.columnIndex === i}
                    isPaused={isReadingPaused}
                    onRead={() => onReadCell(cell, rowIndex, i)} />
            ))}
        </tr>
    )
}

export default VerbRow