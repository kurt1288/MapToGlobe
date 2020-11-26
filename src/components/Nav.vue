<template>
    <div class="h-screen bg-gray-700 overflow-y-auto">
        <Loader v-if="loading" class="absolute w-full h-full inset-0" :message="loader.message" />
        <SaveModal v-if="saveModal.show" :success="saveModal.success" :id="saveModal.id" :updateKey="saveModal.key" :message="saveModal.message" @close="saveModal.show = false" />
        <div class="flex flex-col items-center justify-center">
            <div class="text-sm text-red-600 mt-0 px-6 py-3 text-center bg-gray-600 flex items-center">
                <svg class="h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="mt-0">This is a beta. Anything saved may be deleted.</p>
            </div>
        </div>

        <nav class="mt-6 select-none">
            <h3 class="w-full flex text-gray-400 px-6 pb-2">Objects</h3>
            <div>
                <button @click="menu.open.planet = !menu.open.planet" class="w-full flex justify-between items-center py-3 pl-10 pr-6 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none">
                    <span class="flex items-center">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="mx-6">Planet</span>
                    </span>

                    <span>
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-if="!menu.open.planet" d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path v-else d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </span>
                </button>

                <div v-show="menu.open.planet" class="bg-gray-700">
                    <h4 class="text-gray-400 px-12 py-2 text-sm">Images</h4>
                    <div>
                        <input type="file" class="hidden" id="surfaceFileSelect" @change="setSurfaceImage">
                        <label for="surfaceFileSelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Surface</label>
                    </div>
                    <div>
                        <input type="file" class="hidden" id="heightmapFileSelect" @change="setHeightmapImage" :disabled="!images.surface">
                        <label for="heightmapFileSelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Heightmap</label>
                    </div>
                    <!-- <div>
                        <input type="file" class="hidden" id="nightFileSelect" :disabled="!images.surface">
                        <label for="nightFileSelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Night</label>
                    </div> -->
                    <div>
                        <input type="file" class="hidden" id="specularFileSelect" @change="setSpecularImage" :disabled="!images.surface">
                        <label for="specularFileSelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Specular</label>
                    </div>
                    <div>
                        <input type="file" class="hidden" id="cloudsFileSelect" @change="setCloudsImage" :disabled="!images.surface">
                        <label for="cloudsFileSelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Clouds</label>
                    </div>

                    <!-- <h4 class="text-gray-400 px-12 py-2">Atmosphere</h4>
                    <div class="cursor-pointer grid justify-start items-center hover:bg-blue-500 hover:text-white menuCheckbox">
                        <label class="cursor-pointer py-2 pl-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" for="showAtmosphereToggle">Show</label>
                        <div class="bg-white border-1 rounded-sm border-gray-400 w-3 h-3 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                            <input type="checkbox" class="opacity-0 absolute cursor-pointer" id="showAtmosphereToggle" @change="toggleAtmosphere">
                            <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                        </div>
                    </div>
                    <div>
                        <button type="button" class="cursor-pointer text-left w-full py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" :disabled="!atmosphere.enabled">Settings</button>
                    </div> -->

                    <h4 class="text-gray-400 px-12 py-2 text-sm">Other</h4>
                    <button type="button" class="cursor-pointer text-left w-full py-2 pl-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" @click="toggleAxis">Toggle Axis</button>
                    <button type="button" class="cursor-pointer text-left w-full py-2 pl-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" value="planet" @click="toggleControls">Toggle Planet Controls</button>
                    <button type="button" class="cursor-pointer text-left w-full py-2 pl-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" value="clouds" @click="toggleControls" :disabled="!images.clouds">Toggle Cloud Controls</button>
                    <p class="font-sans text-left text-sm mt-0 font-normal w-full py-2 pl-16 block text-gray-100">Shininess</p>
                    <div class="py-2 pl-20 pr-10">
                        <vue-slider v-model="menu.planet.shininess" :min="0" :max="100" :interval="0.1" :tooltip="'none'" @change="planetShininess"></vue-slider>
                    </div>
                </div>
            </div>

            <div>
                <button @click="menu.open.moon = !menu.open.moon" class="w-full flex justify-between items-center py-3 pl-10 pr-6 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none">
                    <span class="flex items-center">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                        <span class="mx-6">Moon</span>
                    </span>

                    <span>
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-if="!menu.open.moon" d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path v-else d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </span>
                </button>

                <div v-show="menu.open.moon" class="bg-gray-700">
                    <div class="cursor-pointer grid justify-start items-center hover:bg-blue-500 hover:text-white menuCheckbox">
                        <label class="cursor-pointer py-2 pl-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" for="moonToggle">Show Moon</label>
                        <div class="bg-white border-1 rounded-sm border-gray-400 w-3 h-3 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                            <input type="checkbox" class="opacity-0 absolute cursor-pointer" id="moonToggle" @change="toggleMoon">
                            <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                        </div>
                    </div>
                    <div>
                        <input type="file" class="hidden" id="moonSurfaceSelect" @change="setMoonImage" :disabled="!moonIsVisible">
                        <label for="moonSurfaceSelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Surface</label>
                    </div>
                    <button @click="menu.moon.controls = !menu.moon.controls" class="w-full flex justify-between items-center cursor-pointer py-2 pl-16 pr-8 text-gray-100 text-sm hover:bg-blue-500 hover:text-white" :disabled="!moonIsVisible">
                        <span class="flex items-center">
                            <span>Controls</span>
                        </span>

                        <span>
                            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path v-if="!menu.open.moon" d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                <path v-else d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            </svg>
                        </span>
                    </button>
                    <div v-show="menu.moon.controls">
                        <button type="button" class="cursor-pointer text-left text-xs w-full py-2 px-20 block text-gray-100 hover:bg-blue-500 hover:text-white" value="orbit" @click="toggleControls">Orbit</button>
                        <button type="button" class="cursor-pointer text-left text-xs w-full py-2 px-20 block text-gray-100 hover:bg-blue-500 hover:text-white" value="rotation" @click="toggleControls">Rotation</button>
                        <h5 class="text-left text-xs w-full py-2 px-20 block text-gray-100">Scale</h5>
                        <div class="py-2 pl-24 pr-10">
                            <vue-slider v-model="menu.moon.scale" :min="0.1" :max="4" :interval="0.1" :tooltip="'none'" @change="moonScale"></vue-slider>
                        </div>
                        <h5 class="text-left text-xs w-full py-2 px-20 block text-gray-100">Distance</h5>
                        <div class="py-2 pl-24 pr-10">
                            <vue-slider v-model="menu.moon.distance" :min="3" :max="20" :interval="0.1" :tooltip="'none'" @change="moonDistance"></vue-slider>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <button @click="menu.open.rings = !menu.open.rings" class="w-full flex justify-between items-center py-3 pl-10 pr-6 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none">
                    <span class="flex items-center">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span class="mx-6">Rings</span>
                    </span>

                    <span>
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-if="!menu.open.rings" d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path v-else d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </span>
                </button>

                <div v-show="menu.open.rings" class="bg-gray-700">
                    <div class="cursor-pointer grid justify-start items-center hover:bg-blue-500 hover:text-white menuCheckbox">
                        <label class="cursor-pointer py-2 pl-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" for="ringsToggle">Show Rings</label>
                        <div class="bg-white border-1 rounded-sm border-gray-400 w-3 h-3 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                            <input type="checkbox" class="opacity-0 absolute cursor-pointer" id="ringsToggle" @change="toggleRings">
                            <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                        </div>
                    </div>

                    <div>
                        <input type="file" class="hidden" id="ringsSurfaceSelect" @change="setRingsImage" :disabled="!ringsVisible">
                        <label for="ringsSurfaceSelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Surface</label>
                    </div>
                    <div>
                        <input type="file" class="hidden" id="ringsTransparencySelect" @change="setRingsTransparency" :disabled="!ringsVisible">
                        <label for="ringsTransparencySelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Transparency</label>
                    </div>

                    <button type="button" class="cursor-pointer text-left w-full py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" value="rings" :disabled="!ringsVisible" @click="toggleControls">Toggle Controls</button>
                </div>
            </div>

            <div>
                <button @click="menu.open.background = !menu.open.background" class="w-full flex justify-between items-center py-3 pl-10 pr-6 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none">
                    <span class="flex items-center">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                        <span class="mx-6">Background</span>
                    </span>

                    <span>
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-if="!menu.open.background" d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path v-else d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </span>
                </button>

                <div v-show="menu.open.background" class="bg-gray-700">
                    <h4 class="text-gray-400 px-12 py-2 text-sm">Type</h4>
                    <div class="cursor-pointer grid justify-start items-center hover:bg-blue-500 hover:text-white menuCheckbox">
                        <label class="cursor-pointer py-2 pl-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" for="blackBG">Solid black</label>
                        <div class="bg-white border-1 rounded-sm border-gray-400 w-3 h-3 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                            <input type="radio" name="bgType" class="opacity-0 absolute cursor-pointer" id="blackBG" @change="setBgBlack" checked>
                            <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                        </div>
                    </div>
                    <div class="cursor-pointer grid justify-start items-center hover:bg-blue-500 hover:text-white menuCheckbox">
                        <label class="cursor-pointer py-2 pl-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" for="transparentBG">Transparent</label>
                        <div class="bg-white border-1 rounded-sm border-gray-400 w-3 h-3 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                            <input type="radio" name="bgType" class="opacity-0 absolute cursor-pointer" id="transparentBG" @change="setBgTransparent">
                            <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                        </div>
                    </div>
                    <div class="cursor-pointer grid justify-start items-center hover:bg-blue-500 hover:text-white menuCheckbox">
                        <label class="cursor-pointer py-2 pl-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" for="imageBG">Image</label>
                        <div class="bg-white border-1 rounded-sm border-gray-400 w-3 h-3 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                            <input type="file" class="hidden" id="imageBG" required @change="setBgImage">
                            <input type="radio" name="bgType" class="hidden">
                            <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <button @click="menu.open.lights = !menu.open.lights" class="w-full flex justify-between items-center py-3 pl-10 pr-6 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none">
                    <span class="flex items-center">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span class="mx-6">Lights</span>
                    </span>

                    <span>
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-if="!menu.open.lights" d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path v-else d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </span>
                </button>

                <div v-show="menu.open.lights" class="bg-gray-700">
                    <button type="button" class="cursor-pointer text-left w-full py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" value="light" @click="toggleControls">Toggle Controls</button>
                    <h5 class="text-left text-sm w-full py-2 px-16 block text-gray-100 font-normal">Sun intensity</h5>
                    <div class="py-2 pl-20 pr-10">
                        <vue-slider v-model="menu.light.sunIntensity" :min="0" :max="2.5" :interval="0.01" :tooltip="'none'" @change="sunIntensity"></vue-slider>
                    </div>
                    <h5 class="text-left text-sm w-full py-2 px-16 block text-gray-100 font-normal">Ambient intensity</h5>
                    <div class="py-2 pl-20 pr-10">
                        <vue-slider v-model="menu.light.ambientIntensity" :min="0" :max="4" :interval="0.01" :tooltip="'none'" @change="ambientIntensity"></vue-slider>
                    </div>
                </div>
            </div>

            <h3 class="w-full flex text-gray-400 px-6 pt-4 pb-2">Share</h3>
            <button class="w-full flex justify-between items-center py-3 px-10 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none" @click="takeScreenshot">
                <span class="flex items-center">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="mx-6">Screenshot</span>
                </span>
            </button>
            <button class="w-full flex justify-between items-center py-3 px-10 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none" @click="makeGif">
                <span class="flex items-center">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span class="mx-6">Animation</span>
                </span>
            </button>
            <button class="w-full flex justify-between items-center py-3 px-10 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none" @click="save">
                <span class="flex items-center">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span class="mx-6">Save</span>
                </span>
            </button>

            <h3 class="w-full flex text-gray-400 px-6 pt-4 pb-2">Other</h3>
            <router-link to="/help" class="w-full flex justify-between items-center py-3 px-10 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none" target="_blank">
                Help
                <svg class="h-4 w-4 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </router-link>
        </nav>
        <ExploreBar />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueSlider from 'vue-slider-component';
import Loader from '@/components/Loader.vue';
import SaveModal from '@/components/SaveModal.vue';
import ExploreBar from '@/components/ExploreBar.vue';
import 'vue-slider-component/theme/antd.css';
import MapToGlobe from '../assets/MapToGlobe/MapToGlobe';
import * as Firebase from '../firebase';

interface CanvasElement extends HTMLCanvasElement {
    captureStream(frameRate?: number): MediaStream;
}

export default defineComponent({
    components: {
        VueSlider,
        Loader,
        SaveModal,
        ExploreBar
    },
    data() {
        return {
            loading: false,
            loader: {
                message: null
            },
            saveModal: {
                show: false,
                success: false,
                id: "",
                key: "",
                message: ""
            },
            menu: {
                open: {
                    planet: false,
                    moon: false,
                    rings: false,
                    background: false,
                    lights: false,
                    gif: false,
                    screenshot: false
                },
                planet: {
                    shininess: 60
                },
                moon: {
                    controls: false,
                    scale: 1,
                    distance: 3
                },
                light: {
                    sunIntensity: 0.4,
                    ambientIntensity: 0.6
                }
            },
            images: {
                surface: false,
                clouds: false
            },
            atmosphere: {
                enabled: false
            },
            moonIsVisible: false,
            ringsVisible: false,
            controls: null,
            maptoglobe: {} as MapToGlobe,
            loadedJson: {}
        }
    },
    created() {
        this.$watch(
            () => this.$route.params,
            () => { if (this.$route.params.saveId.length > 0) this.Load(this.$route.params.saveId as string) },
            { immediate: true }
        )
    },
    async mounted() {
        window.addEventListener("set_loading_message", (e: CustomEventInit) => {
            this.loader.message = e.detail;
        });
        
        this.maptoglobe = new MapToGlobe(document.getElementById("scene") as HTMLCanvasElement);

        this.menu.planet.shininess = ((this.maptoglobe.planet.object.material as THREE.Material[])[0] as THREE.MeshPhongMaterial).shininess;
        this.menu.light.sunIntensity = (this.maptoglobe.instance.light.children[0] as THREE.DirectionalLight).intensity;
        this.menu.light.ambientIntensity = this.maptoglobe.instance.ambient.intensity;
        this.menu.moon.distance = this.maptoglobe.moon.moon.position.x;
        this.menu.moon.scale = this.maptoglobe.moon.moon.scale.x;
    },
    methods: {
        setSurfaceImage(event: Event) {
            Firebase.analytics.logEvent("set_planet_surface");
            const files = (event.target as HTMLInputElement).files;
            if (files !== null) {
                this.maptoglobe.planet.SetSurfaceImage(files[0]);
                this.images.surface = true;
            }
        },
        setHeightmapImage(event: Event) {
            Firebase.analytics.logEvent("set_planet_heightmap");
            const files = (event.target as HTMLInputElement).files;
            if (files !== null) {
                this.maptoglobe.planet.SetHeightmapImage(files[0]);
            }
        },
        setSpecularImage(event: Event) {
            Firebase.analytics.logEvent("set_planet_specular");
            const files = (event.target as HTMLInputElement).files;
            if (files !== null) {
                this.maptoglobe.planet.SetSpecularImage(files[0]);
            }
        },
        toggleAxis() {
            Firebase.analytics.logEvent("toggle_planet_axis");
            this.maptoglobe.planet.ToggleAxis();
        },
        toggleAtmosphere() {
            //this.maptoglobe.planet.ToggleAtmosphere();
            return;
        },
        setCloudsImage(event: Event) {
            Firebase.analytics.logEvent("set_planet_clouds");
            const files = (event.target as HTMLInputElement).files;
            if (files !== null) {
                this.maptoglobe.planet.SetCloudsImage(files[0]);
                this.images.clouds = true;
            }
        },
        planetShininess(value: number) {
            ((this.maptoglobe.planet.object.material as THREE.Material[])[0] as THREE.MeshPhongMaterial).shininess = value;
        },
        toggleMoon() {
            Firebase.analytics.logEvent("toggle_moon");
            this.moonIsVisible = !this.moonIsVisible;
            if (this.moonIsVisible) {
                this.maptoglobe.AddMoon();
            }
            else {
                this.maptoglobe.RemoveMoon();
            }
        },
        setMoonImage(event: Event) {
            Firebase.analytics.logEvent("set_moon_surface");
            const files = (event.target as HTMLInputElement).files;
            if (files !== null) {
                this.maptoglobe.moon.SetSurfaceImage(files[0]);
            }
        },
        toggleRings() {
            Firebase.analytics.logEvent("toggle_rings");
            this.ringsVisible = !this.ringsVisible;
            this.maptoglobe.ToggleRings();
        },
        setRingsImage(event: Event) {
            Firebase.analytics.logEvent("set_rings_surface");
            const files = (event.target as HTMLInputElement).files;
            if (files !== null) {
                this.maptoglobe.rings.SetSurfaceImage(files[0]);
            }
        },
        setRingsTransparency(event: Event) {
            Firebase.analytics.logEvent("set_rings_transparency");
            const files = (event.target as HTMLInputElement).files;
            if (files !== null)
                this.maptoglobe.rings.SetTransparencyImage(files[0]);
        },
        setBgBlack() {
            Firebase.analytics.logEvent("set_bg_black");
            this.maptoglobe.SetBGBlack();
        },
        setBgTransparent() {
            Firebase.analytics.logEvent("set_bg_transparent");
            this.maptoglobe.SetBGTransparent();
        },
        setBgImage(event: Event) {
            Firebase.analytics.logEvent("set_bg_image");
            (document.querySelector("#imageBG + input") as HTMLInputElement).checked = true;
            const files = (event.target as HTMLInputElement).files;
            if (files !== null) {
                this.maptoglobe.SetBGImage(files[0]);
            }
        },
        toggleControls(event: Event) {
            const target = (event.target as HTMLButtonElement).value;
            switch (target) {
                case "planet":
                    Firebase.analytics.logEvent("toggle_planet_controls");
                    this.maptoglobe.ToggleControls(this.maptoglobe.planet.object);
                    break;
                case "rings":
                    Firebase.analytics.logEvent("toggle_rings_controls");
                    this.maptoglobe.ToggleControls(this.maptoglobe.rings.object);
                    break;
                case "light":
                    Firebase.analytics.logEvent("toggle_light_controls");
                    this.maptoglobe.ToggleControls(this.maptoglobe.instance.light as THREE.Mesh);
                    break;
                case "orbit":
                    Firebase.analytics.logEvent("toggle_orbit_controls");
                    this.maptoglobe.ToggleControls(this.maptoglobe.moon.object as THREE.Mesh);
                    break;
                case "rotation":
                    Firebase.analytics.logEvent("toggle_rotation_controls");
                    this.maptoglobe.ToggleControls(this.maptoglobe.moon.moon);
                    break;
                case "clouds":
                    Firebase.analytics.logEvent("toggle_clouds_controls");
                    this.maptoglobe.ToggleControls(this.maptoglobe.planet.object.getObjectByName("clouds") as THREE.Mesh);
            }
        },
        moonScale(value: number) {
            this.maptoglobe.moon.Scale(value);
        },
        moonDistance(value: number) {
            this.maptoglobe.moon.Distance(value);
        },
        sunIntensity(value: number) {
            this.maptoglobe.instance.SetSunIntensity(value);
        },
        ambientIntensity(value: number) {
            this.maptoglobe.instance.SetAmbientIntensity(value);
        },
        makeGif() {
            Firebase.analytics.logEvent("make_gif");
            this.maptoglobe.Gif(document.getElementById("scene") as CanvasElement);
        },
        takeScreenshot() {
            Firebase.analytics.logEvent("take_screenshot");
            this.maptoglobe.Screenshot(document.getElementById("scene") as CanvasElement);
        },
        async save() {
            Firebase.analytics.logEvent("save");
            this.loading = true;
            const response = await this.maptoglobe.Save(this.$route, this.loadedJson);
            if (response.success){ 
                this.saveModal.success = true;

                if (response.id && response.key) {
                    this.saveModal.id = response.id;
                    this.saveModal.key = response.key;

                    this.$router.push({ name: "Home", params: { saveId: response.id }, query: { key: response.key } });
                }
                if (response.message)
                    this.saveModal.message = response.message;
            }
            else {
                this.saveModal.success = false;
                if (response.message)
                    this.saveModal.message = response.message;
            }
            this.saveModal.show = true;
            this.loading = false;
        },
        async Load(item: string) {
            const event = new CustomEvent('set_loading_message', { detail: `Loading` });
            window.dispatchEvent(event);

            this.loading = true;
            const data = await Firebase.Get(item);

            if (data.success) {
                this.loadedJson = data.data;
                this.images.surface = true;
                await this.maptoglobe.Load(data.data);

                this.menu.planet.shininess = ((this.maptoglobe.planet.object.material as THREE.Material[])[0] as THREE.MeshPhongMaterial).shininess;
                this.menu.light.sunIntensity = (this.maptoglobe.instance.light.children[0] as THREE.DirectionalLight).intensity;
                this.menu.light.ambientIntensity = this.maptoglobe.instance.ambient.intensity;
                this.menu.moon.distance = this.maptoglobe.moon.moon.position.x;
                this.menu.moon.scale = this.maptoglobe.moon.moon.scale.x;
            }
            else {
                this.saveModal.success = false;
                this.saveModal.message = data.message as string;
                this.saveModal.show = true;
            }
            this.loading = false;
        }
    }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    input:checked + svg, input[type=file]:valid + svg, input:checked + div > div > svg {
        display: block;
    }

    .menuCheckbox {
        grid-template-columns: 80% 1fr;
    }

    input:disabled + label, input:disabled + div, input:disabled + div > label, button:disabled {
        opacity: 0.4;
        cursor: default;
    }
</style>
