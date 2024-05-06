import React from 'react'
import styles from "./VerbCell.module.scss";
import speakerOnIcon from "../assets/speaker_high_icon.svg"
import speakerOffIcon from "../assets/speaker_none_icon.svg"

const VerbCell = ({ cell, isReadSupported, isReading, isPaused, onRead }) => {

  const cellCss = isReading ? styles.cellReading : null;
  const speakerIcon = isReading && !isPaused ? speakerOnIcon : speakerOffIcon;
  const speakerCss = `${styles.readButton} ${isReading ? styles.readingButton : ''}`;
  const speakerTitle = `read "${cell.kana}"`;

  return (
    <td className={cellCss}>
      <div className={styles.cellWrapper}>
        {cell.isKanaVisible &&
          <div className={styles.cellMainText}>
            {cell.kana}
          </div>
        }
        {cell.isRomajiVisible &&
          <div className={styles.cellSubText}>
            {cell.romaji}
          </div>
        }
        {isReadSupported && cell.voice &&
          <button className={speakerCss} onClick={() => onRead()} title={speakerTitle}>
            <img src={speakerIcon} alt="read" />
          </button>
        }
      </div>
    </td >
  )
}

export default VerbCell