<script>
  import { getClient, mutate } from 'svelte-apollo';
  import { TASK_UPDATE } from '../mutations';

  import TextField from './TextField';

  export let task;

  const client = getClient();

  $: {
    mutate(client, {
      mutation: TASK_UPDATE,
      variables: {
        input: {
          id: task.id,
          listID: task.listID,
          order: task.order,
          description: task.description,
          done: task.done,
          date: task.date,
        },
      },
    })
    .catch(console.error);
  }

</script>

<style>
  .task {
    display: flex;
    flex-direction: row;
    margin-bottom: var(--list-padding);
  }

  input[type=checkbox] {
    margin-top: 10px;
    margin-right: 10px;
  }

</style>

<div class="task">
  <input type="checkbox" bind:checked={task.done} />
  <TextField bind:value={task.description} bind:strikethrough={task.done} />
</div>

