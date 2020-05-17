<script>
  import { createEventDispatcher } from 'svelte';
  import { getClient, mutate, query } from 'svelte-apollo';

  import { buildOrderedList, searchList } from '../utils';
  import { LIST_UPDATE, TASK_CREATE } from '../mutations';
  import { LIST } from '../queries';
  import Task from './Task';
  import TextField from './TextField';

  export let listID,
   isOver,
   dragStart,
   dragOver, 
   dragLeave, 
   drop;

  const client = getClient();
  const list = query(client, { query: LIST, variables: { input: listID } });

  let newTaskDescription = '';

  let updateList = (e) => {
    mutate(client, {
      mutation: LIST_UPDATE,
      variables: {
        input: {
          id: listID,
          name: e.detail.value,
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
          listID: listID,
          description: newTaskDescription,
          date: (new Date()).toString(),
        }
      }
    })
    .then(({data}) => {
      list.refetch();
      resetNewTaskField();
    })
    .catch(console.error);
  }

  function onTaskDeleted(e) {
    list.refetch();
  }

  function resetNewTaskField() {
    newTaskDescription = '';
  }

</script>

<div class="list-content">
  {#await $list}
    Loading...
  {:then result} 
    <strong>
      <TextField on:submit={updateList} value={result.data.list.name} />
    </strong>
    {#each result.data.list.tasks as task (task.id)}
      <Task 
        task={task} 
        on:deleted={onTaskDeleted}
        bind:isOver={isOver}
        bind:dragOver={dragOver}
        bind:dragLeave={dragLeave}
        bind:drop={drop}
        bind:dragStart={dragStart} />
    {/each}
    <TextField bind:value={newTaskDescription} on:submit={addTask} placeholder="&#x2607; Add task..." />
  {:catch error}
    Error: { error }
  {/await}
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
