<script lang="ts">
  type Props = {
    value: string;
    name: string;
    oninput: (value: string) => void;
  };

  const { value = $bindable(), name, oninput }: Props = $props();
</script>

<div class=" flex flex-col flex-1">
  <input
    class=" h-[100px] class rounded-lg hover:brightness-90 border-tertiary cursor-pointer w-full border border-secondary"
    style={`background-color: ${value}`}
    type="color"
    {value}
    oninput={(event) => {
      oninput(event.currentTarget.value);
    }}
  />
  <p class=" flex-1 text-center">{name}</p>
</div>

<style scoped>
  input[type="color"]::-webkit-color-swatch {
    border: none;
  }
</style>
