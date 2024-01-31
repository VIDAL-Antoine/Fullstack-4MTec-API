<template>
  <div class="appareils-container">
    <h1>Appareils</h1>

    <ul class="models-list">
      <li v-for="model in models" :key="model.id" class="model-item">
        <div>
          <strong>{{ model.nom }}</strong>
          <span>Type: {{ model.nomType }}</span>
          <button @click="modifierModel(model)" class="modifier-btn">Modifier</button>
          <button @click="supprimerType(model.id)" class="supprimer-btn">Supprimer</button>
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
      models: [],
    };
  },
  mounted() {
    this.fetchTypes();
    this.fetchModels();
  },
  methods: {
    async fetchTypes() {
      try {
        const response = await fetch('http://localhost:3000/type_appareils');
        if (!response.ok) {
          throw new Error(`HTTP error Status: ${response.status}`);
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
          throw new Error(`HTTP error Status: ${response.status}`);
        }

        this.fetchTypes();
        console.log('Type deleted successfully !');
      } catch (error) {
        console.error('Error deleting type:', error);
      }
    },




    async fetchModels() {
      try {
        const response = await fetch('http://localhost:3000/modele_appareils');
        if (!response.ok) {
          throw new Error(`HTTP error Status: ${response.status}`);
        }

        const data = await response.json();
        
        this.models = data.map(model => {
          return {
            ...model,
            typeName: model.Type_appareil ? model.Type_appareil.nom : null,
          };
        });

        console.log('Fetched data:', this.models);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    async modifierModel(model) {
      console.log('Modifier le modèle :', model);
    },
    async supprimerModel(modelId) {
      try {
        const response = await fetch(`http://localhost:3000/modele_appareils/${modelId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error Status: ${response.status}`);
        }

        this.fetchModels();
        console.log('Model deleted successfully !');
      } catch (error) {
        console.error('Error deleting model:', error);
      }
    },
  },
};
</script>

<style scoped>
.appareils-container {
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.model-list {
  list-style: none;
  padding: 0;
}

.model-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f8f8f8;
}

.model-item div {
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
