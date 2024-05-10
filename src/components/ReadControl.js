import React from 'react'
import styles from "./ReadControl.module.scss";
import { ReactComponent as SpeakerIcon } from "../assets/speaker_none_icon.svg"
import { ReactComponent as PlayIcon } from "../assets/play_icon.svg"
import { ReactComponent as PauseIcon } from "../assets/pause_icon.svg"
import { ReactComponent as StopIcon } from "../assets/stop_icon.svg"

const ReadControl = ({ showSpeaker, showPlay, showPause, showStop, speakerTitle, onSpeaker, onPlay, onPause, onStop }) => {

    let buttonCss = styles.button;
    if (showStop)
        buttonCss = `${buttonCss} ${styles.buttonBorder}`

    return (
        <div className={styles.wrapper}>
            {showSpeaker &&
                <button className={buttonCss} onClick={() => onSpeaker()} title={speakerTitle}>
                    <SpeakerIcon />
                </button>
            }
            {showPlay &&
                <button className={buttonCss} onClick={() => onPlay()} title='continue reading'>
                    <PlayIcon />
                </button>
            }
            {showPause &&
                <button className={buttonCss} onClick={() => onPause()} title='pause reading'>
                    <PauseIcon />
                </button>
            }
            {showStop &&
                <button className={buttonCss} onClick={() => onStop()} title='stop reading'>
                    <StopIcon />
                </button>}
        </div>
    )
}
export default ReadControl