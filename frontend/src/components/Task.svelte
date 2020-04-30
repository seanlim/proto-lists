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

  // TODO: dragging and reordering tasks
  function dragStart(e) {
    console.info(e.target.dataset.index);
  }

  function dragOver(e) {
    console.info('Drag over');
  }

  function dragLeave(e) {
    console.info('Drag leave');
  }
  
  function drop(e){
    console.info('drop');
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
  data-index="{task.order}"
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

