<script>
  import { createEventDispatcher } from 'svelte';
  import { getClient, mutate } from 'svelte-apollo';
  import { TASK_UPDATE } from '../mutations';

  import TextField from './TextField';

  export let task, 
   isOver, 
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
    border-top: 1px solid transparent;
    border-bottom: 1px solid transparent;
  }

  .top-highlight {
    border-top: 1px solid var(--foreground);
  }

  .bottom-highlight {
    border-bottom: 1px solid var(--foreground);
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
  class:top-highlight={isOver === task.id}
  class:task-done={task.done}>
  <input type="checkbox" bind:checked={task.done} />
  <TextField bind:value={task.description} bind:strikethrough={task.done} />
</div>

