<script>
  export let data;
</script>

<style>
  .list {
    padding: 15px;
    height: 100%;
    width: 33%;
    min-width: 200px;
    max-width: 300px;
    flex: 1;
    border-right: solid var(--gray) 1px;
  }
</style>

<div class="list">
  <h2>{data.name}</h2>
</div>

