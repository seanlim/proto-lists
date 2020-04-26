<script>
  export let apiURL;
  import ApolloClient from 'apollo-boost';  
  import { setClient, query } from 'svelte-apollo';
  import { LISTS } from '../queries';

  import List from './List';

  // Create new Apollo client
  const client = new ApolloClient({ uri: apiURL });
  setClient(client);

  // Fetch lists 
  const lists = query(client, { query: LISTS });
  $lists.then(console.log);

  function addList() {
  }
</script>

<style>
  .list-container {
    height: 100%;
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
  }
  .add-list {
    padding: 15px;
    user-select: none;
    height: 100%;
    max-width: 50px;
    min-width: 50px;
    flex: 1;
    background: var(--gray);
    color: var(--foreground);
    font-size: 2em;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    border: solid 3px transparent;
  }
  .add-list:hover {
    background: var(--background);
    border: solid 3px var(--gray);
  }
  .add-list:hover:active {
    background: var(--gray);
  }
</style>

{#await $lists}
  Loading...
{:then result}
  <div class="list-container">
    {#if result.data.lists.length < 1}
      <p>No Lists!</p>
    {:else}
      {#each result.data.lists as list}
        <List data={list} />
      {/each}
    {/if}
    <div class="add-list" on:click={addList}>
      <b>+</b>
    </div>
  </div>
{:catch error}
  Error: {error}
{/await}


