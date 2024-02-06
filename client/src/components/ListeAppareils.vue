<template>
    <div class="m-3">
      <v-data-table :headers="appareilsHeaders" :items="filteredAppareils" class="elevation-5">
        <template v-slot:top>
          <v-toolbar flat class="py-5">
            <v-toolbar-title>Appareils</v-toolbar-title>
            <v-divider class="mx-3" inset vertical></v-divider>
  
            <v-text-field v-model="modelNameFilter" label="Modèle" append-icon="mdi-magnify" class="mx-4"></v-text-field>
            <v-text-field v-model="typeNameFilter" label="Type" append-icon="mdi-magnify" class="mx-4"></v-text-field>
            <v-text-field v-model="macAddressFilter" label="Adresse MAC" append-icon="mdi-magnify" class="mx-4"></v-text-field>
            <v-select v-model="etatFilter" label="Filtrer par État" :items="[ {text: 'tous', value: ''}, ...stateCycle ]" read-only class="mx-4"></v-select>
            <v-spacer></v-spacer>
            <v-dialog v-model="appareilDialog" max-width="500px">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Nouvel Appareil</v-btn>
              </template>
              <v-card>
                <v-card-title><span class="text-h5">Nouvel Appareil</span></v-card-title>
                <v-card-text>
                  <v-container>
                    <v-select v-model="selectedModelId" :items="modelOptions" label="Nom de Modèle" class="m-2"></v-select>
                    <v-text-field v-model="MacAddress" label="Adresse MAC" class="m-2"></v-text-field>
                    <v-select v-model="selectedState" :items="stateCycle" label="État de l'appareil (optionnel, par défaut à stock)" class="m-2"></v-select>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="appareilDialog = false">Annuler</v-btn>
                  <v-btn color="blue darken-1" text @click="addDevice">Sauvegarder</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="changeState(item)">mdi-power-plug</v-icon>
          <v-icon small @click="deleteAppareil(item.id_appareil)">mdi-delete</v-icon>
        </template>
      </v-data-table>

      <br>

      <!-- Le tri sur plusieurs colonnes (datefin + datedebut) ne semble pas marcher, à voir plus tard-->
      <!-- <v-data-table :headers="connexionHeaders" :items="filteredConnexions" :sort-by="['datefin', 'datedebut']" :sort-desc="[true, true]" class="elevation-5">  -->
      <v-data-table :headers="connexionHeaders" :items="filteredConnexions" :sort-by="['datefin']" :sort-desc="[true]" class="elevation-5">
        <template v-slot:top>
          <v-toolbar flat class="py-5">
            <v-toolbar-title>Connexions</v-toolbar-title>
            <v-text-field v-model="parentIDFilter" label="ID Appareil Parent" append-icon="mdi-magnify" class="mx-4"></v-text-field>
            <v-text-field v-model="childIDFilter" label="ID Appareil Enfant" append-icon="mdi-magnify" class="mx-4"></v-text-field>


            <v-spacer></v-spacer>
            <v-dialog v-model="connexionDialog">
              <template v-slot:activator="{ on }">
                <v-btn color="primary" dark class="mb-2" v-on="on">Nouvelle connexion</v-btn>
              </template>
              <v-card>
                <v-card-title><span class="text-h5">Nouvelle Connexion</span></v-card-title>
                <v-card-text>
                  <v-container>
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
                            <v-date-picker v-model="startDate" label="Date de début"></v-date-picker>
                        </v-col>
                        <v-col>
                            <v-date-picker v-model="endDate" label="Date de fin (optionnelle)"></v-date-picker>
                            <v-btn color="primary" @click="endDate = null" class="m-3">Réinitialiser la date de fin</v-btn>
                        </v-col>
                        </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="connexionDialog = false">Annuler</v-btn>
                  <v-btn color="blue darken-1" text @click="connectDevices">Connecter</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-divider class="mx-3" inset vertical></v-divider>
  
        </template>
      </v-data-table>
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
        parentIDFilter: '',
        childIDFilter: '',
        modelOptions: [] as { value: number, text: string; }[],
        selectedModelId: 0,
        MacAddress: '' as string,
        stateCycle: ['stock', 'installé', 'maintenance'] as string[],
        selectedState: null,
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
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        connexionHeaders: [
            { text: 'ID Connexion', value: 'id_connexion' },
            { text: 'ID Appareil Enfant', value: 'id_appareil_enfant' },
            { text: 'ID Appareil Parent', value: 'id_appareil_parent' },
            { text: 'Date de Début', value: 'datedebut' },
            { text: 'Date de Fin', value: 'datefin' },
        ],
        appareilDialog: false,
        connexionDialog: false,
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

    filteredConnexions(): Connexion[] {
      let filtered = this.connexions;

      if (this.parentIDFilter) {
        filtered = filtered.filter((connexion) => {
          return (
            connexion.id_appareil_parent && connexion.id_appareil_parent === Number(this.parentIDFilter)
            );
        });
      }

      if (this.childIDFilter) {
        filtered = filtered.filter((connexion) => {
          return (
            connexion.id_appareil_enfant && connexion.id_appareil_enfant === Number(this.childIDFilter)
            );
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
      this.connexions.sort((a, b) => a.id_connexion - b.id_connexion);
      this.loadModelOptions();
      this.loadMACAddresses();
    } catch (error) {
      console.error('Error fetching appareils:', error);
    }
  },
  methods: {
    async deleteAppareil(idAppareil: number) {
      try {
        await axios.delete(`${API_BASE_URL}/appareils/${idAppareil}`);
        this.appareils = this.appareils.filter(appareil => appareil.id_appareil !== idAppareil);
        this.appareils.sort((a, b) => a.id_appareil - b.id_appareil);
        alert("Appareil supprimé avec succès.")
        this.loadModelOptions();
        this.loadMACAddresses();
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
        this.connexions = response.data;

        this.selectedParentMAC = null;
        this.selectedChildMAC = null;
        this.startDate = null;
        this.endDate = null;
        alert("Appareils connectés avec succès!");
        this.connexionDialog = false;
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
          await this.disconnectDevices(appareil.id_appareil, true); // Parent
          await this.disconnectDevices(appareil.id_appareil, false); // Enfant

          const response = await axios.get(`${API_BASE_URL}/connexions`);
          this.connexions = response.data;
          alert("Connexions déconnectées avec succès !");
        }

        await axios.put(`${API_BASE_URL}/appareils/${appareil.id_appareil}`, {
          etat: nextState,
        });
        this.loadMACAddresses();
      } catch (error) {
        console.error('Error changing etat appareil:', error);
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
        alert("Appareil ajouté avec succès!");
        this.appareilDialog = false;
      } catch (error) {
        console.error('Error adding device:', error);
        alert("Une erreur s'est produite lors de la création de l'appareil. Veuillez réessayer.");
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

  },
});
</script>

<style scoped>
</style>
