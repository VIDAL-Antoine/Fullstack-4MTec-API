<template>
  <div class="type-appareils-container">
    <h1>Type Appareils</h1>
    <ul class="type-list">
      <li v-for="type in types" :key="type.id" class="type-item">
        <div>
          <strong>{{ type.nom }}</strong>
          <button @click="modifierType(type)" class="modifier-btn">Modifier</button>
          <button @click="supprimerType(type.id)" class="supprimer-btn">Supprimer</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      types: [],
    };
  },
  mounted() {
    this.fetchTypes();
  },
  methods: {
    async fetchTypes() {
      try {
        const response = await fetch('http://localhost:3000/type_appareils');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        this.types = data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async modifierType(type) {
      console.log('Modifier le type :', type);
    },
    async supprimerType(typeId) {
      try {
        const response = await fetch(`http://localhost:3000/type_appareils/${typeId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        this.fetchTypes();
        console.log('Type supprimé avec succès!');
      } catch (error) {
        console.error('Error deleting type:', error);
      }
    },
  },
};
</script>

<style scoped>
.type-appareils-container {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.type-list {
  list-style: none;
  padding: 0;
}

.type-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f8f8;
}

.type-item div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.strong {
  font-weight: bold;
}

.modifier-btn, .supprimer-btn {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.modifier-btn {
  margin-right: 8px;
}

.supprimer-btn {
  background-color: #dc3545;
}
</style>
