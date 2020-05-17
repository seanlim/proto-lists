// TODO: move this to the server side
export const searchList = (id, items)  => {
  let item = null;
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      item = items[i];
      break;
    } 
  }
  return item;
}

export const buildOrderedList = (node, searchFn, l = []) => {
    if (node.next === null) return [...l, node];
    return buildOrderedList(searchFn(node.next), searchFn, [...l, node]);
}
