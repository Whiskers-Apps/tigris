<script lang="ts">
  type Props = {
    title: string;
    description: string;
    placeholder?: string;
    value: string;
    errorMessage?: string | null;
    oninput: (value: string) => void;
  };

  export const {
    title,
    description,
    placeholder = "",
    value = $bindable(),
    errorMessage = $bindable(null),
    oninput,
  }: Props = $props();
</script>

<div>
  <h3 class="text-lg font-semibold">{title}</h3>
  <p class="text-secondary">{description}</p>
  <textarea
    rows="6"
    class="input bg-transparent w-full rounded-lg border border-secondary pt-2 pb-2 pl-3 pr-3 focus:outline-none mt-2"
    {placeholder}
    oninput={(e) => oninput(e.currentTarget.value)}
    {value}
  ></textarea>
  {#if errorMessage !== null}
    <p class="text-danger">{errorMessage}</p>
  {/if}
</div>

<style scoped>
  .input::placeholder {
    color: var(--tertiary-text);
  }
</style>
