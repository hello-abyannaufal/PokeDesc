<template>
  <div class="flex justify-center">
    <div class="w-full md:w-1/2 mx-auto px-2 md:px-0">
      <!-- SEARCH FEATURE -->
      <div class="flex w-full gap-x-1">
        <input
          v-model="search"
          type="text"
          placeholder="Input name (min. 4 characters)"
          class="input w-10/12"
        />
        <button class="btn w-2/12 bg-poke-yellow border-poke-yellow">
          <Icon name="mdi:magnify" />
        </button>
      </div>

      <!-- SEARCH HINT -->
      <p v-if="search.length > 0 && search.length < 4" class="text-sm text-static mt-1 px-1">
        Type at least 4 characters to search...
      </p>
      <p
        v-else-if="isSearchMode && pokemonList?.results.length === 0"
        class="text-sm text-static mt-1 px-1"
      >
        No Pokémon found for "{{ search }}"
      </p>

      <!-- TABLE POKEMON DATA -->
      <table class="table font-mono">
        <colgroup>
          <col class="w-1/12" />
          <col class="w-auto" />
          <col class="w-3/12 md:4/12" />
        </colgroup>
        <thead class="text-xl font-mono">
          <tr>
            <th v-for="header in headers" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <tbody ref="tbodyRef" class="text-lg">
          <tr v-for="row in pokemonList?.results" :key="row.id">
            <th class="text-center">{{ row.id }}</th>
            <th>
              <div class="flex items-center">
                <img :src="row.sprite" :style="{ imageRendering: 'pixelated' }" width="100" />
                <NuxtLink
                  :to="`/pokemon/${row.name}`"
                  class="text-poke-blue hover:text-poke-red underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {{ row.name }}
                </NuxtLink>
              </div>
            </th>
            <th>
              <div class="flex flex-col gap-1">
                <img
                  v-for="type in row.types"
                  :key="type"
                  :src="typeMap[type]"
                  :alt="type"
                  :title="type"
                  :style="{ imageRendering: 'pixelated' }"
                  width="70"
                />
              </div>
            </th>
          </tr>
        </tbody>
      </table>

      <!-- PAGINATION -->
      <div class="flex justify-center">
        <div class="join">
          <button @click="prev()" class="join-item btn" :class="{ 'btn-disabled': !hasPrev }">
            «
          </button>
          <button class="join-item btn">Page {{ currentPage }}</button>
          <button @click="next()" class="join-item btn" :class="{ 'btn-disabled': !hasNext }">
            »
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import gsap from 'gsap'

const { getPokemonList, getFilteredPokemonList, getAllPokemonNames } = usePokeApi()
const typeStore = useTypeStore()
const limit = 10
const offset = ref(0)
const headers = ['ID', 'Pokemon Name', 'Type']
const search = ref('')
const searchTrigger = ref('')
const tbodyRef = ref(null)
const totalCount = ref(0)

// ─── CACHE ALL 1025 POKEMON NAMES ───────────────────────────────────────────
const allPokemon = useState('all-pokemon', () => null)

if (!allPokemon.value) {
  const { data } = await useAsyncData('all-pokemon-names', () => getAllPokemonNames())
  allPokemon.value = data.value ?? []
}

// ─── LOAD TYPE SPRITES ───────────────────────────────────────────────────────
await typeStore.fetch()
const typeMap = computed(() => typeStore.typeMap)

// ─── SEARCH WATCHER ──────────────────────────────────────────────────────────
watch(search, (val) => {
  if (val.length >= 4 || val.length === 0) {
    offset.value = 0
    searchTrigger.value = val
  }
})

const isSearchMode = computed(() => searchTrigger.value.length >= 4)

const filteredNames = computed(() => {
  if (!isSearchMode.value || !allPokemon.value) return []
  return allPokemon.value.filter((p) => p.name.includes(searchTrigger.value.toLowerCase()))
})

// ─── LOAD POKEMON DATA ───────────────────────────────────────────────────────
const { data: pokemonList, pending } = await useAsyncData(
  'pokemon-list',
  () =>
    isSearchMode.value
      ? getFilteredPokemonList(filteredNames.value)
      : getPokemonList({ limit, offset: offset.value }),
  { watch: [offset, searchTrigger] }
)

// ─── SET TOTAL COUNT ─────────────────────────────────────────────────────────
watch(
  pokemonList,
  (val) => {
    if (val?.count && !isSearchMode.value) totalCount.value = val.count
  },
  { immediate: true }
)

// ─── GSAP ROW ANIMATION ──────────────────────────────────────────────────────
function animateRows() {
  nextTick(() => {
    if (!tbodyRef.value) return
    const rows = tbodyRef.value.querySelectorAll('tr')
    gsap.fromTo(
      rows,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
    )
  })
}

animateRows()

watch(pending, (isPending) => {
  if (!isPending) animateRows()
})

// ─── PAGINATION ───────────────────────────────────────────────────────────────
const currentPage = computed(() => Math.floor(offset.value / limit) + 1)
const hasPrev = computed(() => !isSearchMode.value && offset.value > 0)
const hasNext = computed(() => !isSearchMode.value && offset.value + limit < totalCount.value)

function prev() {
  if (hasPrev.value) offset.value = Math.max(0, offset.value - limit)
}
function next() {
  if (hasNext.value) offset.value += limit
}
</script>

<style scoped></style>
