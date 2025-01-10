<script lang="ts">
  const props = $props<{
    useBackgroundColor?: boolean;
  }>();

  export const { useBackgroundColor = false } = props;
</script>

<div class={`${useBackgroundColor ? "bg-divider" : "divider"} `}></div>

<style scoped>
  .divider {
    height: 1px;
    width: 100%;
    background-color: var(--secondary-background);
  }

  .bg-divider {
    height: 1px;
    width: 100%;
    background-color: var(--background);
  }
</style>
