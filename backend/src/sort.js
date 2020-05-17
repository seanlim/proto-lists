const searchList = (id, items)  => {
  let item = null;
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      item = items[i];
      break;
    } 
  }
  return item;
};
const buildOrderedList = (node, list, includeNode,  l=[]) => {
  if (node.next === null) return [...l, node];
  return buildOrderedList(
    searchList(node.next, list),
    list.filter(i => i.id !== node.id), // Crashes on circular list but
                                        // searches faster as we progress
    true,
    !includeNode ? l: [...l, node]
  );
};
const sortLinkedList = (list, rootNodeID, includeRoot=true) => {
  if (rootNodeID === null) return [];
  return buildOrderedList(searchList(rootNodeID, list), list, includeRoot);
};

module.exports = {
  sortLinkedList,
};
