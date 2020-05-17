<script>
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';
  import { getClient, mutate } from 'svelte-apollo';

  import { buildOrderedList, searchList } from '../utils';
  import { LIST_UPDATE, TASK_CREATE } from '../mutations';
  import Task from './Task';
  import TextField from './TextField';

  export let list,
   isOver,
   dragStart,
   dragOver, 
   dragLeave, 
   drop;

  const dispatch = createEventDispatcher();
  const client = getClient();

  let newTaskDescription = '';

  let updateList = () => {
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
      dispatch('createTask', {
        payload: data.newTask,
      });
      resetNewTaskField();
    })
    .catch(console.error);
  }

  function resetNewTaskField() {
    newTaskDescription = '';
  }

</script>

<div class="list-content">
  <strong>
    <TextField bind:onEdit={updateList} bind:value={list.name} />
  </strong>
  {#each list.tasks as task}
    <Task 
      task={task} 
      bind:isOver={isOver}
      bind:dragOver={dragOver}
      bind:dragLeave={dragLeave}
      bind:drop={drop}
      bind:dragStart={dragStart} />
  {/each}
  <TextField bind:value={newTaskDescription} onSubmit={addTask} placeholder="&#x2607; Add task..." />
</div>

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
