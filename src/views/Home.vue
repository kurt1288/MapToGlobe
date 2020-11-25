<template>
  <div class="block md:grid relative overflow-hidden" id="container">
    <Nav class="hidden md:block" />
    <div class="relative">
      <div class="pointer-events-none absolute bottom-0 left-0 right-0 w-full text-center">
        <h1 class="mb-2 text-xl text-white font-normal">MapToGlobe <span class="text-sm">beta</span></h1>
      </div>
      <Scene />
    </div>
  </div>
</template>

<script lang="ts">
import Scene from '@/components/Scene.vue'; // @ is an alias to /src
import Nav from '@/components/Nav.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { Scene, Nav }
})
</script>