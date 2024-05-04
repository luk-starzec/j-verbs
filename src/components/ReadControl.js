import React from 'react'
import styles from "./ReadControl.module.scss";
import speakerIcon from "../assets/speaker_none_icon.svg"
import playIcon from "../assets/play_icon.svg"
import pauseIcon from "../assets/pause_icon.svg"
import stopIcon from "../assets/stop_icon.svg"

export const ReadControl = ({ showPlay, showPause, showStop, onPlay, onPause, onStop }) => {

    const playImage = showStop ? playIcon : speakerIcon;
    const playTitle = showStop ? 'continue reading' : 'read row'
    let buttonCss = styles.button;
    if (showStop)
        buttonCss = `${buttonCss} ${styles.buttonBorder}`

    return (
        <div className={styles.wrapper}>
            {showPlay &&
                <button className={buttonCss} onClick={() => onPlay()} title={playTitle}>
                    <img src={playImage} alt="read" />
                </button>
            }
            {showPause &&
                <button className={buttonCss} onClick={() => onPause()} title='pause reading'>
                    <img src={pauseIcon} alt="pause" />
                </button>
            }
            {showStop &&
                <button className={buttonCss} onClick={() => onStop()} title='stop reading'>
                    <img src={stopIcon} alt="stop" />
                </button>}
        </div>
    )
}
