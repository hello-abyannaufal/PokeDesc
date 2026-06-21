<template>
  <div
    class="min-h-screen relative overflow-hidden flex items-center justify-center"
  >
    <div class="absolute inset-0 pointer-events-none">
      <img
        v-for="p in particles"
        :key="p.id"
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.spriteId}.png`"
        class="pokemon-particle absolute opacity-70"
        :style="{
          left: p.left + '%',
          top: p.top + '%',
          width: p.size + 'px',
          imageRendering: 'pixelated',
        }"
        alt=""
      />
    </div>

    <div class="hero-content">
      <div class="hero-title">PokéDesc</div>
      <div class="hero-description">
        An interactive encyclopedia that helps trainers explore and learn about
        Pokémon through detailed descriptions, stats, abilities, and evolution
        chains.
      </div>

      <NuxtLink to="/pokemon" class="hero-button"> Explore Pokémon </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { gsap } from "gsap";

const TARGET_SPACING_PX = 110; // desired gap between dots — same on every screen size
const particles = ref([]);
let resizeTimer = null;

function randomId() {
  return Math.floor(Math.random() * 1010) + 1;
}

function buildGrid() {
  const columns = Math.max(4, Math.round(window.innerWidth / TARGET_SPACING_PX));
  const rows = Math.max(3, Math.round(window.innerHeight / TARGET_SPACING_PX));
  const colSpacing = 100 / columns;
  const rowSpacing = 100 / rows;

  particles.value = Array.from({ length: columns * rows }, (_, i) => {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const isOddRow = row % 2 === 1;

    return {
      id: i,
      spriteId: randomId(),
      left: col * colSpacing + (isOddRow ? colSpacing / 2 : 0),
      top: row * rowSpacing,
      size: 50,
    };
  });
}

async function refreshGrid() {
  buildGrid();
  await nextTick();
  gsap.utils.toArray(".pokemon-particle").forEach((el) => {
    gsap.to(el, {
      rotate: 360,
      duration: 10,
      repeat: -1,
      ease: "linear",
    });
  });
}

function handleResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(refreshGrid, 250); // debounced — rebuilds after resizing settles
}

onMounted(() => {
  refreshGrid();
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
  clearTimeout(resizeTimer);
});
</script>

<style scoped>
@reference "~/assets/css/main.css";
.hero-content {
  @apply flex flex-col z-10 text-center max-w-4xl mx-auto px-4 leading-5;
}

.hero-title {
  @apply font-brand tracking-[0.1em] text-3xl sm:text-xl md:text-5xl lg:text-6xl;
}

.hero-description {
  @apply mt-4 text-sm sm:text-base md:text-lg leading-relaxed;
}

.hero-button {
  @apply btn btn-primary mt-6 w-full sm:w-auto font-head;
}
</style>
