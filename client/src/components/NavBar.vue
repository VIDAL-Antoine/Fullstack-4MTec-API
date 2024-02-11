<template>
  <v-app-bar app color="primary" dark>
    <v-btn to="/appareils" text>Liste des appareils</v-btn>
    <v-spacer></v-spacer>
    <v-btn v-if="isLoggedIn" @click="logout" text>Logout</v-btn>
    <template v-else>
    <v-btn to="/signup" text>Sign Up</v-btn>
    <v-btn to="/login" text>Login</v-btn>
  </template>
  </v-app-bar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      isLoggedIn: !!localStorage.getItem('token')
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.$router.push("/login");
    }
  }
});
</script>

<style scoped></style>
