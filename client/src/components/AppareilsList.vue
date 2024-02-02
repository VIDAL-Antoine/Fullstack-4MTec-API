<template>
  <div class="app-container">
    <h1 class="app-title">Appareils</h1>

    <div class="filter-container">
      <div class="filter-group">
        <label for="typeNameFilter">Filtrer par nom de type : </label>
        <input v-model="typeNameFilter" type="text" id="typeNameFilter" class="filter-input" />
      </div>

      <div class="filter-group">
        <label for="modelNameFilter">Filtrer par nom de modèle : </label>
        <input v-model="modelNameFilter" type="text" id="modelNameFilter" class="filter-input" />
      </div>

      <div class="filter-group">
        <label for="macAddressFilter">Filtrer par adresse MAC : </label>
        <input v-model="macAddressFilter" type="text" id="macAddressFilter" class="filter-input" />
      </div>

      <div class="filter-group">
        <label for="etatFilter">Filtrer par état : </label>
        <input v-model="etatFilter" type="text" id="etatFilter" class="filter-input" />
      </div>
    </div>

    <ul class="appareils-list">
      <li v-for="appareil in filteredAppareils" :key="appareil.id_appareil" class="appareil-item">
        <div>
          <strong>ID:</strong> {{ appareil.id_appareil }}
        </div>
        <div>
          <strong>Modèle:</strong> {{ appareil.modele ? appareil.modele.nom : 'N/A' }}
        </div>
        <div>
          <strong>Type:</strong> {{ appareil.modele && appareil.modele.type ? appareil.modele.type.nom : 'N/A' }}
        </div>
        <div>
          <strong>MAC Address:</strong> {{ appareil.mac_address }}
        </div>
        <div>
          <strong>État:</strong> {{ appareil.etat }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

interface Appareil {
  id_appareil: number;
  mac_address: string;
  etat: string;
  modele: { nom: string; type: { nom: string } } | null;
}

export default defineComponent({
  data() {
    return {
      appareils: [] as Appareil[],
      modelNameFilter: '',
      typeNameFilter: '',
      macAddressFilter: '',
      etatFilter: '',
    };
  },
  computed: {
    filteredAppareils(): Appareil[] {
      let filtered = this.appareils;

      if (this.modelNameFilter) {
        filtered = filtered.filter((appareil) => {
          return (
            appareil.modele && appareil.modele.nom.toLowerCase().startsWith(this.modelNameFilter.toLowerCase())
          );
        });
      }

      if (this.typeNameFilter) {
        filtered = filtered.filter((appareil) => {
          return (
            appareil.modele && appareil.modele.type && appareil.modele.type.nom.toLowerCase().startsWith(this.typeNameFilter.toLowerCase())
          );
        });
      }

      if (this.macAddressFilter) {
        filtered = filtered.filter((appareil) => {
          return appareil.mac_address.toLowerCase().startsWith(this.macAddressFilter.toLowerCase());
        });
      }

      if (this.etatFilter) {
        filtered = filtered.filter((appareil) => {
          return appareil.etat.toLowerCase().startsWith(this.etatFilter.toLowerCase());
        });
      }

      return filtered;
    },
  },
  async mounted() {
    try {
      const response = await axios.get(`${API_BASE_URL}/appareils`);
      this.appareils = response.data;
    } catch (error) {
      console.error('Error fetching appareils:', error);
    }
  },
  methods: {
    async applyFilters() {
      try {
        const response = await axios.get(`${API_BASE_URL}/appareils`, {
          params: {
            modelName: this.modelNameFilter,
            typeName: this.typeNameFilter,
            macAddress: this.macAddressFilter,
            etat: this.etatFilter,
          },
        });

        this.appareils = response.data;
      } catch (error) {
        console.error('Error fetching filtered appareils:', error);
      }
    },
  },
});
</script>


<style scoped>
.app-container {
  max-width: 800px;
  margin: auto;
}
.app-title {
  margin: 20px 0;
  text-align: center;
}

.filter-container {
  display: flex;
  flex-direction: column;
}

.filter-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.filter-input {
  flex: 1;
  padding: 8px;
  margin-left: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.appareils-list {
  list-style: none;
  padding: 0;
}

.appareil-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
}

.appareil-item div {
  margin-bottom: 5px;
}
</style>
