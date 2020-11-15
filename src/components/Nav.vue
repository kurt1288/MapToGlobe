<template>
    <div class="h-screen bg-gray-700 overflow-y-auto">
        <Loader v-if="loading" class="absolute w-full h-full inset-0" />
        <SaveModal v-if="saveModal.show" :success="saveModal.success" :id="saveModal.id" :updateKey="saveModal.key" :message="saveModal.message" @close="saveModal.show = false" />
        <div class="flex flex-col items-center justify-center mt-8">
            <h1 class="leading-none text-3xl text-white font-normal">MapToGlobe</h1>
            <p class="text-sm m-0 text-white">Beta</p>
            <p class="text-sm text-red-600 px-6 py-3 text-center bg-gray-600">This is a beta. Anything saved may be deleted.</p>
        </div>

        <nav class="mt-6 select-none">
            <h3 class="w-full flex text-gray-400 px-6">Objects</h3>
            <div>
                <button @click="menu.open.planet = !menu.open.planet" class="w-full flex justify-between items-center py-3 px-6 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none">
                    <span class="flex items-center">
                        <span class="mx-4">Planet</span>
                    </span>

                    <span>
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-if="!menu.open.planet" d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path v-else d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </span>
                </button>

                <div v-show="menu.open.planet" class="bg-gray-700">
                    <h4 class="text-gray-400 px-12 py-2">Images</h4>
                    <div>
                        <input type="file" class="hidden" id="surfaceFileSelect" @change="setSurfaceImage">
                        <label for="surfaceFileSelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Surface</label>
                    </div>
                    <div>
                        <input type="file" class="hidden" id="heightmapFileSelect" @change="setHeightmapImage" :disabled="!images.surface">
                        <label for="heightmapFileSelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Heightmap</label>
                    </div>
                    <div>
                        <input type="file" class="hidden" id="nightFileSelect" :disabled="!images.surface">
                        <label for="nightFileSelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Night</label>
                    </div>
                    <div>
                        <input type="file" class="hidden" id="specularFileSelect" @change="setSpecularImage" :disabled="!images.surface">
                        <label for="specularFileSelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Specular</label>
                    </div>

                    <h4 class="text-gray-400 px-12 py-2">Clouds</h4>
                    <div class="cursor-pointer grid justify-start items-center hover:bg-blue-500 hover:text-white menuCheckbox">
                        <div>
                            <input type="file" class="hidden" id="cloudsFileSelect" @change="setCloudsImage" :disabled="!images.surface">
                            <label for="cloudsFileSelect" class="cursor-pointer py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white">Image</label>
                        </div>
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

                    <h4 class="text-gray-400 px-12 py-2">Other</h4>
                    <div class="cursor-pointer grid justify-start items-center hover:bg-blue-500 hover:text-white menuCheckbox">
                        <label class="cursor-pointer py-2 pl-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" for="showAxisToggle">Show Axis</label>
                        <div class="bg-white border-1 rounded-sm border-gray-400 w-3 h-3 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                            <input type="checkbox" class="opacity-0 absolute cursor-pointer" id="showAxisToggle" @change="toggleAxis">
                            <svg class="fill-current hidden w-4 h-4 text-green-500 pointer-events-none" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                        </div>
                    </div>

                    <button type="button" class="cursor-pointer text-left w-full py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" value="planet" @click="toggleControls">Toggle Controls</button>
                </div>
            </div>

            <div>
                <button @click="menu.open.moon = !menu.open.moon" class="w-full flex justify-between items-center py-3 px-6 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none">
                    <span class="flex items-center">
                        <span class="mx-4">Moon</span>
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
                <button @click="menu.open.rings = !menu.open.rings" class="w-full flex justify-between items-center py-3 px-6 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none">
                    <span class="flex items-center">
                        <span class="mx-4">Rings</span>
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

                    <button type="button" class="cursor-pointer text-left w-full py-2 px-16 block text-sm text-gray-100 hover:bg-blue-500 hover:text-white" value="rings" :disabled="!ringsVisible" @click="toggleControls">Toggle Controls</button>
                </div>
            </div>

            <div>
                <button @click="menu.open.background = !menu.open.background" class="w-full flex justify-between items-center py-3 px-6 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none">
                    <span class="flex items-center">
                        <span class="mx-4">Background</span>
                    </span>

                    <span>
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path v-if="!menu.open.background" d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path v-else d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </span>
                </button>

                <div v-show="menu.open.background" class="bg-gray-700">
                    <h4 class="text-gray-400 px-12 py-2">Type</h4>
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
                <button @click="menu.open.lights = !menu.open.lights" class="w-full flex justify-between items-center py-3 px-6 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none">
                    <span class="flex items-center">
                        <span class="mx-4">Lights</span>
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

            <h3 class="w-full flex text-gray-400 px-6 pt-4">Save / Export</h3>
            <button class="w-full flex justify-between items-center py-3 px-10 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none" @click="makeGif">Make a gif</button>
            <button class="w-full flex justify-between items-center py-3 px-10 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none" @click="takeScreenshot">Take a screenshot</button>
            <button class="w-full flex justify-between items-center py-3 px-10 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none" @click="save">Save</button>

            <h3 class="w-full flex text-gray-400 px-6 pt-4">Help</h3>
            <router-link to="/help" class="w-full flex justify-between items-center py-3 px-10 text-gray-100 cursor-pointer hover:bg-gray-800 hover:text-gray-100 focus:outline-none" target="_blank">
                Help
                <svg class="h-5 w-5 mt-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
            </router-link>
        </nav>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VueSlider from 'vue-slider-component';
import Loader from '@/components/Loader.vue';
import SaveModal from '@/components/SaveModal.vue';
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
        SaveModal
    },
    data() {
        return {
            loading: false,
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
                moon: {
                    controls: false,
                    scale: 1,
                    distance: 3
                },
                light: {
                    sunIntensity: 1,
                    ambientIntensity: 0
                }
            },
            images: {
                surface: false
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
    async mounted() {
        this.maptoglobe = new MapToGlobe(document.getElementById("scene") as HTMLCanvasElement);
        if (this.$route.params.saveId) {
            this.loading = true;
            const data = await Firebase.Get(this.$route.params.saveId as string);

            if (data.success) {
                this.loadedJson = data.data;
                this.images.surface = true;
                this.maptoglobe.Load(data.data);
            }
            else {
                this.saveModal.success = false;
                this.saveModal.message = data.message as string;
                this.saveModal.show = true;
            }
            this.loading = false;
        }
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
            const files = (event.target as HTMLInputElement).files;
            if (files !== null) {
                this.maptoglobe.planet.SetCloudsImage(files[0]);
            }
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
