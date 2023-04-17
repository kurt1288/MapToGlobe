<template>
    <div class="w-1/2 mx-auto">
        <HelpNav />
        <h1 class="text-5xl my-5">Contact</h1>
        <div class="mb-10">
            <h2 class="text-3xl">Need help?</h2>
            <p>Check out the <router-link to="/help" class="text-blue-600">Help</router-link> page.</p>
        </div>
        <div class="mb-10">
            <h2 class="text-3xl">Issues?</h2>
            <p>If you have a problem, please first look through <a class="text-blue-600" href="https://github.com/kurt1288/MapToGlobe/issues">the open issues</a>. If the issue you found has not already been reported, you may <a class="text-blue-600" href="https://github.com/kurt1288/MapToGlobe/issues/new">create a new issue</a>.</p>
        </div>
    </div>
</template>

<script lang="ts">
  import HelpNav from '@/components/HelpNav.vue';

  export default ({
    components: { HelpNav }
  })
</script>
