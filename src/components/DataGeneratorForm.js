import React, { useState } from 'react'
import styles from "./DataGeneratorForm.module.scss"

const INITIAL_STATE = {
    group: "",
    tag: "",
    text: "",
    kana: "",
    kanji: ""
}

const DataConverterForm = () => {
    const [form, setForm] = useState(INITIAL_STATE)
    const [result, setResult] = useState()

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value,
        });
    };

    const handleIsExceptionChange = (event) => {
        const tag = event.target.checked ? "exception" : "";
        setForm({
            ...form,
            tag: tag,
        });
    }

    const handleClear = (event) => {
        event.preventDefault();
        setForm(INITIAL_STATE)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        const textData = form.text.replace(/(?:\r\n|\r|\n)/g, ";")
        const kanaData = form.kana.replace(/(?:\r\n|\r|\n)/g, ";")

        const request = {
            ...form,
            text: textData,
            kana: kanaData,
        }

        try {
            const res = await fetch("http://localhost:5230/convert-verb", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });
            const resJson = await res.json();

            let resText = JSON.stringify(resJson)
            resText = resText.replace(/(?:\\)/g, "")
            resText = resText.substring(1, resText.length - 1)

            setResult(resText)
        }
        catch (err) {
            console.log(err)
        }
    };

    const copyResult = async () => {
        try {
            await navigator.clipboard.writeText(result);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={styles.wrapper}>
            <div className={styles.row}>
                <label htmlFor='group'>Group</label>
                <input
                    id='group'
                    type='text'
                    value={form.group}
                    onChange={handleChange}
                />
                <input
                    id='isException'
                    type='checkbox'
                    checked={form.tag.length > 0}
                    onChange={handleIsExceptionChange} />
                <label htmlFor='isException' className={styles.checkboxLabel}>Exception</label>
            </div>
            <div className={styles.row}>
                <label htmlFor='kanji'>Kanji</label>
                <input
                    id='kanji'
                    type='text'
                    value={form.kanji}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.row}>
                <label htmlFor='text'>Text</label>
                <textarea
                    id='text'
                    rows={9}
                    value={form.text}
                    onChange={handleChange}
                />
            </div>
            <div className={styles.row}>
                <label htmlFor='kana'>Kana</label>
                <textarea
                    id='kana'
                    rows={8}
                    value={form.kana}
                    onChange={handleChange}
                />
                <button className={styles.clearButton} onClick={handleClear}>Clear form</button>
            </div>
            <button type='submit'>Submit</button>

            {result && <div className={styles.result}>
                Result:
                <p>
                    {result}
                    <button className={styles.copyButton} onClick={() => copyResult()}>copy</button>
                </p>
            </div>}
        </form>)
}

export default DataConverterForm