import React, { memo } from "react";
import styles from "./VerbRow.module.scss";
import ReadControl from "./ReadControl";
import VerbCell from "./VerbCell";

const VerbRow = memo(({ row, rowIndex, isReadSupported, readingCellColumnIndex, isReading, isReadingPaused, onReadCell, onReadRow, onResumeRead, onPauseRead, onStopRead }) => {

    const getRowCss = (item) => {
        let rowCss = styles[`row_${item.group}`];

        if (item.tags) {
            item.tags.split(";").forEach((tag) => {
                rowCss = `${rowCss} ${styles[`row_${tag}Tag`]}`;
            });
        }
        return rowCss;
    };
    const rowCss = getRowCss(row);

    const isReadingRow = readingCellColumnIndex != null;

    return (
        <tr className={rowCss}>
            {isReadSupported &&
                <td className={styles.readControlCell}>
                    <ReadControl
                        showSpeaker={!isReadingRow || (!isReading && !isReadingPaused)}
                        showPlay={isReadingRow && isReadingPaused}
                        showPause={isReading && isReadingRow}
                        showStop={(isReading || isReadingPaused) && isReadingRow}
                        speakerTitle='read row'
                        onSpeaker={() => onReadRow(row.cells, rowIndex)}
                        onPlay={onResumeRead}
                        onPause={onPauseRead}
                        onStop={onStopRead} />
                </td>}
            {row.cells.map((cell, i) => (
                <VerbCell key={`cell_${rowIndex}_${i}`}
                    cell={cell}
                    isReadSupported={isReadSupported}
                    isReading={readingCellColumnIndex === i}
                    isPaused={isReadingPaused}
                    onRead={() => onReadCell(cell, rowIndex, i)} />
            ))}
        </tr>
    )
})

export default VerbRow