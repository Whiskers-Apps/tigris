<script lang="ts">
  type Props = {
    text: string;
    danger?: boolean;
    disabled?: boolean;
    onclick: () => void;
  };

  export const { text, danger = false, disabled = $bindable(false), onclick }: Props = $props();
</script>

<button class="text-button" {onclick} {disabled}>
  <div class={`${disabled ? "text-disabled" : danger ? "text-danger" : "text-accent"}`}>
    <p>{text}</p>
  </div>
</button>

<style scoped>
  .text-button:disabled {
    color: var(--disabled-text);
  }

  .text-button:enabled:hover {
    text-decoration-line: underline;
  }
</style>
