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
  }

  input[type=checkbox] {
    margin-right: 10px;
  }
</style>

<div class="task">
  <input type="checkbox" bind:checked={task.done} /> {task.description} 
</div>

