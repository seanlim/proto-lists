<script>
  export let list;
  import { getClient, mutate } from 'svelte-apollo';
  import { LIST_UPDATE } from '../mutations';

  const client = getClient();

  $: {
    mutate(client, {
      mutation: LIST_UPDATE,
      variables: {
        input: {
          id: list.id,
          order: list.order,
          name: list.name,
        }
      }
    })
    .catch(console.error);
  }

</script>

<style>
  .list {
    padding: 15px;
    height: 100%;
    flex: 1;
    min-width: 300px;
    max-width: 400px;
    border-right: solid var(--gray) 1px;
  }
</style>

<div class="list">
  <input bind:value={list.name} />
</div>

