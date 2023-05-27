export const VerbGroups = {
  U_VERBS: { id: 1, label: "U verbs", symbol: "u" },
  RU_VERBS: { id: 2, label: "RU verbs", symbol: "ru" },
  IRREGULAR: { id: 3, label: "Irregular", symbol: "irregular" },
};

export const getVerbGroups = () => Object.entries(VerbGroups).map(i => i[1])
export const getVerbGroup = (verbGroupId) => Object.entries(VerbGroups).map(i => i[1]).filter(r => r.id === verbGroupId)[0]
export const DefaultVerbGroupIds = getVerbGroups().map(i => i.id)
