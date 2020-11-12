<template>
    <div class="w-1/2 mx-auto">
        <HelpNav />
        <h1 class="text-5xl my-5">Legal</h1>
        <div class="mb-10">
            <h2 class="text-3xl">Third-Party Libraries</h2>
            <p>MapToGlobe uses many open-source third party libraries. To view the licenses, please visit the <router-link to="/legal/licenses" class="text-blue-600">Licenses</router-link> page.</p>
        </div>
        <div class="mb-10">
            <h2 class="text-3xl">Privacy Policy</h2>
            <p>The privacy policy may be viewed <router-link to="/legal/privacy" class="text-blue-600">here</router-link>.</p>
        </div>
        <div class="mb-10">
            <h2 class="text-3xl">User Agreement Regarding User-Generated Content</h2>
            <p>MapToGlobe allows users to upload images ("content") to the service.</p>
            <p>When uploading content, you promise that (1) you own or have the right to post such content, and (2) such content does not violate any applicable law, intellectual property, or rights of others.</p>
            <p>MapToGlobe may remove content that violates this agreement.</p>
            <p>MapToGlobe is not responsible for contant. You agree that if anyone submits a claim against MapToGlobe or any of its administrators related to content that you post, then you will indemnify and hold MapToGlobe and its administrators harmless from and against all damages, losses, and expenses of any kind (including reasonable attorney's fees) arising out of such claim.</p>
            <p>If you believe that any content infringes your rights, you may used the <router-link to="/contact" class="text-blue-600">contact form</router-link> to submit a notice. Please provide detailed information in the message, including the URL containing the infringing content.</p>
        </div>
    </div>
</template>

<script lang="ts">
  import HelpNav from '@/components/HelpNav.vue';

  export default ({
    components: { HelpNav }
  })
</script>