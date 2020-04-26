<script>
  export let data;
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
  <h2>{data.name}</h2>
</div>

