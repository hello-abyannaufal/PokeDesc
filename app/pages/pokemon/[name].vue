<template></template>

<script setup>
const route = useRoute()
const pokemonName = route.params.name

onMounted(() => {
  console.log(pokemonName)
})
</script>
