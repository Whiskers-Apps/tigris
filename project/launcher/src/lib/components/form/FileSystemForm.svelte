<script lang="ts">
  import FileIcon from "$lib/icons/file.svg?component";
  import FolderIcon from "$lib/icons/folder.svg?component";
  import TrashIcon from "$lib/icons/trash.svg?component";
  import { open } from "@tauri-apps/plugin-dialog";

  type Props = {
    title: string;
    description: string;
    dir: boolean;
    filters: string[] | null;
    value: string;
    onchange: (value: string) => void;
  };

  const {
    title,
    description,
    dir = false,
    filters,
    value = $bindable(),
    onchange,
  }: Props = $props();

  async function onSelectFile() {
    const paths = await open({
      multiple: false,
      filters: filters === null ? undefined : [{ name: "Supported Files", extensions: filters }],
      directory: dir,
    });

    if (paths !== null) {
      let path = paths.toString();
      onchange(path);
    }
  }
</script>

<h3 class="text-lg font-semibold">{title}</h3>
<p class="text-secondary">{description}</p>
<div class="space-x-4 pt-2 pb-2 pl-3 pr-3 border border-secondary flex rounded-lg">
  <button
    class="flex-grow flex space-x-4"
    onclick={() => {
      onSelectFile();
    }}
  >
    {#if dir}
      <FolderIcon class="w-6 h-6" />
    {:else}
      <FileIcon class="w-6 h-6" />
    {/if}

    {#if value === ""}
      {#if dir}
        <p>No directory selected</p>
      {:else}
        <p>No file selected</p>
      {/if}
    {:else}
      <div>{value}</div>
    {/if}
  </button>
  {#if value !== ""}
    <button>
      <TrashIcon
        class="w-6 h-6 text-danger"
        onclick={() => {
          onchange("");
        }}
      />
    </button>
  {/if}
</div>
