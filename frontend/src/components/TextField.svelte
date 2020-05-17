<script>
  import { createEventDispatcher } from 'svelte';

  export let value = '', 
    id = null,
    placeholder = '', 
    strikethrough = false;

  const dispatch = createEventDispatcher();

  function keyDown(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      dispatch('submit', { value });
      return;
    }
    if (event.ctrlKey && event.keyCode === 68) {
      dispatch('delete', { id });
      return;
    }

  }

  function keyUp(event) {
    dispatch('edit', { value });
  }

</script>

<style>
  .textfield {
    width: 100%;
    display: flex;
    position: relative;
  }
  .content {
    color: var(--foreground);
    flex: 1;
    border: transparent 1px solid;
  }
  .placeholder {
    color: var(--gray);
    z-index: 999;
    position: absolute;
    pointer-events: none;
  }
  [contenteditable] {
    outline: none;
  }

  .strikethrough {
    text-decoration: line-through;
  }
</style>

<div class="textfield">
  <span contenteditable on:keydown={keyDown} on:keyup={keyUp} class:strikethrough class="content" bind:innerHTML={value}></span>
  {#if value === ''}
    <span class="placeholder">{ placeholder }</span>
  {/if}
</div>
