<template>
    <v-app>
      <v-app-bar app color="primary">
        <v-toolbar-title>4MTec</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text to="/liste">Liste des appareils</v-btn>
      </v-app-bar>
  
      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
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

<style scoped>
</style>
