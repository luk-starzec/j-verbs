import { createContext } from "react";

export const AppContext = createContext({
  columns: {},
  verbs: [],
  textFormat: [],
  verbGroups: [],
  setContext: null,
});
