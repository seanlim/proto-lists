<script>
  export let apiURL;
  import ApolloClient from 'apollo-boost';  
  import { setClient, subscribe, mutate } from 'svelte-apollo';
	import { fly } from 'svelte/transition';
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
    .then(({data}) => lists.update(l => ([...l, data.listCreate])))
    .catch(console.error);
  }

</script>

<style>
  .list-container {
    height: 100%;
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    overflow-y: hidden;
  }
  .list-wrapper {
    flex: 1;
    max-width: 400px;
    min-width: 300px;
    border-right: solid var(--gray) 1px;
    display: flex;
    overflow: hidden;
  }
  .no-list {
    padding: 15px;
    height: 100%;
    flex: 1;
    max-width: 400px;
    min-width: 300px;
    border-right: solid var(--gray) 1px;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    color: var(--foreground);
  }
  .add-list {
    padding: 15px;
    user-select: none;
    max-width: 50px;
    min-width: 50px;
    flex: 1;
    background: var(--background);
    color: var(--foreground);
    font-size: 2em;
    display: flex;
    text-align: center;
    justify-content: center;
    align-items: center;
    border: solid 3px var(--foreground);
  }
  .add-list:hover {
    background: var(--gray);
    border: solid 3px transparent;
    color: var(--foreground);
  }
  .add-list:hover:active {
    background: var(--background);
  }

  .loading {
    font-weight: bold;
    font-family: monospace;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%)
  }

</style>

{#if loading}
  <span class="loading">
    ✏️ Loading...
  </span>
{:else}
  <div class="list-container">
    {#if $lists.length < 1}
      <div class="no-list">
        <p>No Lists</p>
      </div>
    {:else}
      {#each $lists as list (list.id)}
        <div class="list-wrapper" in:fly="{{y: -100, duration: 300, delay: list.order * 100}}">
          <List list={list} />
        </div>
      {/each}
    {/if}
    <div class="add-list" on:click={addList}>
      <b>+</b>
    </div>
  </div>
{/if}


