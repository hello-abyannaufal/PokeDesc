<template>
  <div class="container mx-auto px-4">
    <h1 class="text-4xl font-mono font-bold mb-4 text-center">{{ pokemonName }}</h1>
    <div></div>
  </div>
</template>

<script setup>
const route = useRoute()
const pokemonName = route.params.name

onMounted(() => {
  console.log(pokemonName)
})
</script>
