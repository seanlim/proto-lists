<script>
  export let apiURL;
  import ApolloClient from 'apollo-boost';  
  import { setClient, query } from 'svelte-apollo';
  import { LISTS } from '../queries';

  // Create new Apollo client
  const client = new ApolloClient({ uri: apiURL });
  setClient(client);

  // Fetch data
  const lists = query(client, { query: LISTS });
  $lists.then(console.log);

</script>

<style>
  .list-container {
    height: 100%;
    display: flex;
    flex-direction: row;
    border: solid red 1px;
    overflow-x: scroll;
  }
  .list {
    padding: 15px;
    height: 100%;
    max-width: 33%;
    min-width: 33%;
    flex: 1;
    border-right: solid var(--secondary) 1px;
  }
</style>

{#await $lists}
  Loading...
{:then result}
  <div class="list-container">
    {#each result.data.lists as list}
      <div class="list">
        <h2>{list.name}</h2>
      </div>
    {/each}
  </div>
{:catch error}
  Error: {error}
{/await}


