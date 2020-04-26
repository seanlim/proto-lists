import { writable } from 'svelte/store'; 

const createListStore = () => {
  const {subscribe, set, update} = writable({});
  return {
    subscribe,
    update,
    set: newLists => set(newLists.sort((a, b) => (a.order > b.order) ? 1: -1)),
  };
};

export const lists = createListStore();
