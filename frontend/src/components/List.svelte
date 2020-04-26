<script>
  export let data;
</script>

<style>
  .list {
    upadding: 15px;
    height: 100%;
    max-width: 33%;
    min-width: 33%;
    flex: 1;
    border-right: solid var(--foreground) 1px;
  }
</style>

<div class="list">
  <h2>{data.name}</h2>
</div>

