<template>
  <div class="bg-poke-shell rounded-b-sm px-4 py-3 relative overflow-hidden">
    <div
      class="absolute inset-0 pointer-events-none"
      style="
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.04) 2px,
          rgba(0, 0, 0, 0.04) 4px
        );
      "
    ></div>

    <!-- top bar -->
    <div class="flex items-center gap-2 mb-2">
      <div
        class="w-2.5 h-2.5 rounded-full bg-poke-red ring-2 ring-poke-shell ring-offset-1 ring-offset-poke-red"
      ></div>
      <div
        class="w-2.5 h-2.5 rounded-full bg-poke-yellow ring-2 ring-poke-shell ring-offset-1 ring-offset-poke-yellow"
      ></div>
      <div
        class="w-2.5 h-2.5 rounded-full bg-poke-blue ring-2 ring-poke-shell ring-offset-1 ring-offset-poke-blue"
      ></div>
      <div class="flex-1 h-px bg-white/10 ml-1"></div>
      <span class="font-mono text-poke-static text-xs md:text-sm">POKÉDEX OS v0.1</span>
    </div>

    <!-- title -->
    <div class="mb-1">
      <!-- <p class="font-head text-poke-static text-xs mb-1 tracking-wide">NATIONAL DEX</p> -->
      <p class="font-brand text-poke-screen text-sm md:text-lg leading-none">
        <NuxtLink to="/"> POKÉDESC<span class="text-poke-red">_</span> </NuxtLink>
        <span class="text-poke-red animate-pulse">▮</span>
      </p>
    </div>

    <!-- tricolor bar -->
    <div class="flex gap-1.5 my-2">
      <div class="h-0.5 flex-[4] bg-poke-red rounded-sm"></div>
      <div class="h-0.5 flex-[2] bg-poke-yellow rounded-sm"></div>
      <div class="h-0.5 flex-[1] bg-poke-blue rounded-sm"></div>
    </div>

    <!-- footer info -->
    <div class="flex flex-row gap-1 items-center justify-between">
      <p class="font-mono text-sm md:text-base text-poke-screen leading-none">
        <span class="text-poke-static">LOADED // </span>
        <span class="text-poke-yellow">{{ count }}</span>
        <span class="text-poke-static"> SPECIES</span>
      </p>
      <span class="font-mono text-xs md:text-sm text-poke-blue">GEN I–IX ►</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 1025,
  },
})
</script>
