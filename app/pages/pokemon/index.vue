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
      <div class="flex flex-row gap-x-2 justify-end">
        <button v-if="hasPrev" class="btn btn-primary" @click="prev()">Previous</button>
        <button v-if="hasNext" class="btn btn-primary" @click="next()">Next</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, capitalize, watch, nextTick } from 'vue'
import gsap from 'gsap'

const api = usePokeApi()
const limit = 10
const offset = ref(0)
const headers = ['ID', 'Pokemon Name', 'Type']
const search = ref('')
const searchTrigger = ref('') // actual trigger for useAsyncData watch
const tbodyRef = ref(null)
const totalCount = ref(0)

// ─── CACHE ALL 1025 POKEMON NAMES ───────────────────────────────────────────
// useState persists across navigations within the same session (no localStorage needed)
const allPokemon = useState('all-pokemon', () => null)

if (!allPokemon.value) {
  const { data } = await useAsyncData('all-pokemon-names', () =>
    api('/pokemon', { params: { limit: 1025, offset: 0 } })
  )
  allPokemon.value = data.value?.results ?? [] // [{ name, url }, ...]
}

// ─── SEARCH WATCHER ──────────────────────────────────────────────────────────
// Fires useAsyncData only when search crosses the 4-char threshold or is cleared
watch(search, (val) => {
  if (val.length >= 4 || val.length === 0) {
    offset.value = 0 // reset pagination when switching modes
    searchTrigger.value = val // triggers useAsyncData re-run
  }
})

const isSearchMode = computed(() => searchTrigger.value.length >= 4)

const filteredNames = computed(() => {
  if (!isSearchMode.value || !allPokemon.value) return []
  return allPokemon.value.filter((p) => p.name.includes(searchTrigger.value.toLowerCase()))
})

// ─── LOAD TYPE SPRITES ───────────────────────────────────────────────────────
const { data: typeList } = await useAsyncData('type-list', async () => {
  const list = await api('/type')
  const detailed = await Promise.all(list.results.map((t) => api(`/type/${t.name}`)))
  return {
    ...list,
    results: detailed.map((row) => ({
      name: row.name,
      sprite: row.sprites['generation-ix']['scarlet-violet'].name_icon,
    })),
  }
})

const typeMap = computed(() => {
  if (!typeList.value) return {}
  return Object.fromEntries(typeList.value.results.map((t) => [t.name, t.sprite]))
})

// ─── LOAD POKEMON DATA ───────────────────────────────────────────────────────
const { data: pokemonList, pending } = await useAsyncData(
  'pokemon-list',
  async () => {
    let targets

    if (isSearchMode.value) {
      targets = filteredNames.value
    } else {
      const list = await api('/pokemon', { params: { limit, offset: offset.value } })
      totalCount.value = list.count
      targets = list.results
    }

    if (targets.length === 0) return { count: 0, results: [] }

    const detailed = await Promise.all(targets.map((p) => api(`/pokemon/${p.name}`)))

    return {
      count: isSearchMode.value ? filteredNames.value.length : totalCount.value,
      results: detailed.map((row) => ({
        id: row.id,
        name: capitalize(row.name),
        types: row.types.map((t) => t.type.name),
        sprite: row.sprites.front_default,
      })),
    }
  },
  { watch: [offset, searchTrigger] }
)

// Set totalCount on first load
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
