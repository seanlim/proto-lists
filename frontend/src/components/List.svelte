<script>
  export let list;
  import { getClient, mutate } from 'svelte-apollo';
  import { LIST_UPDATE } from '../mutations';
  import Task from './Task';

  const client = getClient();
  const task = {};

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

  // TODO: Add task functionality
  function addTask(event){
    event.preventDefault();
  }

</script>

<style>
  .list {
    padding: 15px;
    height: 100%;
    flex: 1;
    max-width: 400px;
    border-right: solid var(--gray) 1px;
    display: flex;
    flex-direction: column
  }

  input[type=text] {
    color: var(--foreground);
    border: none;
    background: transparent;
    font-size: 23px;
  }
  input[type=text]:focus {
    outline-width: 0;
  }

  .add-task {
    margin-top: 10px;
  }
</style>

<div class="list">
  <input type="text" bind:value={list.name} />
  {#each list.tasks as task}
    <Task task={task} />
  {/each}
  <form on:submit={addTask}>
    <input class="add-task" type="text" placeholder="&#x2607; Add task..." />
  </form>
</div>

