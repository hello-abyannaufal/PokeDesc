<!-- <template>
  <AppHeader class="mb-2" />
  <slot />
  <Footer class="mt-7" />
</template> -->
<template>
  <div class="flex flex-col min-h-screen">
    <AppHeader class="mb-2" />
    <main class="flex-1">
      <slot />
    </main>
    <Footer class="mt-auto" />
  </div>
</template>
