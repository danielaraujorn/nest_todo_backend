export const objectToItem = (item): string =>
  JSON.stringify(item)
    .replace(/\"([^(\")"]+)\":/g, '$1:')
    .replace(/^\{|\}$/g, '')
