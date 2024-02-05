<template>
  <div class="container">
    <h1 class="display-2 text-center my-4">Appareils</h1>

    <!-- Page ajouter un appareil -->
    <div>
      <v-btn @click="toggleAddDevice" color="primary" class="my-2">{{ isAddDeviceOpen ? 'Fermer' : 'Ajouter un appareil' }}</v-btn>

      <b-collapse v-model="isAddDeviceOpen">
        <div class="p-3 my-4 border rounded">
          <v-select v-model="selectedModelId" :items="modelOptions" :values="modelOptions" label="Nom de Modèle" class="mx-4"></v-select>
          <v-text-field v-model="MacAddress" label="Adresse MAC" class="mx-4"></v-text-field>
          <v-select v-model="selectedState" :items="stateCycle" label="État de l'appareil (optionnel, par défaut à stock)" class="mx-4"></v-select>
          <v-btn @click="addDevice" color="green" class="m-3">Ajouter</v-btn>
        </div>
      </b-collapse>
    </div>

    <!-- Page connecter des appareils -->
    <div>
      <v-btn @click="toggleConnectDevices" color="secondary" class="my-2">{{ isConnectDeviceOpen ? 'Fermer' : 'Connecter des appareils (installés)' }}</v-btn>

      <b-collapse v-model="isConnectDeviceOpen">
        <div class="p-3 my-3 border rounded">
          <v-row>
            <v-col>
                <v-select v-model="selectedChildMAC" :items="childMACAddresses" label="Adresse MAC Enfant (qui va se connecter)" class="mx-4"></v-select>
            </v-col>
            <v-col>
                <v-select v-model="selectedParentMAC" :items="parentMACAddresses" label="Adresse MAC Parent (qui reçoit la connexion)" class="mx-4"></v-select>
            </v-col>
            </v-row>
            <v-row>
              <v-col>
                <!-- <label for="start-date">Date de début :</label> -->
                <v-date-picker elevation="5" v-model="startDate" style="width: 300px;"></v-date-picker>
              </v-col>
            <v-col>
              <!-- <label for="end-date">Date de fin (optionnelle) :</label> -->
              <v-date-picker elevation="5" v-model="endDate" style="width: 300px;"></v-date-picker>
              <v-btn color="primary" @click="endDate = null" class="m-3">Réinitialiser la date de fin</v-btn>
            </v-col>
          </v-row>

          <v-btn @click="connectDevices" color="green" class="m-2">Connecter</v-btn>
        </div>
      </b-collapse>
    </div>

    <!-- Page Liste des appareils et connexions -->
    <div>
      <v-text-field v-model="modelNameFilter" label="Filtrer par nom de Modèle" @input="applyFilters" class="mx-4"></v-text-field>
      <v-text-field v-model="typeNameFilter" label="Filtrer nom de Type" @input="applyFilters" class="mx-4"></v-text-field>
      <v-text-field v-model="macAddressFilter" label="Filtrer par adressse MAC" @input="applyFilters" class="mx-4"></v-text-field>
      <v-select v-model="etatFilter" label="Filtrer par État" :items="[ {text: 'tous', value: ''}, ...stateCycle ]" @input="applyFilters" read-only class="mx-4"></v-select>

      <v-data-table :headers="appareilsHeaders" :items="filteredAppareils">
        <template #item="{ item }">
          <tr>
            <td>{{ item.id_appareil }}</td>
            <td>{{ item.modele ? item.modele.nomModele : 'N/A' }}</td>
            <td>{{ item.modele && item.modele.type ? item.modele.type.nomType : 'N/A' }}</td>
            <td>{{ item.mac_address }}</td>
            <td>{{ item.etat }}</td>
            <td>
              <v-btn @click="changeState(item)" color="blue" class="my-1">Changer état</v-btn>
            </td>
            <td>
              <v-btn @click="deleteAppareil(item.id_appareil)" color="red" class="my-1">Supprimer</v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </div>
  
    <v-data-table :headers="connexionHeaders" :items="connexions"></v-data-table>
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
  datefin: string;
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
      startDate: null as Date | null,
      endDate: null as Date | null,
      appareilsHeaders: [
        { text: 'ID Appareil', value: 'id_appareil' },
        { text: 'Nom Modèle', value: 'modele.nomModele' },
        { text: 'Nom Type', value: 'modele.type.nomType' },
        { text: 'Adresse MAC', value: 'mac_address' },
        { text: 'État', value: 'etat' },
        { text: 'Changer l\'état de l\'appareil' },
        { text: 'Supprimer l\'appareil' },
      ],
      connexionHeaders: [
        { text: 'ID Connexion', value: 'id_connexion' },
        { text: 'ID Appareil Enfant', value: 'id_appareil_enfant' },
        { text: 'ID Appareil Parent', value: 'id_appareil_parent' },
        { text: 'Date de Début', value: 'datedebut' },
        { text: 'Date de Fin', value: 'datefin' },
      ],
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
      this.connexions = connexionsResponse.data.map((connexion: Connexion) => ({
        ...connexion,
        datefin: connexion.datefin === '9999-12-31' ? '∞' : connexion.datefin,
      }));
      this.connexions.sort((a, b) => a.id_connexion - b.id_connexion);
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
        this.appareils.sort((a, b) => a.id_appareil - b.id_appareil);
      } catch (error) {
        console.error('Error fetching filtered appareils:', error);
      }
    },

    async deleteAppareil(idAppareil: number) {
      try {
        await axios.delete(`${API_BASE_URL}/appareils/${idAppareil}`);
        this.appareils = this.appareils.filter(appareil => appareil.id_appareil !== idAppareil);
        this.appareils.sort((a, b) => a.id_appareil - b.id_appareil);
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
        this.appareils.sort((a, b) => a.id_appareil - b.id_appareil);

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
      let formattedEndDate = endDate === null ? '9999-12-31' : endDate;

      if (!startDate) {
        alert("Veuillez entrer une date de début de connexion.");
        return;
      }

      if (!selectedChildMAC || !selectedParentMAC) {
        alert("Vérifiez que l'adresse MAC du parent ou de l'enfant n'est pas vide.");
        return;
      }

      if (selectedParentMAC === selectedChildMAC) {
        alert("L'adresse MAC de l'enfant ne peut pas être la même que celle du parent.");
        return;
      }

      if (startDate >= formattedEndDate) {
        alert("La date de début doit être antérieure à la date de fin.");
        return;
      }

      const parentAppareil = this.appareils.find(appareil => appareil.mac_address === selectedParentMAC);
      const childAppareil = this.appareils.find(appareil => appareil.mac_address === selectedChildMAC);

      try {
        await axios.post(`${API_BASE_URL}/connexions`, {
          id_appareil_parent: parentAppareil?.id_appareil,
          id_appareil_enfant: childAppareil?.id_appareil,
          datedebut: startDate,
          datefin: formattedEndDate,
        });

        const response = await axios.get(`${API_BASE_URL}/connexions`);
        this.connexions = response.data.map((connexion: Connexion) => ({
          ...connexion,
          datefin: connexion.datefin === '9999-12-31' ? '∞' : connexion.datefin,
        }));
        this.connexions.sort((a, b) => a.id_connexion - b.id_connexion);


        this.selectedParentMAC = null;
        this.selectedChildMAC = null;
        this.startDate = null;
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
      const now = new Date().toLocaleDateString().split("/");
      const formattednowDate = now[2] + "-" + now[1].padStart(2, '0') + "-" + now[0].padStart(2, '0');

      const parentConnexions = this.connexions.filter(connexion => {
        return (
          connexion.id_appareil_parent === appareilId &&
          (connexion.datefin >= formattednowDate) &&
          (connexion.datedebut <= formattednowDate)
        );
      });

      return parentConnexions;
    },

      getChildConnexions(appareilId: number) {
        const now = new Date().toLocaleDateString().split("/");
        const formattednowDate = now[2] + "-" + now[1].padStart(2, '0') + "-" + now[0].padStart(2, '0');

        const parentConnexions = this.connexions.filter(connexion => {
          return (
            connexion.id_appareil_enfant === appareilId &&
            (connexion.datefin >= formattednowDate) &&
            (connexion.datedebut <= formattednowDate)
          );
        });

        return parentConnexions;
      },

    async disconnectDevices(appareilId: number, isParent: boolean) {
      const now = new Date().toLocaleDateString().split("/");
      const formattedNowDate = now[2] + "-" + now[1].padStart(2, '0') + "-" + now[0].padStart(2, '0');

      try {
        if (isParent) {
          const parentConnexions = this.getParentConnexions(appareilId);
          for (const connexion of parentConnexions) {
            await axios.put(`${API_BASE_URL}/connexions/${connexion.id_connexion}`, {
              datefin: formattedNowDate,
            });
          }
        } else {
          const childConnexions = this.getChildConnexions(appareilId);
          for (const connexion of childConnexions) {
            await axios.put(`${API_BASE_URL}/connexions/${connexion.id_connexion}`, {
              datefin: formattedNowDate,
            });
          }
        }
      } catch (error) {
        console.error('Erreur lors de la déconnexion des appareils:', error);
        alert("Une erreur s'est produite lors de la déconnexion des appareils. Veuillez réessayer.");
      }
    },

    async changeState(appareil: Appareil) {
      const currentState = appareil.etat;
      const currentIndex = this.stateCycle.indexOf(currentState);
      const nextState = this.stateCycle[(currentIndex + 1) % this.stateCycle.length];

      try {
        appareil.etat = nextState;

        if (currentState === 'installé' && nextState !== 'installé') {
          await (this as any).disconnectDevices(appareil.id_appareil, true); // Parent
          await (this as any).disconnectDevices(appareil.id_appareil, false); // Enfant

          const response = await axios.get(`${API_BASE_URL}/connexions`);
          this.connexions = response.data.map((connexion: Connexion) => ({
            ...connexion,
            datefin: connexion.datefin === '9999-12-31' ? '∞' : connexion.datefin,
          }));
          this.connexions.sort((a, b) => a.id_connexion - b.id_connexion);
          alert("Connexions déconnectées avec succès !");
        }

        this.isConnectDeviceOpen = false;
        this.isAddDeviceOpen = false;
        await axios.put(`${API_BASE_URL}/appareils/${appareil.id_appareil}`, {
          etat: nextState,
        });
      } catch (error) {
        console.error('Error changing etat appareil:', error);
      }
    },
  },
});
</script>


<style scoped>
.container {
  max-width: 900px;
  margin: auto;
}

</style>
