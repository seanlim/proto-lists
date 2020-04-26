<script>
  export let apiURL;
  import ApolloClient from 'apollo-boost';  
  import { setClient, subscribe, mutate } from 'svelte-apollo';
  import { LISTS } from '../queries';
  import { LIST_CREATE } from '../mutations';
  import { lists } from '../stores';

  import List from './List';

  // Create new Apollo client
  const client = new ApolloClient({ uri: apiURL });
  setClient(client);

  // Fetch lists 
  let loading = true; 
  const request = subscribe(client, { query: LISTS });
  $request.then(res => {
    lists.set(res.data.lists);
    loading = false;
  })
  .catch(console.error);

  async function addList() {
    mutate(client, {
      mutation: LIST_CREATE,
      variables: {
        input: {
          name : 'new list',
          order: $lists.length
        }
      }
    })
    .then(({data}) => lists.update(l => ([data.listCreate, ...l])))
    .catch(console.error);
  }

</script>

<style>
  .list-container {
    height: 100%;
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
  }
  .no-list {
    padding: 15px;
    height: 100%;
    max-width: 20%;
    min-width: 20%;
    flex: 1;
    border-right: solid var(--gray) 1px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
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
    border: solid 3px var(--background);
  }
  .add-list:hover {
    background: var(--background);
    border: solid 3px var(--gray);
  }
  .add-list:hover:active {
    background: var(--gray);
  }
</style>

{#if loading}
  Loading...
{:else}
  <div class="list-container">
    {#if $lists.length < 1}
      <div class="no-list">
        <p>No Lists</p>
      </div>
    {:else}
      {#each $lists as list}
        <List data={list} />
      {/each}
    {/if}
    <div class="add-list" on:click={addList}>
      <b>+</b>
    </div>
  </div>
{/if}


