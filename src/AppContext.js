import { createContext } from "react";

export const AppContext = createContext({
  columns: {},
  varbs: [],
  textFormat: [],
  verbGroups: [],
  setContext: null,
});
