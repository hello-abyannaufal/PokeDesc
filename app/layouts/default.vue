<template>
  <div class="flex flex-col h-screen overflow-hidden">
    <AppHeader />
    <main class="flex-1 overflow-y-auto py-4"">
      <slot />
    </main>
    <Footer />
  </div>
</template>
