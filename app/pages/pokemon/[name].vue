<template>
  <div>
    <h1 class="text-4xl font-mono font-bold mb-4 text-center">{{ pokemonName }}</h1>

    <div class="flex md:flex-row">
      <!-- SPRITE WRAPPER -->
      <div class="text-center w-5/12">
        <div class="tabs tabs-box inline-block ml-2">
          <a
            class="tab"
            :class="{ 'tab-active': activeTab === 'default' }"
            @click="activeTab = 'default'"
            >Default</a
          >
          <a
            class="tab"
            :class="{ 'tab-active': activeTab === 'shiny' }"
            @click="activeTab = 'shiny'"
            >Shiny</a
          >
        </div>

        <img
          class="mx-auto w-10/12 lg:w-10/12"
          :style="{ imageRendering: 'pixelated' }"
          :src="
            activeTab === 'default' ? pokemon?.sprites.front_default : pokemon?.sprites.front_shiny
          "
        />
      </div>
      <!-- INFORMATION WRAPPER -->
      <!-- <div class="flex flex-row gap-x-1 justify-center">
        <img
          v-for="type in pokemon.types.map((t) => t.type.name)"
          :key="type"
          :src="typeMap[type]"
          :alt="type"
          :title="type"
          :style="{ imageRendering: 'pixelated' }"
          width="100"
        />
      </div> -->
    </div>
  </div>
</template>

<script setup>
const { getPokemonDetail } = usePokeApi()
const route = useRoute()
const pokemonName = route.params.name
const activeTab = ref('default')
const typeStore = useTypeStore()

// ─── LOAD POKEMON INFORMATIONS ───────────────────────────────────────────────
const { data: pokemon } = await useAsyncData(`pokemon-${pokemonName}`, () =>
  getPokemonDetail(pokemonName)
)
// ─── LOAD TYPE SPRITES ───────────────────────────────────────────────────────
await typeStore.fetch()
const typeMap = computed(() => typeStore.typeMap)

console.log(pokemon.value.types)
console.log(typeMap)

onMounted(() => {
  console.log(pokemonName)
})
</script>
