<template>
    <div>
        <form v-show="recaptchaLoaded" class="mx-auto w-1/2 mb-8" id="contactForm" @submit.prevent>
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="reply_to">Your email</label>
                <input v-model="replyTo" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" id="reply_to" name="reply_to" required>
            </div>
            <div class="mb-6">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="message">Message</label>
                <textarea v-model="message" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="message" id="message" rows="10" required></textarea>
            </div>
            <div>
                <div id="g-recaptcha"></div>
                <button v-if="!messageSent" @click="validate" class="shadow bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-75 disabled:cursor-not-allowed" :disabled="submitDisabled">Submit</button>
            </div>
            <p v-if="messageSent" class="text-green-600 p-2">Your message has been sent!</p>
            <p v-if="sendError.length > 0" class="text-red-600 p-2">{{ sendError.value }}</p>
        </form>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, onBeforeMount, ref } from 'vue';
    import * as emailjs from 'emailjs-com';

    export default defineComponent({
        setup() {
            const win = window as any;

            const replyTo = ref("");
            const message = ref("");
            const recaptchaLoaded = ref(false);
            const sendError = ref("");
            const messageSending = ref(false);
            const messageSent = ref(false);

            emailjs.init("user_ozQWg3nonfN5NBwObrIuf");

            const submitDisabled = computed(() => {
                if ((replyTo.value.trim().length <= 0 || message.value.trim().length <= 0) || messageSending.value)
                    return true;
                else
                    return false;
            });

            const submit = async () => {
                try {
                    await emailjs.sendForm("mailgun_service_vq0tfvq", "template_iqu4hfn", document.getElementById("contactForm") as HTMLFormElement);
                }
                catch(ex) {
                    sendError.value = `Unable to send the message: ${ex}`;
                }
                messageSent.value = true;
            }

            const renderRecaptcha = () => {
                win.grecaptcha.render("g-recaptcha", {
                    sitekey: "6LdWpBgUAAAAAKsLoyZujUEOuvatTvYirAESqFAV",
                    size: "invisible",
                    callback: (response: any) => {
                        submit();
                    }
                });
            };

            onBeforeMount(() => {
                win.recaptchaApiLoaded = () => {
                    recaptchaLoaded.value = true;
                    renderRecaptcha();
                };

                const script = document.createElement('script');
                script.src = "https://www.google.com/recaptcha/api.js?onload=recaptchaApiLoaded&render=explicit";
                script.async = true;
                script.defer = true;

                document.head.appendChild(script);
            });

            const validate = () => {
                messageSending.value = true;
                win.grecaptcha.execute();
            }

            return { submit, sendError, replyTo, message, submitDisabled, validate, recaptchaLoaded, messageSent };
        }
    });
</script>