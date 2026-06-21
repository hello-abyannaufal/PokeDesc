export function usePokeApi() {
  const config = useRuntimeConfig()

  const api = $fetch.create({
    baseURL: config.public.pokeApiBase,
  })

  return api
}
