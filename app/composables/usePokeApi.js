import { capitalize } from 'vue'

export function usePokeApi() {
  const config = useRuntimeConfig()
  const api = $fetch.create({ baseURL: config.public.pokeApiBase })

  async function getPokemonList({ limit, offset }) {
    const list = await api('/pokemon', { params: { limit, offset } })
    const detailed = await Promise.all(list.results.map((p) => api(`/pokemon/${p.name}`)))
    return {
      count: list.count,
      results: detailed.map((row) => ({
        id: row.id,
        name: capitalize(row.name),
        types: row.types.map((t) => t.type.name),
        sprite: row.sprites.front_default,
      })),
    }
  }

  async function getFilteredPokemonList(filteredNames) {
    if (filteredNames.length === 0) return { count: 0, results: [] }
    const detailed = await Promise.all(filteredNames.map((p) => api(`/pokemon/${p.name}`)))
    return {
      count: filteredNames.length,
      results: detailed.map((row) => ({
        id: row.id,
        name: capitalize(row.name),
        types: row.types.map((t) => t.type.name),
        sprite: row.sprites.front_default,
      })),
    }
  }

  async function getPokemonDetail(name) {
    return await api(`/pokemon/${name}`)
  }

  async function getAllPokemonNames() {
    const list = await api('/pokemon', { params: { limit: 1025, offset: 0 } })
    return list.results
  }

  async function getTypeList() {
    const list = await api('/type')
    const detailed = await Promise.all(list.results.map((t) => api(`/type/${t.name}`)))
    return detailed.map((row) => ({
      name: row.name,
      sprite: row.sprites['generation-ix']['scarlet-violet'].name_icon,
    }))
  }

  return {
    getPokemonList,
    getFilteredPokemonList,
    getPokemonDetail,
    getAllPokemonNames,
    getTypeList,
  }
}
