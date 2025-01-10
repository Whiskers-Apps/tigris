<script lang="ts">
  import BackIcon from "$lib/icons/back.svg?component";

  const props = $props<{
    text: string;
    danger?: boolean;
    onclick: () => void;
  }>();

  export const { text, danger = false, onclick } = props;
</script>

<button {onclick}>
  <div class={`hover:underline ${danger ? "text-danger" : "text-accent"}`}>
    <p>{text}</p>
  </div>
</button>
