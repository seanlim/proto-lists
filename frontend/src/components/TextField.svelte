<script>
  export let value = '', 
    placeholder = '', 
    strikethrough = false, 
    onEdit = null,
    onSubmit = null,
    onDelete = null;

  function keyDown(event) {
    if (event.keyCode === 13 && onSubmit !== null) {
      onSubmit();
      return;
    }
    if (event.ctrlKey && event.keyCode === 68) {
      console.info('deleting task');
      onDelete();
      return;
    }

    onEdit();
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
  <span contenteditable on:keydown={keyDown} class:strikethrough class="content" bind:innerHTML={value}></span>
  {#if value === ''}
    <span class="placeholder">{ placeholder }</span>
  {/if}
</div>
