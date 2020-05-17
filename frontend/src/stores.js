import { writable } from 'svelte/store'; 
import { searchList, buildOrderedList } from './utils';
import { ROOT_NODE_ID } from './constants';

const createdLinkedListStore = () => {
  const {subscribe, set, update} = writable([]);

  return {
    subscribe,
    set: (newList, rootNode = null) => set(
      buildOrderedList(
        searchList(rootNode === null 
          ? ROOT_NODE_ID
          : rootNode, newList),
        ((id) => searchList(id, newList))
      )
    ),
    unset: () => set(null),
    update,
  }
};

export const lists = createdLinkedListStore();
export const tasks = writable([]);
