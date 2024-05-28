<template>
    <div>hello world</div>
</template>

<script setup>
import {createApiClient} from "@image-saas/api";



onMounted(async () => {
    const tokenResp = await fetch("/api/test");
    const token = await tokenResp.text();

    const apiClient = createApiClient({signedToken: token})

    apiClient.file.createPresignedUrl.mutate({
        appId: "51d3732f-70e2-4a19-9b36-868dd6c30530",
		contentType: "image/jpeg",
		filename: "9bbecc34ed2c088d68c3f4954eba3f28.jpeg",
		size: 221263,
    })
})
</script>