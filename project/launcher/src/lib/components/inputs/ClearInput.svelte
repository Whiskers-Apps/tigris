<script lang="ts">
  import { createEventDispatcher } from "svelte";
  let dispatch = createEventDispatcher();

  let { placeholder, value } = $props();


</script>

<!-- svelte-ignore a11y_autofocus -->
<input
  class="bg-transparent input w-full"
  type="text"
  {placeholder}
  {value}
  oninput={(e) => dispatch("input", e.currentTarget.value)}
  autofocus
/>

<style scoped>
  .input::placeholder {
    color: var(--tertiary-text);
  }

  .input:focus {
    outline: none;
  }
</style>
