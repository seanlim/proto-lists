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

  // TODO: Add task functionality
  function addTask(event){
    event.preventDefault();
    mutate(client, {
      mutation: TASK_CREATE,
      variables: {
        input: {
          listID: list.id,
          order: list.tasks.length,
          description: newTaskDescription,
          date: ''
        }
      }
    })
    .then(({data}) => {
      list.tasks.push(data.taskCreate);
    })
    .catch(console.error);
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
    <input class="add-task" type="text" bind:value={newTaskDescription} placeholder="&#x2607; Add task..." />
  </form>
</div>

