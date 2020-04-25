<script>
  export let apiURL;
  import ApolloClient from 'apollo-boost';  
  import { setClient, query } from 'svelte-apollo';
  import { LISTS } from '../queries';

  const client = new ApolloClient({ uri: apiURL });
  setClient(client);

  const lists = query(client, { query: LISTS });
  $lists.then(console.log);
</script>

<style>
  h1 {
    text-align: center;
  }
</style>

<h1>Hello world!</h1>
