<template>
    <div class="w-1/2 mx-auto">
        <HelpNav />
        <h1 class="text-5xl my-5">Privacy Policy</h1>
        <div class="mb-10">
            <p>Last updated July 11, 2019</p>
        </div>
        <div class="mb-10">
            <h2 class="text-3xl">When is Personal Information Collected?</h2>
            <p>Your personal data may be collected when:</p>
            <ul class="list-decimal ml-8">
                <li>You use the MapToGlobe website</li>
                <li>You send a message using the form on the contact page</li>
            </ul>
        </div>
        <div class="mb-10">
            <h2 class="text-3xl">What Personal Information is Collected?</h2>
            <p>When you use the MapToGlobe website, Google Analytics is used to obtain technical data that may include URL information, your anonymized IP Address, device information, etc. This data is obtained through the use of cookies. Please see the <a href="https://support.google.com/analytics/answer/6004245?hl=en" class="text-blue-600">Google Analytics privacy policy</a> for more information. This data is never obtained or stored by the MapToGlobe servers.</p>
            <p>The form on the contact page uses reCAPTCHA. The use of reCAPTCHA is subject to the Google <a href="https://www.google.com/policies/privacy/" class="text-blue-600">privacy policy</a> and <a href="https://www.google.com/policies/terms/" class="text-blue-600">terms of use</a>.</p>
            <p>When you send a message using the contact us page, your email is collected (in the sense that it is sent to the administrator's email inbox). Your email address is never stored or processed on any MapToGlobe server.</p>
        </div>
        <div class="mb-10">
            <h2 class="text-3xl">How is Your Personal Information Used?</h2>
            <p>Information collected through Google Analytics is used for analytical purposes to understand how the website is used (such as what pages are being visited, what actions are being done, etc.) and improve frequently used features. Since Google is the collector of this information, they may use it differently. Their privacy policy can be viewed <a href="https://support.google.com/analytics/answer/6004245?hl=en" class="text-blue-600">here</a>.</p>
            <p>Your email is used for only one purpose: to respond to email contact that you initiated. It is not used to send unsolicited communications, newsletters, alerts, etc. It is not shared with anyone, unless required by law.</p>
        </div>
        <div class="mb-10">
            <h2 class="text-3xl">How is Your Data Stored</h2>
            <p>Your personal data is never stored on any MapToGlobe server. Data collected through Google Analytics is stored by Google. Their privacy policy may be viewed here.</p>
        </div>
        <div class="mb-10">
            <h2 class="text-3xl">Changes to this Privacy Policy</h2>
            <p>Occasionally, this privacy policy may be changed. The date that this document was last changed is provided at the top of the page. Updates to this poicy may be reviewed on this page.</p>
        </div>
        <div class="mb-10">
            <h2 class="text-3xl">How to Contact</h2>
            <p>If you have any questions you may send a message using the form on the <router-link to="/contact" class="text-blue-600">Contact</router-link> page.</p>
        </div>
    </div>
</template>

<script lang="ts">
  import HelpNav from '@/components/HelpNav.vue';

  export default ({
    components: { HelpNav }
  })
</script>