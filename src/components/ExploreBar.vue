<template>
    <div id="exploreBar" class="absolute left-0 bottom-0 w-full text-gray-900 text-sm bg-gray-200 max-h-full" :class="{ 'explore-hidden' : exploreHidden }">
            <div class="flex flex-col">
                <button type="button" class="flex items-center p-1 border-t-2 border-gray-900 bg-gray-400 hover:bg-gray-300" @click="exploreHidden = !exploreHidden">
                    <span class="w-full">Explore</span>
                    <svg v-if="exploreHidden" class="h-4 w-4 ml-auto text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                    <svg v-else class="h-4 w-4 ml-auto text-gray-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0zm0 6a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L10 14.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                </button>
                <div class="grid grid-cols-2 gap-4 p-2">
                    <router-link to="/mercury" class="flex flex-col items-center hover:bg-gray-300">Mercury <img src="@/assets/images/mercury.png" /></router-link>
                    <router-link to="/venus" class="flex flex-col items-center hover:bg-gray-300">Venus <img src="@/assets/images/venus.png" /></router-link>
                    <router-link to="/earth" class="flex flex-col items-center hover:bg-gray-300">Earth <img src="@/assets/images/earth.png" /></router-link>
                    <router-link to="/mars" class="flex flex-col items-center hover:bg-gray-300">Mars <img src="@/assets/images/mars.png" /></router-link>
                    <router-link to="/jupiter" class="flex flex-col items-center hover:bg-gray-300">Jupiter <img src="@/assets/images/jupiter.png" /></router-link>
                    <router-link to="/pluto" class="flex flex-col items-center hover:bg-gray-300">Pluto <img src="@/assets/images/pluto.png" /></router-link>
                </div>
            </div>
        </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';

    export default defineComponent({
        data() {
            return {
                exploreHidden: true
            }
        }
    })
</script>

<style scoped>
    #exploreBar {
        z-index: 1;
        width: 15rem;
        transform: translateY(0);
        transition: transform 0.2s;
    }

    #exploreBar:after {
        content: "";
        position: absolute;
        width: 100%;
        top: 0;
        z-index: -1;
        box-shadow: 0px 0px 5px 1px #1e1e1e;
    }

    #exploreBar.explore-hidden {
        transform: translateY(412px);
    }
</style>