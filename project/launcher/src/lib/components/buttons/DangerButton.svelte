<script lang="ts">
  type Props = {
    text: string;
    disabled?: boolean;
    onclick: () => void;
  };

  let { text, disabled = $bindable(false), onclick }: Props = $props();
</script>

<button {onclick} class="flex text-sm justify-center items-center primary-button" {disabled}>
  <p>{text}</p>
</button>

<style scoped>
  .primary-button {
    background-color: var(--danger);
    padding: 8px 12px 8px 12px;
    border-radius: 12px;
    color: var(--on-danger);
  }

  .primary-button:hover:enabled {
    filter: brightness(0.9);
  }

  .primary-button:disabled {
    background-color: var(--secondary-background);
    color: var(--disabled-text);
  }
</style>
