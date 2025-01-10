<script lang="ts">
  type Props = {
    title: string;
    description: string;
    min: number;
    max: number;
    step: number;
    value: number;
    onslide: (value: number) => void;
  };

  const { title, description, min, max, step, value = $bindable(), onslide }: Props = $props();
</script>

<div>
  <h3 class="text-lg font-semibold">{title} ({value})</h3>

  <p class="text-secondary">{description}</p>

  <div class="w-full flex overflow-hidden rounded-full border-accent">
    <input
      type="range"
      class=" flex-grow"
      {min}
      {max}
      {step}
      {value}
      oninput={(event) => {
        onslide(+event.currentTarget.value);
      }}
    />
  </div>
</div>

<style>
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 15rem;
  }

  input[type="range"]:focus {
    outline: none;
  }

  input[type="range"] {
    margin: auto;
    -webkit-appearance: none;
    appearance: none;
    position: relative;
    overflow: hidden;
    height: 25px;
    width: 200px;
    cursor: pointer;
    border-radius: 0;
  }

  ::-webkit-slider-runnable-track {
    background: var(--tertiary-background);
    border-radius: 999px;
  }

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 25px;
    height: 25px;
    background: var(--background);
    box-shadow: -2000px 0 0 1990px var(--accent);
    border: 2px solid var(--accent);
    border-radius: 999px;
  }

  ::-ms-fill-lower {
    background: var(--accent);
  }

  ::-ms-ticks-after {
    display: none;
  }

  ::-ms-ticks-before {
    display: none;
  }

  ::-ms-track {
    background: var(--accent);
    color: transparent;
    height: 40px;
    border: none;
  }

  ::-ms-tooltip {
    display: none;
  }
</style>
