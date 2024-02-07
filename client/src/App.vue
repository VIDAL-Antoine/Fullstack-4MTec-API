<template>
  <v-app>
    <NavBar />

    <v-main>
      <router-view></router-view>
    </v-main>

    <FooterComponent />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import NavBar from './components/NavBar.vue';
import FooterComponent from './components/FooterComponent.vue';

export default Vue.extend({
  name: 'App',

  components: {
    NavBar,
    FooterComponent,
  },

  data: () => ({
  }),
});
</script>
