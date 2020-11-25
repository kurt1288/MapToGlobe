<template>
    <div class="w-1/2 mx-auto pb-10">
        <HelpNav />
        <h1 class="text-5xl my-5">Help</h1>
        <div class="my-10">
            <h2 class="text-3xl my-5">Supported Browsers</h2>
            <p>MapToGlobe should work in Chrome, Firefox, and Edge. The site may work on mobile, but it's designed for use on a desktop.</p>
        </div>
        <div class="my-10">
            <h2 class="text-3xl my-5">Planet</h2>
            <p>The main sphere (i.e. the planet) lets you apply four images. Only the surface image is required, but the others allow you to add additional detail to the planet.</p>
            <ul class="my-4">
                <li class="my-3"><strong>Surface</strong> - This is the main image that you will see overlayed onto the planet sphere. <a class="text-blue-600 hover:text-orange-500" href="https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73701/world.topo.bathy.200405x294x196.jpg" target="_blank" rel="noopener noreferrer">Example</a></li>
                <li class="my-3"><strong>Heightmap</strong> - This image adds height detail to the planet sphere. The image itself is a black and white only image, where black pixel are the lowest elevation and solid white pixels are the highest. This image should be the same resolution as the surface image. <a class="text-blue-600 hover:text-orange-500" href="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Srtm_ramp2.world.21600x10800.jpg/1280px-Srtm_ramp2.world.21600x10800.jpg" target="_blank" rel="noopener noreferrer">Example</a></li>
                <li class="my-3"><strong>Specular</strong> - This image defines how shiny areas of the sphere are. Like the heightmap, this is a black and white image. Black pixels indicate no reflectivity while white pixels are full reflections (and pixels inbetween are partial). <a class="text-blue-600 hover:text-orange-500" href="http://shadedrelief.com/natural3/ne3_data/8192/masks/water_8k.png" target="_blank" rel="noopener noreferrer">Example</a></li>
                <li class="my-3"><strong>Clouds</strong> - This image will appear <i>over</i> the surface image. Like the heightmap and specular images, this is a black and white image. Black corresponds to completely transparent and white is completely opaque. <a class="text-blue-600 hover:text-orange-500" href="https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg" target="_blank" rel="noopener noreferrer">Example</a></li>
            </ul>
            <div class="flex items-center my-3 p-2 pt-1 bg-orange-300 text-orange-800 text-sm">
                <svg class="w-12 h-12 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>All images used for the planet (and for the moon below) must be in an "equirectangular" format. In other words, the width of the image must be twice the height. An image not in this format will be distorted and look incorrect on the sphere.</p>
            </div>
        </div>
        <div class="my-10">
            <h2 class="text-3xl my-5">Moon</h2>
            <p>Currently, the moon only supports a single image: the surface image.</p>
        </div>
        <div class="my-10">
            <h2 class="text-3xl my-5">Rings</h2>
            <p>Because of how the ring wraps around the planet (with a hole in the middle), images used on rings are a little different that those used on a planet or moon object. Two images are supported:</p>
            <ul class="my-4">
                <li class="my-3"><strong>Surface</strong> - The same as the others in its function: This image is what you see.</li>
                <li class="my-3"><strong>Transparency</strong> - If you wish to create empty areas of the rings that you can actually see through, you'll need a transparency map. This, like many of the other images, is a black and white image. Completely black is fully transparency and completely white is fully opaque (values in between will be varying levels of transparent).</li>
            </ul>
            <div class="flex items-center my-3 p-2 pt-1 bg-orange-300 text-orange-800 text-sm">
                <svg class="w-12 h-12 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Both ring images must be rectangular, though no specific aspect ratio is necessary. Rings bands must be vertical, with the left part of the image corresponding to the inner part of the ring and the right part corresponding to the outer part of the ring.</p>
            </div>
            <p>To see an example, see the images here: <a class="text-blue-600 hover:text-orange-500" href="http://bjj.mmedia.is/data/s_rings/index.html" target="_blank" rel="noopener noreferrer">http://bjj.mmedia.is/data/s_rings/index.html</a></p>
        </div>
        <div class="my-10">
            <h2 class="text-3xl my-5">Sharing</h2>
            <p>There are three ways you can share what you have created:</p>
            <ul class="my-4">
                <li class="my-3"><strong>Screenshot</strong> - This option takes a screenshot of the current window (not including the menu bar). What you see is exactly how the screenshot will look. You can move objects around to get different screenshots.</li>
                <li class="my-3"><strong>Animation</strong> - This will rotate the current scene and give you a animated ".webm" file (if you wish to share it, you can upload it to a site like Imgur to get a URL). If you are zoomed in close enough, the light will remaing stationary while the planet sphere rotates. If you zoom out far enough, everything including the light will rotate.</li>
                <li class="my-3"><strong>Save</strong> - This option will give you a unique URL that you can use to come back to and view your work later. Or you can share it and others can see what you've done.</li>
            </ul>
            <div class="flex items-center my-3 p-2 pt-1 bg-orange-300 text-orange-800 text-sm">
                <svg class="w-10 h-10 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Make sure you keep the URL with the key private. This key URL lets you (or anyone with it) update the save. If you lose the key URL, you will have to create a new save if you wish to update it.</p>
            </div>
        </div>
        <div class="my-10">
            <h2 class="text-3xl my-5">Controls</h2>
            <p>Use your mouse to move the scene around. Click and drag to spin and the mousewheel to zoom in and out. When zoomed in, the light will remain fixed so you can always see what's facing you. When zoomed out far enough, the light will spin with everything else so you can view the dark side of objects.</p>
            <p>Some objects also have separate controls that, when toggle, allow you to rotate the object independently of everything else.</p>
        </div>
        <div class="my-10">
            <h2 class="text-3xl my-5">FAQ</h2>
            <ul class="my-4">
                <li class="my-3">
                    <p class="font-semibold">My map looks weird on the globe</p>
                    <p>Chances are your image is not an <a href="https://en.wikipedia.org/wiki/Equirectangular_projection" target="_blank" rel="noopener noreferrer">equirectangular image</a>. Images must be this ratio in order to be placed on the globe correctly.</p>
                </li>
                <li class="my-3">
                    <p class="font-semibold">When I add an image, it just appears as solid black/white</p>
                    <p>This appears to be a limitation of WebGL that is dependent on the computer that is used. In my experience, this usually only happened when trying to add a very large image.</p>
                </li>
                <li class="my-3">
                    <p class="font-semibold">Performance Issues</p>
                    <p>The performance of this web app depends on the computer that is used to access the website. A slower computer will result in worse performance.</p>
                </li>
            </ul>
        </div>
        <div class="my-10">
            <h2 class="text-3xl my-5">Problems</h2>
            <p>If you have a problem, please first look through <a class="text-blue-600" href="https://github.com/kurt1288/MapToGlobe/issues" target="_blank" rel="noopener noreferrer">the open issues</a>. If the issue you found has not already been reported, you may <a class="text-blue-600" href="https://github.com/kurt1288/MapToGlobe/issues/new" target="_blank" rel="noopener noreferrer">create a new issue</a>.</p>
        </div>
    </div>
</template>

<script lang="ts">
  import HelpNav from '@/components/HelpNav.vue';

  export default ({
    components: { HelpNav }
  })
</script>