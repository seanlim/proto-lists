<script>
  import { onMount, onDestroy } from 'svelte';
  import { getClient, mutate } from 'svelte-apollo';

  import { buildOrderedList, searchList } from '../utils';
  import { LIST_UPDATE, TASK_CREATE } from '../mutations';
  import { tasks } from '../stores';
  import Task from './Task';
  import TextField from './TextField';

  export let list,
   orderedTasks = [],
   unsubsribeTasks,
   isOver,
   dragStart,
   dragOver, 
   dragLeave, 
   drop;

  const client = getClient();

  let newTaskDescription = '';

  $: {
    mutate(client, {
      mutation: LIST_UPDATE,
      variables: {
        input: {
          id: list.id,
          name: list.name.toString(),
        }
      }
    })
    .catch(console.error);
  }

  const getTask = (taskID, tasks = $tasks) => searchList(taskID, tasks);

  function loadTasks(tasks) {
    if (list.root === null || tasks.length === 0) return;
    const rootNode = getTask(list.root, tasks);
    orderedTasks = buildOrderedList(rootNode, getTask, []);
  }

  function addTask() {
    mutate(client, {
      mutation: TASK_CREATE,
      variables: {
        input: {
          listID: list.id,
          description: newTaskDescription,
          date: '' // TODO: Add date for task;
        }
      }
    })
    .then(({data}) => {
      if (list.root === null) list.root = data.taskCreate.taskCreateID;
      tasks.set(data.taskCreate.tasks);
      resetNewTaskField();
    })
    .catch(console.error);
  }

  function resetNewTaskField() {
    newTaskDescription = '';
  }

  onMount(()=> {
    unsubsribeTasks = tasks.subscribe(loadTasks);
  });
  onDestroy(unsubsribeTasks);

</script>

<style>
  .list-content {
    padding: 15px;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
  }

  .list-content::-webkit-scrollbar {
    display: none;
  }

  .list-title {
    font-weight: bold;
  }
</style>

<div class="list-content">
  <strong>
    <TextField bind:value={list.name} />
  </strong>
  { isOver }
  {#each orderedTasks as task}
    <Task 
      task={task} 
      bind:dragOver={dragOver}
      bind:dragLeave={dragLeave}
      bind:drop={drop}
      bind:dragStart={dragStart} />
  {/each}
  <TextField bind:value={newTaskDescription} onSubmit={addTask} placeholder="&#x2607; Add task..." />
</div>

