<template>
  <div>
    <div class="w-1/2">
      <table class="table">
        <colgroup>
          <col class="w-1/12" />
          <col class="w-auto" />
          <col class="w-5/12" />
          <col class="w-4/12" />
        </colgroup>
        <!-- head -->
        <thead class="text-xl text-black font-head">
          <tr>
            <th v-for="header in headers" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <!-- body -->
        <tbody>
          <tr v-for="row in data.results" :key="row.id">
            <th>{{ row.id }}</th>
            <th>
              <img :src="row.sprite" :style="{ imageRendering: 'pixelated' }" width="100" />
            </th>
            <th>{{ row.name }}</th>
            <th>{{ row.types }}</th>
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
import { ref, capitalize } from 'vue'

const api = usePokeApi()
const limit = 10
const offset = ref(0)
const headers = ['ID', 'Sprite', 'Name', 'Type']

const { data } = await useAsyncData(
  'pokemon-list',
  async () => {
    const list = await api('/pokemon', { params: { limit, offset: offset.value } })
    console.log(list)

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

const hasPrev = computed(() => offset.value > 0)
const hasNext = computed(() => data.value && offset.value + limit < data.value.count)

function prev() {
  if (hasPrev.value) offset.value = Math.max(0, offset.value - limit)
}
function next() {
  if (hasNext.value) offset.value += limit
}
</script>

<style scoped></style>
