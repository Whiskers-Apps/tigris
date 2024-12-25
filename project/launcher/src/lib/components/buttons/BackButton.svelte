<script lang="ts">
  import BackIcon from "$lib/icons/back.svg?component";

  let { onclick } = $props();
</script>

<button {onclick}>
  <div class="back-button h-[32px] w-[32px] flex justify-center items-center rounded-full">
    <BackIcon class="w-[16px] h-[16px]" />
  </div>
</button>

<style scoped>
  .back-button:hover {
    background-color: var(--accent);
    color: var(--on-accent);
    outline: none;
  }
</style>
