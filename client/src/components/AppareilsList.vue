<template>
  <div class="app-container">
    <h1 class="app-title">Appareils</h1>

    <b-button @click="toggleAddDevice" variant="primary" class="mb-3">{{ isAddDeviceOpen ? 'Fermer' : 'Ajouter un appareil' }}</b-button>

    <b-collapse v-model="isAddDeviceOpen">
      <div class="add-device-form">
        <div>
          <label for="modelDropdown">Modèle d'appareil : </label>
          <b-form-select v-model="selectedModelId" :options="modelOptions" :values="modelOptions" id="modelDropdown" class="mb-2 ml-2"></b-form-select>
        </div>

        <div class="input-text-group">
          <label for="newMacAddress">Adresse MAC de l'appareil : </label>
          <input type="text" id="newMacAddress" v-model="MacAddress" class="form-control input-text-field">
        </div>

        <div>
          <label for="stateDropdown">État de l'appareil : </label>
          <b-form-select v-model="selectedState" :options="stateCycle" id="stateDropdown" class="mb-2 ml-2"></b-form-select>
        </div>

        <b-button @click="addDevice" variant="success">Ajouter</b-button>
      </div>
    </b-collapse>

    <div class="filter-container">
      <div class="input-text-group">
        <label for="typeNameFilter">Filtrer par nom de type : </label>
        <input v-model="typeNameFilter" type="text" id="typeNameFilter" class="input-text-field" />
      </div>

      <div class="input-text-group">
        <label for="modelNameFilter">Filtrer par nom de modèle : </label>
        <input v-model="modelNameFilter" type="text" id="modelNameFilter" class="input-text-field" />
      </div>

      <div class="input-text-group">
        <label for="macAddressFilter">Filtrer par adresse MAC : </label>
        <input v-model="macAddressFilter" type="text" id="macAddressFilter" class="input-text-field" />
      </div>

      <div class="input-text-group">
        <label for="etatFilter">Filtrer par état : </label>
        <input v-model="etatFilter" type="text" id="etatFilter" class="input-text-field" />
      </div>
    </div>

    <ul class="appareils-list">
      <li v-for="appareil in filteredAppareils" :key="appareil.id_appareil" class="appareil-item">
        <div class="grid-container">
          <div class="details-column">
            <div>
              <strong>ID:</strong> {{ appareil.id_appareil }}
            </div>
            <div>
              <strong>Modèle:</strong> {{ appareil.modele ? appareil.modele.nomModele : 'N/A' }}
            </div>
            <div>
              <strong>Type:</strong> {{ appareil.modele && appareil.modele.type ? appareil.modele.type.nomType : 'N/A' }}
            </div>
            <div>
              <strong>MAC Address:</strong> {{ appareil.mac_address }}
            </div>
            <div>
              <strong>État:</strong> {{ appareil.etat }}
            </div>
          </div>

          <div class="button-column">
            <div class="d-flex flex-column">
              <b-button @click="changeState(appareil)" variant="secondary" class="mb-3">Changer état</b-button>
              <b-button v-if="appareil.etat === 'installé'" variant="info">Connecter</b-button>
              <b-button @click="deleteAppareil(appareil.id_appareil)" variant="danger" class="mt-3">Supprimer</b-button>
          </div>
          </div>
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
  modele: { nomModele: string; type: { nomType: string } } | null;
}

export default defineComponent({
  data() {
    return {
      appareils: [] as Appareil[],
      modelNameFilter: '',
      typeNameFilter: '',
      macAddressFilter: '',
      etatFilter: '',
      isAddDeviceOpen: false,
      modelOptions: [] as { value: number, text: string; }[],
      selectedModelId: 0,
      MacAddress: null,
      stateCycle: ['stock', 'installé', 'maintenance'] as string[],
      selectedState: null,
    };
  },
  computed: {
    filteredAppareils(): Appareil[] {
      let filtered = this.appareils;

      if (this.modelNameFilter) {
        filtered = filtered.filter((appareil) => {
          return (
            appareil.modele && appareil.modele.nomModele.toLowerCase().startsWith(this.modelNameFilter.toLowerCase())
          );
        });
      }

      if (this.typeNameFilter) {
        filtered = filtered.filter((appareil) => {
          return (
            appareil.modele && appareil.modele.type && appareil.modele.type.nomType.toLowerCase().startsWith(this.typeNameFilter.toLowerCase())
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
      this.appareils.sort((a, b) => a.id_appareil - b.id_appareil);
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

    async changeState(appareil: Appareil) {
      const currentState = appareil.etat;
      const currentIndex = this.stateCycle.indexOf(currentState);
      const nextState = this.stateCycle[(currentIndex + 1) % this.stateCycle.length];

      try {
        appareil.etat = nextState;
        await axios.put(`${API_BASE_URL}/appareils/${appareil.id_appareil}`, {
          etat: nextState,
        });
      } catch (error) {
        console.error('Error changing etat appareil:', error);
      }
    },

    async deleteAppareil(idAppareil: number) {
      try {
        await axios.delete(`${API_BASE_URL}/appareils/${idAppareil}`);
        this.appareils = this.appareils.filter(appareil => appareil.id_appareil !== idAppareil);
        console.log('Appareil deleted successfully');
      } catch (error) {
        console.error('Error deleting appareil:', error);
      }
    },
  
    async loadModelOptions() {
      try {
        const response = await axios.get(`${API_BASE_URL}/modele_appareils`);
        this.modelOptions = response.data.map((modele: { id: number; nomModele: string }) => ({
          value: modele.id,
          text: modele.nomModele,
        }));
      } catch (error) {
        console.error('Error loading model options:', error);
      }
    },

    toggleAddDevice() {
      this.isAddDeviceOpen = !this.isAddDeviceOpen;
      if (this.isAddDeviceOpen) {
        this.loadModelOptions();
      }
    },

    async addDevice() {
      try {
        const { selectedModelId, MacAddress, selectedState } = this;
        const response = await axios.post(`${API_BASE_URL}/appareils`, {
          id_modele: selectedModelId,
          mac_address: MacAddress,
          etat: selectedState,
        });

        const addedDeviceId = response.data.id_appareil;
        const addedDeviceResponse = await axios.get(`${API_BASE_URL}/appareils/${addedDeviceId}`);

        const updatedAppareil = addedDeviceResponse.data;
        this.appareils.push(updatedAppareil);


        this.selectedModelId = 0;
        this.MacAddress = null;
        this.selectedState = null;
        this.isAddDeviceOpen = false;
      } catch (error) {
        console.error('Error adding device:', error);
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

.input-text-group {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.input-text-field {
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
  display: grid;
  grid-template-columns: 1fr 150px;
}

.appareil-item div {
  margin-bottom: 5px;
}

.grid-container {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 150px;
}

.details-column {
  grid-column: 1;
}

.button-column {
  grid-column: 2;
}

.add-device-form {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-top: 10px;
  margin-bottom: 50px;
}

.dropdown-input {
  flex: 1;
  padding: 8px;
  margin-left: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

</style>
