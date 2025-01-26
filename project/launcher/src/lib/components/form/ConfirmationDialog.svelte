<script lang="ts">
  import DangerButton from "../buttons/DangerButton.svelte";
  import OutlineButton from "../buttons/OutlineButton.svelte";
  import PrimaryButton from "../buttons/PrimaryButton.svelte";

  type Props = {
    show: boolean;
    title: string;
    message: string;
    oncancel: () => void;
    onconfirm: () => void;
  };

  const { show = $bindable(), title, message, oncancel, onconfirm }: Props = $props();
</script>

{#if show}
  <div class="dialog-background">
    <div class="bg-background p-6 w-[700px] rounded-2xl space-y-2">
      <div class="space-y-1">
        <h3 class="text-lg font-semibold">{title}</h3>

        <div>{message}</div>
      </div>

      <div class="flex justify-end space-x-2">
        <OutlineButton text="Cancel" onclick={() => oncancel()} />

        <DangerButton text="Confirm" onclick={() => onconfirm()} />
      </div>
    </div>
  </div>
{/if}

<style scoped>
  .dialog-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }
</style>
