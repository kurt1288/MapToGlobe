<template>
  <div class="w-1/2 mx-auto">
    <HelpNav />
    <h1 class="text-5xl my-5">Help</h1>
    <div class="mb-10">
      <h2 class="text-3xl">Supported Browsers</h2>
      <p>MapToGlobe should work in Chrome, Firefox, and Edge. The site may work on mobile, but it's designed for use on a desktop.</p>
    </div>
    <div class="my-10">
      <h2 class="text-3xl">Images</h2>
      <p>Please note some important points about images:</p>
      <ul class="list-disc pl-8">
        <li>Images should have a width twice that of it's height (i.e. a 2-1 ratio). An image not in this format will be distorted.</li>
        <li>Heightmap images should be the same resolution as the surface image.</li>
      </ul>
    </div>
    <div class="my-10">
      <h2 class="text-3xl">Saves</h2>
      <p>Saving allows you to keep work you've done and to share it. When you create a save, you get two URLs:</p>
      <ul class="list-disc pl-8">
        <li>Public URL: You can share this URL anywhere. People can view your save but cannot update it.</li>
        <li>Private URL: This URL contains the "key". With this URL, anyone can update the save. Keep this private!</li>
      </ul>
      <h3 class="text-xl mt-4">Updating</h3>
      <p>You can update a save by using the private URL (with the "key" variable in the URL). If you lose this URL/key, you will have to create a new save.</p>
    </div>
    <div class="my-10">
      <h2 class="text-3xl">FAQ</h2>
      <div class="mb-6">
        <p class="font-semibold">My map looks weird on the globe</p>
        <p>Chances are your image is not an <a href="https://en.wikipedia.org/wiki/Equirectangular_projection">equirectangular image</a>. Images must be this ratio in order to be placed on the globe correctly.</p>
      </div>
      <div class="my-6">
        <p class="font-semibold">When I add an image, it just appears as solid black</p>
        <p>This appears to be a limitation of WebGL that is dependent on the computer that is used. In my experience, this usually only happened when trying to add a very large image.</p>
      </div>
      <div class="my-6">
        <p class="font-semibold">Performance Issues</p>
        <p>The performance of this web app depends on the computer that is used to access the website. A slower computer will result in worse performance.</p>
      </div>
    </div>
    <div class="my-10">
      <h2 class="text-3xl">Problems</h2>
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