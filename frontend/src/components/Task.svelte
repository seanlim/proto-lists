<script>
  import { getClient, mutate } from 'svelte-apollo';
  import TextField from './TextField';

  export let task;

  const client = getClient();

</script>

<style>
  .task {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: var(--list-padding);
  }

  input[type=checkbox] {
    margin-right: 10px;
    flex: 1;
    max-width: 10px;
  }

</style>

<div class="task">
  <input type="checkbox" bind:checked={task.done} />
  <TextField bind:value={task.description} bind:strikethrough={task.done} />
</div>

