<template>
  <v-app>
    <v-app-bar app color="primary" dark>AAA</v-app-bar>

    <v-main>
      <AppareilsList />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import AppareilsList from './components/AppareilsList.vue';

export default Vue.extend({
  name: 'App',

  components: {
    AppareilsList,
  },

  data: () => ({
    //
  }),
});
</script>
