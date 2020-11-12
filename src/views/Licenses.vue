<template>
    <div class="w-1/2 mx-auto">
        <HelpNav />
        <h1 class="text-5xl my-5">Licenses</h1>
        <div class="mb-10">
            <p>The MapToGlobe website is Copyright © Kurt Peters. The source code is available <a href="https://github.com/kurt1288/maptoglobe" class="text-blue-600">here</a> and is released under the <a href="https://choosealicense.com/licenses/mpl-2.0/" class="text-blue-600">Mozilla Public License 2.0 agreement</a>.</p>
        </div>
    </div>
</template>

<script lang="ts">
  import HelpNav from '@/components/HelpNav.vue';

  export default ({
    components: { HelpNav }
  })
</script>