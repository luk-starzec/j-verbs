import { DefaultTextFormatValue } from "./textFormatHelper";
import { DefaultVerbGroupIds } from "./verbGroupHelper";

const SETTINGS_STORAGE_KEY = "settings"

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
  const verbGroups = DefaultVerbGroupIds
  const textFormat = DefaultTextFormatValue

  const settings = getSettings();

  const ctx = {
    columns: settings?.columns ?? columns,
    verbs: verbs,
    verbGroups: settings?.verbGroups ?? verbGroups,
    textFormat: settings?.textFormat ?? textFormat,
    setContext: setContext,
  };

  setContext(ctx);
};

export const saveSettings = (context) => {
  const settings = {
    columns: context.columns,
    verbGroups: context.verbGroups,
    textFormat: context.textFormat,
  }
  const value = JSON.stringify(settings)
  localStorage.setItem(SETTINGS_STORAGE_KEY, value)
}

const getSettings = () => {
  const value = localStorage.getItem(SETTINGS_STORAGE_KEY)
  const settings = JSON.parse(value)
  return settings;
}
