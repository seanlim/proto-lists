<script>
  import { createEventDispatcher } from 'svelte';
  import { getClient, mutate } from 'svelte-apollo';
  import { TASK_UPDATE } from '../mutations';

  import TextField from './TextField';

  export let task, 
   dragStart,
   dragOver, 
   dragLeave, 
   drop;

  const client = getClient();

  $: {
    mutate(client, {
      mutation: TASK_UPDATE,
      variables: {
        input: {
          id: task.id,
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

  .task-done {
    opacity: 0.5; 
  }

  .task:hover {
    opacity: 1;
  }

  input[type=checkbox] {
    margin-top: 10px;
    margin-right: 10px;
  }

</style>

<div 
  data-id={task.id}
  data-next={task.next}
  data-listid={task.listID}
  data-description={task.description} 
  data-done={task.done}
  data-date={task.date}
  draggable="true"
  on:dragstart={dragStart}
  on:dragover={dragOver}
  on:dragleave={dragLeave}
  on:drop={drop}
  class="task" 
  class:task-done={task.done}>
  <input type="checkbox" bind:checked={task.done} />
  <TextField bind:value={task.description} bind:strikethrough={task.done} />
</div>

