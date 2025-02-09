<script>
  import { createEventDispatcher } from 'svelte';
  import { getClient, mutate } from 'svelte-apollo';
  import { TASK_UPDATE, TASK_DESTROY } from '../mutations';
  import { lists } from '../stores';
  import { searchList } from '../utils';
  import { current_component } from "svelte/internal";

  import TextField from './TextField';

  export let task, 
   isOver, 
   dragStart,
   dragOver, 
   dragLeave, 
   drop;

	const dispatch = createEventDispatcher();
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

  let deleteTask = (e) => {
    mutate(client, {
      mutation: TASK_DESTROY,
      variables: {
        input: task.id,
      },
    })
    .then(({data}) => {
      dispatch('deleted', {});
    })
    .catch(console.error);
  };

</script>

<div 
  data-id={task.id}
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
  class:dragging={isOver !== false}
  class:task-done={task.done}>
  <input type="checkbox" bind:checked={task.done} />
  <TextField 
    id={task.id}
    on:delete={deleteTask}
    bind:value={task.description} 
    bind:strikethrough={task.done} />
</div>

<style>
  .task {
    padding: 0 0.5rem;
    border-radius: 5px;
    display: flex;
    flex-direction: row;
    margin-bottom: var(--list-padding);
    border-top: 2px solid transparent;
    border-bottom: 2px solid transparent;
    cursor: pointer;
  }

  .top-highlight {
    border-top: 2px solid var(--accent);
  }

  .bottom-highlight {
    border-bottom: 2px solid var(--accent);
  }

  .task-done {
    opacity: 0.5; 
  }

  .task:hover {
    background: var(--highlight);
    opacity: 1;
  }

  input[type=checkbox] {
    margin-top: 10px;
    margin-right: 10px;
  }

  .dragging {
    cursor: grabbing;
  }

</style>

