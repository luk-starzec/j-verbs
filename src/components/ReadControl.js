import React from 'react'
import styles from "./ReadControl.module.scss";
import speakerIcon from "../assets/speaker_none_icon.svg"
import playIcon from "../assets/play_icon.svg"
import pauseIcon from "../assets/pause_icon.svg"
import stopIcon from "../assets/stop_icon.svg"

const ReadControl = ({ showSpeaker, showPlay, showPause, showStop, speakerTitle, onSpeaker, onPlay, onPause, onStop }) => {

    let buttonCss = styles.button;
    if (showStop)
        buttonCss = `${buttonCss} ${styles.buttonBorder}`

    return (
        <div className={styles.wrapper}>
            {showSpeaker &&
                <button className={buttonCss} onClick={() => onSpeaker()} title={speakerTitle}>
                    <img src={speakerIcon} alt="read" />
                </button>
            }
            {showPlay &&
                <button className={buttonCss} onClick={() => onPlay()} title='continue reading'>
                    <img src={playIcon} alt="continue" />
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
export default ReadControl