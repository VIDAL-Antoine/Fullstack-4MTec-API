<template>
  <div class="container">
    <h1 class="display-2 text-center my-4">Appareils</h1>

    <b-button @click="toggleAddDevice" variant="primary" class="mb-3">{{ isAddDeviceOpen ? 'Fermer' : 'Ajouter un appareil' }}</b-button>

    <b-collapse v-model="isAddDeviceOpen">
      <div class="p-3 my-4 border rounded">
        <div class="d-flex align-items-center my-3">
          <div class="mr-3">
            <label for="modelDropdown" class="col-form-label">Modèle d'appareil :</label>
          </div>

          <div class="flex-grow-1">
            <b-form-select v-model="selectedModelId" :options="modelOptions" :values="modelOptions" id="modelDropdown" class="form-select"></b-form-select>
          </div>
        </div>

        <div class="d-flex align-items-center my-3">
          <label for="newMacAddress" class="col-form-label">Adresse MAC de l'appareil :</label>
          <input type="text" id="newMacAddress" v-model="MacAddress" class="form-control">
        </div>

        <div class="d-flex align-items-center my-3">
          <div class="mr-3">
            <label for="stateDropdown" class="col-form-label">État de l'appareil :</label>
          </div>

          <div class="flex-grow-1">
            <b-form-select v-model="selectedState" :options="stateCycle" id="stateDropdown" class="form-select"></b-form-select>
          </div>
        </div>

        <b-button @click="addDevice" variant="success">Ajouter</b-button>
      </div>
    </b-collapse>

    <div class="d-flex flex-column">
      <div class="d-flex align-items-center my-2">
        <label for="typeNameFilter">Filtrer par nom de type : </label>
        <input v-model="typeNameFilter" type="text" id="typeNameFilter" class="form-control" />
      </div>

      <div class="d-flex align-items-center my-2">
        <label for="modelNameFilter">Filtrer par nom de modèle : </label>
        <input v-model="modelNameFilter" type="text" id="modelNameFilter" class="form-control" />
      </div>

      <div class="d-flex align-items-center my-2">
        <label for="macAddressFilter">Filtrer par adresse MAC : </label>
        <input v-model="macAddressFilter" type="text" id="macAddressFilter" class="form-control" />
      </div>

      <div class="d-flex align-items-center my-2">
        <label for="etatFilter">Filtrer par état : </label>
        <input v-model="etatFilter" type="text" id="etatFilter" class="form-control" />
      </div>
    </div>

    <ul class="appareils-list my-5">
      <li v-for="appareil in filteredAppareils" :key="appareil.id_appareil" class="appareils-list">
        <div class="row border rounded p-3 my-3 mx-0">
          <div class="col-md">
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

          <div class="col-md">
            <div class="d-flex flex-column">
              <b-button @click="changeState(appareil)" variant="secondary" class="my-1 col-6 ml-auto">Changer état</b-button>
              <b-button v-if="appareil.etat === 'installé'" variant="info" class="my-1 col-6 ml-auto">Connecter</b-button>
              <b-button @click="deleteAppareil(appareil.id_appareil)" variant="danger" class="my-1 col-6 ml-auto">Supprimer</b-button>
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
          etat: selectedState === null ? "stock" : selectedState,
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
.container {
  max-width: 800px;
  margin: auto;
}

ul.appareils-list {
  list-style: none;
  padding: 0;
}

li.appareils-list {
  margin: 0;
}

</style>
