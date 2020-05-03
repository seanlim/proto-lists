import { writable } from 'svelte/store'; 

function sortOrder(a, b) {
  return (a.order > b.order) ? 1: -1;
}
function sortTasks(list) {
  let newTasks = list.tasks.sort(sortOrder);
  return {
    ...list,
    task: newTasks
  };
}

export const lists = writable([]);
export const tasks = writable([]);
