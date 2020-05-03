<script>
  import { onDestroy } from 'svelte';
  import { getClient, mutate } from 'svelte-apollo';
  import { LIST_UPDATE, TASK_CREATE } from '../mutations';
  import { tasks } from '../stores';
  import Task from './Task';
  import TextField from './TextField';

  export let list,
   listTasks = [],
   isOver,
   dragStart,
   dragOver, 
   dragLeave, 
   drop;

  const client = getClient();

  let newTaskDescription = '';

  const unsubsribeTasks = tasks.subscribe(loadTasks);

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

  function loadTasks(tasks) {
    listTasks = tasks.filter(t => t.listID === list.id);
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
      tasks.set(data.taskCreate);
      resetNewTaskField();
    })
    .catch(console.error);
  }

  function resetNewTaskField() {
    newTaskDescription = '';
  }

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
  {#each listTasks as task}
    <Task 
      task={task} 
      bind:dragOver={dragOver}
      bind:dragLeave={dragLeave}
      bind:drop={drop}
      bind:dragStart={dragStart} />
  {/each}
  <TextField bind:value={newTaskDescription} onSubmit={addTask} placeholder="&#x2607; Add task..." />
</div>

