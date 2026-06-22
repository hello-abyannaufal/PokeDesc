<template>
  <div class="flex justify-center">
    <div class="w-1/2">
      <table class="table">
        <colgroup>
          <col class="w-1/12" />
          <col class="w-auto" />
          <col class="w-5/12" />
          <col class="w-4/12" />
        </colgroup>
        <thead class="text-xl font-head">
          <tr>
            <th v-for="header in headers" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <tbody ref="tbodyRef">
          <tr v-for="row in pokemonList.results" :key="row.id">
            <th>{{ row.id }}</th>
            <th>
              <img :src="row.sprite" :style="{ imageRendering: 'pixelated' }" width="100" />
            </th>
            <th>{{ row.name }}</th>
            <th>
              <div class="flex gap-1">
                <img
                  v-for="type in row.types"
                  :key="type"
                  :src="typeMap[type]"
                  :alt="type"
                  :title="type"
                  :style="{ imageRendering: 'pixelated' }"
                  width="50"
                />
              </div>
            </th>
          </tr>
        </tbody>
      </table>
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
const headers = ['ID', 'Sprite', 'Name', 'Type']
const tbodyRef = ref(null)

// LOAD TYPE
const { data: typeList } = await useAsyncData('type-list', async () => {
  const list = await api('/type')
  const detailed = await Promise.all(list.results.map((args) => api(`/type/${args.name}`)))
  return {
    ...list,
    results: detailed.map((row) => ({
      name: row.name,
      sprite: row.sprites['generation-iii'].emerald.name_icon,
    })),
  }
})

// LOAD POKEMON DATA
const { data: pokemonList, pending } = await useAsyncData(
  'pokemon-list',
  async () => {
    const list = await api('/pokemon', { params: { limit, offset: offset.value } })
    const detailed = await Promise.all(list.results.map((args) => api(`/pokemon/${args.name}`)))
    return {
      ...list,
      results: detailed.map((row) => ({
        id: row.id,
        name: capitalize(row.name),
        types: row.types.map((t) => t.type.name),
        sprite: row.sprites.front_default,
      })),
    }
  },
  { watch: [offset] }
)

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

// animate on first load
animateRows()

// animate on every pagination
watch(pending, (isPending) => {
  if (!isPending) animateRows()
})

const typeMap = computed(() => {
  if (!typeList.value) return {}
  return Object.fromEntries(typeList.value.results.map((t) => [t.name, t.sprite]))
})

const hasPrev = computed(() => offset.value > 0)
const hasNext = computed(() => pokemonList.value && offset.value + limit < pokemonList.value.count)

function prev() {
  if (hasPrev.value) offset.value = Math.max(0, offset.value - limit)
}
function next() {
  if (hasNext.value) offset.value += limit
}
</script>

<style scoped></style>
