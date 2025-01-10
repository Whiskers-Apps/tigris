<script lang="ts">
  type Props = {
    text: string;
    disabled?: boolean;
    onclick: () => void;
  };

  const { text, disabled = $bindable(false), onclick }: Props = $props();
</script>

<button {onclick} class="flex justify-center items-center primary-button" {disabled}>
  <p>{text}</p>
</button>

<style scoped>
  .primary-button {
    background-color: var(--accent);
    padding: 6px 10px 6px 10px;
    border-radius: 9999px;
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
