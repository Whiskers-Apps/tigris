<script lang="ts">
  type Props = {
    text: string;
    danger?: boolean;
    disabled?: boolean;
    onclick: () => void;
  };

  export const { text, danger = false, disabled = $bindable(false), onclick }: Props = $props();
</script>

<button class="text-button text-sm" {onclick} {disabled}>
  <div class={`${disabled ? "text-disabled" : danger ? "text-danger" : "text-text"}`}>
    <p>{text}</p>
  </div>
</button>

<style scoped>
  .text-button {
    padding: 8px 12px 8px 12px;
    border: 1px solid var(--secondary-background);
    border-radius: 12px;
  }
  .text-button:disabled {
    color: var(--disabled-text);
    background-color: var(--secondary-background);
  }

  .text-button:enabled:hover {
    background-color: var(--tertiary-background);
  }
</style>
