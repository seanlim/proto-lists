<script>
  import { onMount, onDestroy } from 'svelte';
  import ApolloClient from 'apollo-boost';  
  import { setClient, subscribe, mutate } from 'svelte-apollo';


  import { buildOrderedList, searchList } from '../utils';
  import { DATA } from '../queries';
  import { LIST_CREATE, TASK_REORDER } from '../mutations';
  import { lists, tasks } from '../stores';

  import List from './List';

  export let apiURL;
  const ROOT_NODE_ID = '00000000-0000-0000-0000-000000000000';
  let unsubscribeLists;
  let loading = true; 
  let isOver = false; // TODO: name this better
  let orderedLists = [];

  // Create new Apollo client
  const client = new ApolloClient({ uri: apiURL });
  setClient(client);

  // Fetch lists 
  const request = subscribe(client, { query: DATA });
  $request.then(({ data }) => {
    lists.set(data.data.lists);
    tasks.set(data.data.tasks);
    loading = false;
  })
  .catch(console.error);

  const getList = (listID) => searchList(listID, $lists);

  function loadLists(lists) {
    const rootNode = getList(ROOT_NODE_ID);
    if (!rootNode || rootNode.next === null) return;
    orderedLists = buildOrderedList(getList(rootNode.next), getList);
  }

  async function addList() {
    mutate(client, {
      mutation: LIST_CREATE,
      variables: {
        input: {
          name : 'new list',
        }
      }
    })
    .then(({data}) => lists.set(data.listCreate))
    .catch(console.error);
  }

  async function reorderTasks({from, to}) {
    mutate(client, {
      mutation: TASK_REORDER,
      variables: {
        input: {
          fromID: from.id,
          toID: to.id
        }
      }
    })
    .then(({data}) => {
      lists.set(data.taskReorder.lists);
      tasks.set(data.taskReorder.tasks);
    })
    .catch(console.error);
  }
  
  // Recursively traverse up DOM to find task node with data
  const getTaskData = (node) => node.dataset && node.dataset.id && node.dataset.listid ? 
      node.dataset:
      getTaskData(node.parentNode);

  // Drag and drop delegate functions 
  let dragStart = (e) => {
    e.dataTransfer.setData('source', JSON.stringify(e.target.dataset));
  };

  let dragOver = (e) => {
    e.preventDefault();
    let node = getTaskData(e.target);
    if (isOver !== node.id) isOver = node.id;
  };

  let dragLeave = (e) => {
    let node = getTaskData(e.target);
    if (isOver === node.id) isOver = false;
  };
  
  let drop = (e) => {
    e.preventDefault();
    isOver = false;
    let to = getTaskData(e.target);
    let from = JSON.parse(e.dataTransfer.getData('source'));
    if (from.id !== to.id) reorderTasks({from, to});
  };

  onMount(() => {
    unsubscribeLists = lists.subscribe(loadLists)
  });

  onDestroy(unsubscribeLists);

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
    {#if orderedLists.length < 1}
      <div class="no-list">
        <p>No Lists</p>
      </div>
    {:else}
      {#each orderedLists as list (list.id)}
        <div class="list-wrapper">
          <List 
            bind:list={list} 
            bind:isOver={isOver}
            bind:dragOver={dragOver}
            bind:dragLeave={dragLeave}
            bind:drop={drop}
            bind:dragStart={dragStart} />
        </div>
      {/each}
    {/if}
    <div class="add-list" on:click={addList}>
      <b>+</b>
    </div>
  </div>
{/if}


