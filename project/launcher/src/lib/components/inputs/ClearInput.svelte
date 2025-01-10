<script lang="ts">
  const props = $props<{
    placeholder: string;
    value: string;
    oninput: (value: string) => void;
  }>();

  let { placeholder, value, oninput } = props;
</script>

<!-- svelte-ignore a11y_autofocus -->
<input
  class="bg-transparent input w-full"
  type="text"
  {placeholder}
  {value}
  oninput={(e) => oninput(e.currentTarget.value)}
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
