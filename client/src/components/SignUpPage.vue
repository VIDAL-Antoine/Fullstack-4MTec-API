<template>
   <v-container>
     <v-row>
       <v-col cols="12" sm="6" offset-sm="3">
         <v-text-field v-model="username" label="Username" required hide-details></v-text-field>
       </v-col>
     </v-row>
     <v-row>
       <v-col cols="12" sm="6" offset-sm="3">
         <v-text-field v-model="password" label="Password" hide-details required type="password"></v-text-field>
       </v-col>
     </v-row>
     <v-row>
       <v-col cols="12" sm="6" offset-sm="3">
         <v-btn type="submit" color="primary" block class="mt-2" @click="signup">Sign Up</v-btn>
       </v-col>
     </v-row>
     <v-row>
       <v-col cols="12" sm="6" offset-sm="3">
         <v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>
       </v-col>
     </v-row>
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
  mounted() {
    if (this.$route.path === '/signup' && localStorage.getItem('token')) {
      this.$router.push('/appareils');
    }
  },
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
              if (error.response && error.response.data && error.response.data.error) {
                  this.errorMessage = error.response.data.error;
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