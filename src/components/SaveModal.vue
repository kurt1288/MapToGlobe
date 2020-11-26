<template>
    <div class="fixed z-10 inset-0 overflow-y-auto">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <!--
            Background overlay, show/hide based on modal state.

            Entering: "ease-out duration-300"
                From: "opacity-0"
                To: "opacity-100"
            Leaving: "ease-in duration-200"
                From: "opacity-100"
                To: "opacity-0"
            -->
            <div class="fixed inset-0 transition-opacity">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <!-- This element is to trick the browser into centering the modal contents. -->
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
            <!--
            Modal panel, show/hide based on modal state.

            Entering: "ease-out duration-300"
                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                To: "opacity-100 translate-y-0 sm:scale-100"
            Leaving: "ease-in duration-200"
                From: "opacity-100 translate-y-0 sm:scale-100"
                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            -->
            <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                    <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                        <h3 class="text-2xl leading-6 font-medium text-gray-900 mb-5 flex" id="modal-headline">
                            <svg v-if="!success" class="w-7 h-7 text-red-700 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                            </svg>
                            <svg v-else class="w-7 h-7 text-green-700 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                            <span>{{ Result }}</span>
                        </h3>
                        <div class="mt-2">
                            <div v-if="success">
                                <p v-if="message" class="mb-2 text leading-5">{{ message }}</p>
                                <div v-if="id">
                                    <p class="mb-2 text leading-5">
                                        Use this URL for public sharing:
                                    </p>
                                    <p id="public" class="flex justify-between items-center mb-4 p-2 border-solid border border-gray-300 text-gray-500 cursor-pointer" title="Click to copy" @click="copy">{{ shareUrl }}<span v-show="publicCopied" class="text-xs text-green-400">Copied!</span></p>
                                    <p class="mb-2 text leading-5">
                                        Use this URL to update the save (keep private):
                                    </p>
                                    <p id="private" class="flex justify-between items-center p-2 border-solid border border-gray-300 text-gray-500 cursor-pointer" title="Click to copy" @click="copy">{{ privateUrl }}<span v-show="privateCopied" class="text-xs text-green-400">Copied!</span></p>
                                </div>
                                <p v-if="id" class="mt-4">You will not see this again. Make sure you copy both URLS!</p>
                            </div>
                            <div v-else>
                                <p class="leading-5 text-gray-500 m-2 ml-0 p-3">{{ message }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <span class="mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto">
                    <button @click="$emit('close')" type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5">
                        Close
                    </button>
                </span>
            </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, ref } from 'vue'

    export default defineComponent({
        props: {
            success: {
                type: Boolean,
                required: true
            },
            id: {
                type: String,
                required: false
            },
            updateKey: {
                type: String,
                required: false
            },
            message: {
                type: String,
                required: false
            }
        },
        setup(props) {
            const publicCopied = ref(false);
            const privateCopied = ref(false);

            const Result = computed(() => {
                return props.success ? "Success" : "Error";
            });

            const shareUrl = computed(() => {
                return window.location.origin + "/" + props.id;
            });

            const privateUrl = computed(() => {
                return window.location.origin + "/" + props.id + "?key=" + props.updateKey;
            });

            const copy = (event: Event) => {
                const eventTarget = event.target as HTMLParagraphElement;
                if (eventTarget.id === "public")
                    publicCopied.value = true;
                else
                    privateCopied.value = true;

                const elm = document.createElement('textarea');
                elm.value = eventTarget.innerText;
                document.body.appendChild(elm);
                elm.select();
                document.execCommand('copy');
                document.body.removeChild(elm);
                setTimeout(() => {
                    publicCopied.value = false;
                    privateCopied.value = false;
                }, 1200);
            }

            const showCopied = computed(() => {
                return publicCopied.value;
            })

            return { Result, shareUrl, privateUrl, copy, publicCopied, privateCopied, showCopied };
        }
    })
</script>