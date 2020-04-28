<script>
  import { getClient, mutate } from 'svelte-apollo';
  export let task;

  const client = getClient();

</script>

<style>
  .task {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
  }

  input[type=checkbox] {
    margin-right: 10px;
    flex: 1;
    max-width: 10px;
  }

  input[type=text] {
    flex: 1;
    color: var(--foreground);
    border: none;
    background: transparent;
    font-size: 23px;
  }
  input[type=text]:focus {
    outline-width: 0;
  }

</style>

<div class="task">
  <input type="checkbox" bind:checked={task.done} />
  <input type="text" bind:value={task.description} />
</div>

