<script>
  export let list;
  import { getClient, mutate } from 'svelte-apollo';
  import { LIST_UPDATE, TASK_CREATE } from '../mutations';
  import Task from './Task';

  const client = getClient();

  let newTaskDescription = '';

  $: {
    mutate(client, {
      mutation: LIST_UPDATE,
      variables: {
        input: {
          id: list.id,
          order: list.order,
          name: list.name,
        }
      }
    })
    .catch(console.error);
  }

  function addTask(event){
    event.preventDefault();
    mutate(client, {
      mutation: TASK_CREATE,
      variables: {
        input: {
          listID: list.id,
          order: list.tasks.length,
          description: newTaskDescription,
          date: '' // TODO: Add date for task
        }
      }
    })
    .then(({data}) => {
      list.tasks = [...list.tasks, data.taskCreate];
      resetNewTaskField();
    })
    .catch(console.error);
  }

  function resetNewTaskField() {
    newTaskDescription = '';
  }

</script>

<style>
  .list {
    padding: 15px;
    flex: 1;
    max-width: 400px;
    border-right: solid var(--gray) 1px;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
  }

  .list::-webkit-scrollbar {
    display: none;
  }

  input[type=text] {
    color: var(--foreground);
    border: none;
    background: transparent;
    font-family: san-serif;
    font-size: 23px;
  }
  input[type=text]:focus {
    outline-width: 0;
  }

  .add-task {
    margin-top: 10px;
  }
  .list-title {
    font-weight: bold;
  }
</style>

<div class="list">
  <input class="list-title" type="text" bind:value={list.name} />
  {#each list.tasks as task}
    <Task task={task} />
  {/each}
  <form on:submit={addTask}>
    <input class="add-task" type="text" bind:value={newTaskDescription} placeholder="&#x2607; Add task..." />
  </form>
</div>

