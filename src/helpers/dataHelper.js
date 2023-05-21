import { VerbGroups } from "../components/RowFilter";
import { KANA, ROMAJI } from "../components/TextFormatSettings";

const getData = (url) => {
  fetch(url)
    .then((response) => response.json())
    .catch((e) => {
      console.log(e.message);
    });
};

export const getVerbsData = () => getData("./data/verbs.json");

export const getColumnsData = () => getData("./data/columns.json");

const fetchVerbs = async () => {
  const urlVerbs = "./data/verbs.json";
  const response = await fetch(urlVerbs);

  return await response.json();
};

const fetchColumns = async () => {
  const urlColumns = "./data/columns.json";
  const response = await fetch(urlColumns);
  const dataColumns = await response.json();

  return dataColumns
    .map((gi) => gi.items.map((i) => ({ group: gi.group, ...i })))
    .flat();
};

export const initAppContext = async (setContext) => {
  const data = await Promise.all([fetchColumns(), fetchVerbs()]);

  const columns = data[0];
  const verbs = await data[1];
  const verbGroups = [
    VerbGroups.U_VERBS,
    VerbGroups.RU_VERBS,
    VerbGroups.IRREGULAR,
  ];
  const textFormat = [KANA, ROMAJI];

  const ctx = {
    columns: columns,
    verbs: verbs,
    verbGroups: verbGroups,
    textFormat: textFormat,
    setContext: setContext,
  };

  setContext(ctx);
};

// import { useEffect, useState } from "react";

// export const useFetch = (url) => {
//   const [status, setStatus] = useState("idle");
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     if (!url) return;
//     const fetchData = async () => {
//       setStatus("fetching");
//       const response = await fetch(url);
//       const data = await response.json();
//       setData(data);
//       setStatus("fetched");
//     };

//     fetchData();
//   }, [url]);

//   return { status, data };
// };
