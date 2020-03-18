export const createitemObject = (item): string =>
  JSON.stringify(item).replace(/\"([^(\")"]+)\":/g, '$1:')
