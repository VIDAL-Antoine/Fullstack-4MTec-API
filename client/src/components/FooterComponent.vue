<template>
    <v-footer color="primary">
        <v-card-text class="text-center">{{ new Date().getFullYear() }} — <strong>4MTec</strong></v-card-text>
    </v-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    data() {
        return {
        };
    },
});
</script>

<style scoped></style>
