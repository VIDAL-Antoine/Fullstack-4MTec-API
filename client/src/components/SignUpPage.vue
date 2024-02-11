<template>
    <v-container>
      <v-text-field v-model="username" label="Username" required hide-details></v-text-field>
      <v-text-field v-model="password" label="Password" hide-details required type="password"></v-text-field>
      <v-btn type="submit" color="primary" block class="mt-2" @click="signup">Sign Up</v-btn>
      <br>
      <div v-if="errorMessage" class="error-message">/!\ {{ errorMessage }} /!\</div>
    </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default defineComponent({
  data: () => ({
    valid: false,
    username: '',
    password: '',
    errorMessage: '',
  }),

  methods: {
   async signup() {
      try {
         const response = await axios.post(`${API_BASE_URL}/signup`, {
            username: this.username,
            password: this.password
         });
         console.log(response.data.message);
         this.username = '';
         this.password = '';
         this.errorMessage = '';
         alert("Utilisateur créé avec succès! Veuillez vous login.");
         this.$router.push("/login");
      } catch (error) {
         console.error('Erreur lors du signup :', error);
         if (axios.isAxiosError(error)) {
               if (error.response && error.response.data && error.response.data.message) {
                  this.errorMessage = error.response.data.message;
               } else {
                  this.errorMessage = 'Une erreur s\'est produite lors de la création du compte';
               }
         } else {
               this.errorMessage = 'Une erreur s\'est produite lors de la création du compte';
         }
      }
   },
  }
});
</script>

<style scoped>
</style>