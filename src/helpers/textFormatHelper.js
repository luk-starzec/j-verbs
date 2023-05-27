
export const KANA = 1;
export const ROMAJI = 2;

export const TextFormats = [
    { name: "あ", value: [KANA] },
    { name: "a", value: [ROMAJI] },
    { name: "あ/a", value: [KANA, ROMAJI] },
];

export const DefaultTextFormatValue = [KANA, ROMAJI]