<script lang="ts">
  type Props = {
    text: string;
    onclick: () => void;
  };

  const { text, onclick }: Props = $props();
</script>

<button {onclick} class="flex justify-center items-center outline-button">
  <p>{text}</p>
</button>

<style scoped>
  .outline-button {
    border: 2px solid var(--accent);
    padding: 6px 10px 6px 10px;
    border-radius: 9999px;
    color: var(--text);
  }

  .outline-button:hover:enabled {
    filter: brightness(0.9);
  }

  .outline-button:disabled {
    background-color: var(--secondary-background);
    color: var(--disabled-text);
  }
</style>
