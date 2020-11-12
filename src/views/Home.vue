<template>
  <div class="block md:grid" style="grid-template-columns: 15rem 1fr;">
    <Nav class="hidden md:block" />
    <div>
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