import { memo } from 'react'
import styles from "./VerbHeaderRow.module.scss";
import ReadControl from './ReadControl';

const VerbHeaderRow = memo(({ headerItems, isReadSupported, isReadingAll, isReadingPaused, onReadAll, onPauseRead, onResumeRead, onStopRead }) => {

    const renderHeaderRow = ({ label, description, key, rowSpan, colSpan }) => (
        <th rowSpan={rowSpan} colSpan={colSpan} key={key}>
            <div>{label}</div>
            <div className={styles.headerDescription}>{description}</div>
        </th>
    );

    return (
        <thead>
            <tr>
                {isReadSupported &&
                    <th rowSpan={2} className={styles.readCell}>
                        <ReadControl
                            showSpeaker={!isReadingAll}
                            showPlay={isReadingAll && isReadingPaused}
                            showPause={isReadingAll && !isReadingPaused}
                            showStop={isReadingAll}
                            speakerTitle='read all'
                            onSpeaker={onReadAll}
                            onPlay={onResumeRead}
                            onPause={onPauseRead}
                            onStop={onStopRead} />
                    </th>
                }
                {headerItems.topRow.map((i) => renderHeaderRow(i))}
            </tr>
            <tr>
                {headerItems.bottomRow.map((i) => renderHeaderRow(i))}
            </tr>
        </thead>
    )
})

export default VerbHeaderRow;