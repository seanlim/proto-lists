<script>
  export let list;
  import { getClient, mutate } from 'svelte-apollo';
  import { LIST_UPDATE, TASK_CREATE } from '../mutations';
  import Task from './Task';
  import TextField from './TextField';

  const client = getClient();

  let newTaskDescription = '';

  $: {
    mutate(client, {
      mutation: LIST_UPDATE,
      variables: {
        input: {
          id: list.id,
          order: list.order,
          name: list.name.toString(),
        }
      }
    })
    .catch(console.error);
  }

  function addTask(){
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
  .list-content {
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
  {#each list.tasks as task}
    <!-- We don't bind task here because we don't want to trigger updates to the ENTIRE list when we edit tasks  -->
    <!-- TODO: Maybe try binding it BUT diffing in the reactive statement to prevent unecessary updates?    -->
    <Task task={task} />
  {/each}
  <TextField bind:value={newTaskDescription} onSubmit={addTask} placeholder="&#x2607; Add task..." />
</div>

