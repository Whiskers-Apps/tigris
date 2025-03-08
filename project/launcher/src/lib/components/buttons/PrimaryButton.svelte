<script lang="ts">
  type Props = {
    text: string;
    disabled?: boolean;
    onclick: () => void;
  };

  const { text, disabled = $bindable(false), onclick }: Props = $props();
</script>

<button {onclick} class="flex justify-center items-center primary-button text-sm" {disabled}>
  <p>{text}</p>
</button>

<style scoped>
  .primary-button {
    background-color: var(--accent);
    padding: 8px 12px 8px 12px;
    border-radius: 12px;
    color: var(--on-accent);
  }

  .primary-button:hover:enabled {
    filter: brightness(0.9);
  }

  .primary-button:disabled {
    background-color: var(--secondary-background);
    color: var(--disabled-text);
  }
</style>
