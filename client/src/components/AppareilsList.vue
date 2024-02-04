<template>
  <div class="container">
    <h1 class="display-2 text-center my-4">Appareils</h1>

    <div>
      <b-button @click="toggleAddDevice" variant="primary" class="my-2">{{ isAddDeviceOpen ? 'Fermer' : 'Ajouter un appareil' }}</b-button>

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
            <label for="newMacAddress" class="col-form-label">Adresse MAC de l'appareil (unique pour chaque appareil) :</label>
            <input type="text" id="newMacAddress" v-model="MacAddress" class="form-control">
          </div>

          <div class="d-flex align-items-center my-3">
            <div class="mr-3">
              <label for="stateDropdown" class="col-form-label">État de l'appareil (optionnel, par défaut à "stock") :</label>
            </div>

            <div class="flex-grow-1">
              <b-form-select v-model="selectedState" :options="stateCycle" id="stateDropdown" class="form-select"></b-form-select>
            </div>
          </div>

          <b-button @click="addDevice" variant="success">Ajouter</b-button>
        </div>
      </b-collapse>
    </div>

    <div>
      <b-button @click="toggleConnectDevices" variant="warning" class="my-2">Connecter des appareils (installés)</b-button>

      <b-collapse v-model="isConnectDeviceOpen">
        <div class="p-3 my-4 border rounded">
          <div class="container">
            <div class="row my-3">
              <div class="col">
                <label for="childMACDropdown">Adresse MAC Enfant (qui va se connecter):</label>
                <b-form-select v-model="selectedChildMAC" :options="childMACAddresses" id="childMACDropdown" class="form-select"></b-form-select>
              </div>
              <div class="col">
                <label for="parentMACDropdown">Adresse MAC Parent (qui reçoit la connexion):</label>
                <b-form-select v-model="selectedParentMAC" :options="parentMACAddresses" id="parentMACDropdown" class="form-select"></b-form-select>
              </div>
            </div>
            <div class="row my-3">
              <div class="col">
                <label for="startDatePicker">Date de début:</label>
                <b-form-datepicker v-model="startDate" id="startDatePicker" class="mb-2" value-as-date></b-form-datepicker>
              </div>
              <div class="col">
                <label for="endDatePicker">Date de fin (optionnelle):</label>
                <b-form-datepicker v-model="endDate" id="endDatePicker" class="mb-2" reset-button value-as-date></b-form-datepicker>
              </div>
            </div>
          </div>

          <b-button @click="connectDevices" variant="success">Connecter</b-button>
        </div>
      </b-collapse>
    </div>

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
        <div class="row border rounded px-1 py-3 my-3 mx-0">
          <div class="col-md-6">
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
              <strong>Adresse MAC:</strong> {{ appareil.mac_address }}
            </div>
            <div>
              <strong>État:</strong> {{ appareil.etat }}
            </div>

            <div class="mt-3">
              <strong>Est connecté à :</strong>
              <ul>
                <li v-for="connexion in getParentConnexions(appareil.id_appareil)" :key="connexion.id_connexion">
                  Appareil {{ connexion.id_appareil_enfant }} → Appareil {{ connexion.id_appareil_parent }} ({{ connexion.datedebut }} → {{ connexion.datefin === '9999-12-31' ? '∞' : connexion.datefin }})
                </li>
              </ul>
            </div>
          </div>

          <div class="col-md-6">
            <div class="d-flex flex-column">
              <b-button @click="changeState(appareil)" variant="secondary" class="my-1 ml-auto">Changer état</b-button>
              <b-button @click="deleteAppareil(appareil.id_appareil)" variant="danger" class="my-1 ml-auto">Supprimer</b-button>
              <div class="mt-10">
                <strong>Se connecte à (unique sur une période de temps !) :</strong>
                <ul>
                    <li v-for="connexion in getChildConnexion(appareil.id_appareil)" :key="connexion.id_connexion">
                      Appareil {{ connexion.id_appareil_enfant }} → Appareil {{ connexion.id_appareil_parent }} ({{ connexion.datedebut }} → {{ connexion.datefin === '9999-12-31' ? '∞' : connexion.datefin }})
                    </li>
                </ul>
              </div>
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

interface Connexion {
  id_connexion: number;
  id_appareil_parent: number;
  id_appareil_enfant: number;
  datedebut: string;
  datefin?: string | null;
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
      MacAddress: '' as string,
      stateCycle: ['stock', 'installé', 'maintenance'] as string[],
      selectedState: null,
      isConnectDeviceOpen: false,
      connexions: [] as Connexion[],
      parentMACAddresses: [] as { value: number, text: string; }[],
      childMACAddresses: [] as { value: number, text: string; }[],
      selectedParentMAC: null,
      selectedChildMAC: null,
      startDate: new Date(),
      endDate: null as Date | null,
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
      const appareilsResponse = await axios.get(`${API_BASE_URL}/appareils`);
      this.appareils = appareilsResponse.data;
      this.appareils.sort((a, b) => a.id_appareil - b.id_appareil);

      const connexionsResponse = await axios.get(`${API_BASE_URL}/connexions`);
      this.connexions = connexionsResponse.data;
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
        this.isConnectDeviceOpen = false;
        this.isAddDeviceOpen = false;
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
        this.isConnectDeviceOpen = false;
        this.isAddDeviceOpen = false;
        alert("Appareil supprimé avec succès.")
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

        if (!selectedModelId) {
          alert("Vérifiez que vous avez sélectionné un modèle.");
          return;
        }

        if (!MacAddress) {
          alert("Vérifiez que l'adresse MAC n'est pas vide.");
          return;
        }

        const existingDevice = this.appareils.find(appareil => appareil.mac_address.toLowerCase() === MacAddress.toLowerCase());
        if (existingDevice) {
          alert("L'adresse MAC est déjà utilisée. Veuillez saisir une adresse MAC unique.");
          return;
        }

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
        this.MacAddress = '';
        this.selectedState = null;
        this.isConnectDeviceOpen = false;
        this.isAddDeviceOpen = false;
        alert("Appareil ajouté avec succès!");
      } catch (error) {
        console.error('Error adding device:', error);
        alert("Une erreur s'est produite lors de la création de l'appareil. Veuillez réessayer.");
      }
    },


    async toggleConnectDevices() {
      this.isConnectDeviceOpen = !this.isConnectDeviceOpen;
      if (this.isConnectDeviceOpen) {
        await this.loadMACAddresses();
      }
    },

    async loadMACAddresses() {
      try {
        const response = await axios.get(`${API_BASE_URL}/appareils`);
        const installedMACAddresses = response.data
          .filter((appareil: { etat: string }) => appareil.etat === "installé")
          .map((appareil: { mac_address: string; id_appareil: number; }) => ({
            value: appareil.mac_address,
            text: appareil.mac_address,
            id: appareil.id_appareil,
          }));
        this.parentMACAddresses = [...installedMACAddresses];
        this.childMACAddresses = [...installedMACAddresses];
      } catch (error) {
        console.error('Error loading MAC addresses:', error);
      }
    },

    async connectDevices() {
      const { selectedParentMAC, selectedChildMAC, startDate, endDate } = this;
      let formattedStartDate = null;
      let formattedEndDate = endDate === null ? '9999-12-31' : endDate;

      if (startDate) {
        const componentsStartDate = startDate?.toLocaleDateString().split("/");
        formattedStartDate = componentsStartDate[2] + "-" + componentsStartDate[1].padStart(2, '0') + "-" + componentsStartDate[0].padStart(2, '0');
      }

      if (endDate) {
        const componentsEndDate = endDate?.toLocaleDateString().split("/");
        formattedEndDate = componentsEndDate[2] + "-" + componentsEndDate[1].padStart(2, '0') + "-" + componentsEndDate[0].padStart(2, '0');
      }

      if (!selectedChildMAC || !selectedParentMAC) {
        alert("Vérifiez que l'adresse MAC du parent ou de l'enfant n'est pas vide.");
        return;
      }

      if (selectedParentMAC === selectedChildMAC) {
        alert("L'adresse MAC de l'enfant ne peut pas être la même que celle du parent.");
        return;
      }

      if (formattedStartDate && formattedEndDate && (formattedStartDate >= formattedEndDate)) {
        alert("La date de début doit être antérieure à la date de fin.");
        return;
      }

      const parentAppareil = this.appareils.find(appareil => appareil.mac_address === selectedParentMAC);
      const childAppareil = this.appareils.find(appareil => appareil.mac_address === selectedChildMAC);

      try {
        await axios.post(`${API_BASE_URL}/connexions`, {
          id_appareil_parent: parentAppareil?.id_appareil,
          id_appareil_enfant: childAppareil?.id_appareil,
          datedebut: formattedStartDate,
          datefin: formattedEndDate,
        });

        const response = await axios.get(`${API_BASE_URL}/connexions`);
        this.connexions = response.data;

        this.selectedParentMAC = null;
        this.selectedChildMAC = null;
        this.startDate = new Date();
        this.endDate = null;
        this.isConnectDeviceOpen = false;
        this.isAddDeviceOpen = false;
        alert("Appareils connectés avec succès!");
      } catch (error) {
        console.error('Erreur lors de la connexion des appareils:', error);
        alert("Une erreur s'est produite lors de la connexion des appareils. Veuillez réessayer en vérifiant que les dates ne se chevauchent pas pour l'appareil enfant.");
      }
    },

    getParentConnexions(appareilId: number) {
      return this.connexions.filter(connexion => connexion.id_appareil_parent === appareilId);
    },

    getChildConnexion(appareilId: number) {
      return this.connexions.filter(connexion => connexion.id_appareil_enfant === appareilId);
    },

  },
});
</script>


<style scoped>
.container {
  max-width: 900px;
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
