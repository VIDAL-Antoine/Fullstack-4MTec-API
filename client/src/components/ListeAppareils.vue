<template>
  <div class="px-10 py-10">
    <v-data-table :headers="appareilsHeaders" :items="filtrerAppareils" class="elevation-5">
      <template v-slot:top>
        <v-toolbar flat class="py-5">
          <v-toolbar-title>Appareils</v-toolbar-title>
          <v-divider class="mx-3" inset vertical></v-divider>

          <v-text-field v-model="filtreNomModele" label="Modèle" append-icon="mdi-magnify" class="mx-4"></v-text-field>
          <v-text-field v-model="filtreNomType" label="Type" append-icon="mdi-magnify" class="mx-4"></v-text-field>
          <v-text-field v-model="filtreadresseMAC" label="Adresse MAC" append-icon="mdi-magnify"
            class="mx-4"></v-text-field>
          <v-select v-model="filtreEtat" label="Filtrer par État" :items="[{ text: 'tous', value: '' }, ...cycleEtats]"
            read-only class="mx-4"></v-select>
          <v-spacer></v-spacer>
          <v-dialog v-model="appareilDialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Nouvel Appareil</v-btn>
            </template>
            <v-card>
              <v-card-title><span class="text-h5">Nouvel Appareil</span></v-card-title>
              <v-card-text>
                <v-container>
                  <v-select v-model="idModeleSelectionne" :items="optionsNomModele" label="Nom de Modèle" class="m-2"></v-select>
                  <v-text-field v-model="adresseMAC" label="Adresse MAC" class="m-2"></v-text-field>
                  <v-select v-model="etatSelectionne" :items="cycleEtats"
                    label="État de l'appareil (optionnel, par défaut à stock)" class="m-2"></v-select>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="appareilDialog = false">Annuler</v-btn>
                <v-btn color="blue darken-1" text @click="ajouterAppareil">Sauvegarder</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="changerEtatAppareil(item)">mdi-power-plug</v-icon>
        <v-icon small @click="supprimerAppareil(item.idAppareil)">mdi-delete</v-icon>
      </template>
    </v-data-table>

    <br>

    <v-data-table :headers="connexionHeaders" :items="filtrerConnexions" :sort-by="['dateFin', 'dateDebut']"
      :sort-desc="[true, true]" class="elevation-5">
      <template v-slot:top>
        <v-toolbar flat class="py-5">
          <v-toolbar-title>Connexions</v-toolbar-title>
          <v-divider class="mx-3" inset vertical></v-divider>
          <v-text-field v-model="filtreIdEnfant" label="ID Appareil Enfant" append-icon="mdi-magnify" class="mx-4"></v-text-field>
          <v-text-field v-model="filtreMACEnfant" label="Adresse MAC Enfant" append-icon="mdi-magnify" class="mx-4"></v-text-field>
          <v-text-field v-model="filtreIdParent" label="ID Appareil Parent" append-icon="mdi-magnify" class="mx-4"></v-text-field>
          <v-text-field v-model="filtreMACParent" label="Adresse MAC Parent" append-icon="mdi-magnify" class="mx-4"></v-text-field>

          <v-spacer></v-spacer>
          <v-dialog v-model="connexionDialog" max-width="800px">
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on">Nouvelle connexion</v-btn>
            </template>
            <v-card>
              <v-card-title><span class="text-h5">Nouvelle Connexion</span></v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-select v-model="MACEnfantSelectionne" :items="adressesMACInstallees" label="Adresse MAC Enfant (qui va se connecter)" class="mx-4"></v-select>
                    </v-col>
                    <v-col>
                      <v-select v-model="MACParentSelectionne" :items="adressesMACInstallees" label="Adresse MAC Parent (qui reçoit la connexion)" class="mx-4"></v-select>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="connexionDialog = false">Annuler</v-btn>
                <v-btn color="blue darken-1" text @click="connecterAppareils">Connecter</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <v-divider class="mx-3" inset vertical></v-divider>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small @click="supprimerConnexion(item.idConnexion)">mdi-delete</v-icon>
      </template>
    </v-data-table>
  </div>
</template>
  
  
<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

interface Appareil {
  idAppareil: number;
  adresseMAC: string;
  etat: string;
  modele: { nomModele: string; type: { nomType: string } } | null;
}

interface Connexion {
  idConnexion: number;
  idAppareilParent: number;
  idAppareilEnfant: number;
  dateDebut: string;
  dateFin: string;
  appareilParent: { adresseMAC: string };
  appareilEnfant: { adresseMAC: string };
}

export default defineComponent({
  data() {
    return {
      appareils: [] as Appareil[],
      filtreNomModele: '',
      filtreNomType: '',
      filtreadresseMAC: '',
      filtreEtat: '',
      filtreIdParent: '',
      filtreIdEnfant: '',
      filtreMACParent: '',
      filtreMACEnfant: '',
      optionsNomModele: [] as { value: number, text: string; }[],
      idModeleSelectionne: 0,
      adresseMAC: '' as string,
      cycleEtats: ['stock', 'installé', 'maintenance'] as string[],
      etatSelectionne: null,
      connexions: [] as Connexion[],
      adressesMACInstallees: [] as { value: number, text: string; }[],
      MACParentSelectionne: null,
      MACEnfantSelectionne: null,
      appareilsHeaders: [
        { text: 'ID Appareil', value: 'idAppareil' },
        { text: 'Nom Modèle', value: 'modele.nomModele' },
        { text: 'Nom Type', value: 'modele.type.nomType' },
        { text: 'Adresse MAC', value: 'adresseMAC' },
        { text: 'État', value: 'etat' },
        { text: 'Actions', value: 'actions' },
      ],
      connexionHeaders: [
        { text: 'ID Connexion', value: 'idConnexion' },
        { text: 'ID Appareil Enfant', value: 'idAppareilEnfant' },
        { text: 'Adresse MAC Enfant', value: 'appareilEnfant.adresseMAC' },
        { text: 'ID Appareil Parent', value: 'idAppareilParent' },
        { text: 'Adresse MAC Parent', value: 'appareilParent.adresseMAC' },
        { text: 'Date de Début', value: 'dateDebut' },
        { text: 'Date de Fin', value: 'dateFin' },
        { text: 'Actions', value: 'actions' },
      ],
      appareilDialog: false,
      connexionDialog: false,
    };
  },
  computed: {
    filtrerAppareils(): Appareil[] {
      let filtre = this.appareils;

      if (this.filtreNomModele) {
        filtre = filtre.filter((appareil) => {
          return (
            appareil.modele && appareil.modele.nomModele.toLowerCase().startsWith(this.filtreNomModele.toLowerCase())
          );
        });
      }

      if (this.filtreNomType) {
        filtre = filtre.filter((appareil) => {
          return (
            appareil.modele && appareil.modele.type && appareil.modele.type.nomType.toLowerCase().startsWith(this.filtreNomType.toLowerCase())
          );
        });
      }

      if (this.filtreadresseMAC) {
        filtre = filtre.filter((appareil) => {
          return appareil.adresseMAC.toLowerCase().startsWith(this.filtreadresseMAC.toLowerCase());
        });
      }

      if (this.filtreEtat) {
        filtre = filtre.filter((appareil) => {
          return appareil.etat.toLowerCase().startsWith(this.filtreEtat.toLowerCase());
        });
      }

      return filtre;
    },

    filtrerConnexions(): Connexion[] {
      let filtre = this.connexions;

      if (this.filtreIdParent) {
        filtre = filtre.filter((connexion) => {
          return (
            connexion.idAppareilParent && connexion.idAppareilParent === Number(this.filtreIdParent)
          );
        });
      }

      if (this.filtreIdEnfant) {
        filtre = filtre.filter((connexion) => {
          return (
            connexion.idAppareilEnfant && connexion.idAppareilEnfant === Number(this.filtreIdEnfant)
          );
        });
      }

      if (this.filtreMACParent) {
        filtre = filtre.filter((connexion) => {
          return connexion.appareilParent.adresseMAC.toLowerCase().startsWith(this.filtreMACParent.toLowerCase());
        });
      }

      if (this.filtreMACEnfant) {
        filtre = filtre.filter((connexion) => {
          return connexion.appareilEnfant.adresseMAC.toLowerCase().startsWith(this.filtreMACEnfant.toLowerCase());
        });
      }

      return filtre;
    },
  },

  async mounted() {
    try {
      const appareilsResponse = await axios.get(`${API_BASE_URL}/appareils`);
      this.appareils = appareilsResponse.data;
      this.appareils.sort((a, b) => a.idAppareil - b.idAppareil);

      const connexionsResponse = await axios.get(`${API_BASE_URL}/connexions`);
      this.connexions = connexionsResponse.data;
      this.connexions.sort((a, b) => a.idConnexion - b.idConnexion);
      this.chargerOptionsNomModele();
      this.chargerAdressesMACInstallees();
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  },
  methods: {
    async chargerOptionsNomModele() {
      try {
        const response = await axios.get(`${API_BASE_URL}/modele-appareils`);
        this.optionsNomModele = response.data.map((modele: { idModele: number; nomModele: string }) => ({
          value: modele.idModele,
          text: modele.nomModele,
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des noms de modèle:', error);
      }
    },

    async chargerAdressesMACInstallees() {
      try {
        const response = await axios.get(`${API_BASE_URL}/appareils`);
        this.adressesMACInstallees = response.data
          .filter((appareil: { etat: string }) => appareil.etat === "installé")
          .map((appareil: { adresseMAC: string; idAppareil: number; }) => ({
            value: appareil.adresseMAC,
            text: appareil.adresseMAC,
            id: appareil.idAppareil,
          }));
        this.adressesMACInstallees = this.adressesMACInstallees.sort((a, b) => a.text.localeCompare(b.text));
      } catch (error) {
        console.error('Erreur lors du chargement des adresses MAC:', error);
      }
    },

    async ajouterAppareil() {
      try {
        const { idModeleSelectionne, adresseMAC, etatSelectionne } = this;

        if (!idModeleSelectionne) {
          alert("Vérifiez que vous avez sélectionné un modèle.");
          return;
        }

        if (!adresseMAC) {
          alert("Vérifiez que l'adresse MAC n'est pas vide.");
          return;
        }

        const appareilExistant = this.appareils.find(appareil => appareil.adresseMAC.toLowerCase() === adresseMAC.toLowerCase());
        if (appareilExistant) {
          alert("L'adresse MAC est déjà utilisée. Veuillez saisir une adresse MAC unique.");
          return;
        }

        const response = await axios.post(`${API_BASE_URL}/appareils`, {
          idModeleAppareil: idModeleSelectionne,
          adresseMAC: adresseMAC,
          etat: etatSelectionne === null ? "stock" : etatSelectionne,
        });

        const idAppareilAjoute = response.data.idAppareil;
        const responseAppareilAjoute = await axios.get(`${API_BASE_URL}/appareils/${idAppareilAjoute}`);

        const appareilAjoute = responseAppareilAjoute.data;
        this.appareils.push(appareilAjoute);
        this.appareils.sort((a, b) => a.idAppareil - b.idAppareil);
        this.chargerAdressesMACInstallees();

        this.idModeleSelectionne = 0;
        this.adresseMAC = '';
        this.etatSelectionne = null;
        alert("Appareil ajouté avec succès!");
        this.appareilDialog = false;
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'appareil:', error);
        alert("Une erreur s'est produite lors de la création de l'appareil. Veuillez réessayer en vérifiant notamment l'adresse MAC.");
      }
    },

    async changerEtatAppareil(appareil: Appareil) {
      const etatCourant = appareil.etat;
      const indexCourant = this.cycleEtats.indexOf(etatCourant);
      const etatSuivant = this.cycleEtats[(indexCourant + 1) % this.cycleEtats.length];

      try {
        appareil.etat = etatSuivant;

        if (etatCourant === 'installé' && etatSuivant !== 'installé') {
          await this.deconnecterAppareils(appareil.idAppareil, true); // Parent
          await this.deconnecterAppareils(appareil.idAppareil, false); // Enfant

          const response = await axios.get(`${API_BASE_URL}/connexions`);
          this.connexions = response.data;
        }

        await axios.put(`${API_BASE_URL}/appareils/${appareil.idAppareil}`, {
          etat: etatSuivant,
        });
        this.chargerAdressesMACInstallees();
      } catch (error) {
        console.error('Erreur lors du changement de l\'état de l\'appareil:', error);
      }
    },

    async supprimerAppareil(idAppareil: number) {
      try {
        await axios.delete(`${API_BASE_URL}/appareils/${idAppareil}`);
        this.appareils = this.appareils.filter(appareil => appareil.idAppareil !== idAppareil);
        this.appareils.sort((a, b) => a.idAppareil - b.idAppareil);
        alert("Appareil supprimé avec succès.")
        this.chargerOptionsNomModele();
        this.chargerAdressesMACInstallees();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'appareil:', error);
      }
    },

    async connecterAppareils() {
      const { MACParentSelectionne, MACEnfantSelectionne } = this;
      const now = new Date().toLocaleDateString().split("/");
      const formattedNowDate = now[2] + "-" + now[1].padStart(2, '0') + "-" + now[0].padStart(2, '0');
      const formattedEndDate = '9999-12-31';


      if (!MACEnfantSelectionne || !MACParentSelectionne) {
        alert("Vérifiez que l'adresse MAC du parent ou de l'enfant n'est pas vide.");
        return;
      }

      if (MACParentSelectionne === MACEnfantSelectionne) {
        alert("L'adresse MAC de l'enfant ne peut pas être la même que celle du parent.");
        return;
      }

      const appareilParent = this.appareils.find(appareil => appareil.adresseMAC === MACParentSelectionne);
      const appareilEnfant = this.appareils.find(appareil => appareil.adresseMAC === MACEnfantSelectionne);

      try {
        await axios.post(`${API_BASE_URL}/connexions`, {
          idAppareilParent: appareilParent?.idAppareil,
          idAppareilEnfant: appareilEnfant?.idAppareil,
          dateDebut: formattedNowDate,
          dateFin: formattedEndDate,
        });

        const response = await axios.get(`${API_BASE_URL}/connexions`);
        this.connexions = response.data;

        this.MACParentSelectionne = null;
        this.MACEnfantSelectionne = null;
        alert("Appareils connectés avec succès!");
        this.connexionDialog = false;
      } catch (error) {
        console.error('Erreur lors de la connexion des appareils:', error);
        alert("Une erreur s'est produite lors de la connexion des appareils. Veuillez réessayer en vérifiant que les dates ne se chevauchent pas pour l'appareil enfant.");
      }
    },

    getConnexionsParent(idAppareil: number) {
      const now = new Date().toLocaleDateString().split("/");
      const formattedNowDate = now[2] + "-" + now[1].padStart(2, '0') + "-" + now[0].padStart(2, '0');

      const parentConnexions = this.connexions.filter(connexion => {
        return (
          connexion.idAppareilParent === idAppareil &&
          (connexion.dateFin >= formattedNowDate) &&
          (connexion.dateDebut <= formattedNowDate)
        );
      });

      return parentConnexions;
    },

    getConnexionsEnfant(idAppareil: number) {
      const now = new Date().toLocaleDateString().split("/");
      const formattedNowDate = now[2] + "-" + now[1].padStart(2, '0') + "-" + now[0].padStart(2, '0');

      const parentConnexions = this.connexions.filter(connexion => {
        return (
          connexion.idAppareilEnfant === idAppareil &&
          (connexion.dateFin >= formattedNowDate) &&
          (connexion.dateDebut <= formattedNowDate)
        );
      });

      return parentConnexions;
    },

    async deconnecterAppareils(idAppareil: number, isParent: boolean) {
      const now = new Date().toLocaleDateString().split("/");
      const formattedNowDate = now[2] + "-" + now[1].padStart(2, '0') + "-" + now[0].padStart(2, '0');

      try {
        if (isParent) {
          const parentConnexions = this.getConnexionsParent(idAppareil);
          if (Object.keys(parentConnexions).length > 0) {
            for (const connexion of parentConnexions) {
              await axios.put(`${API_BASE_URL}/connexions/${connexion.idConnexion}`, {
                dateFin: formattedNowDate,
              });
            }
            alert(`Connexion(s) où l'appareil ${idAppareil} est parent déconnectée(s) avec succès !`);
          }
        } else {
          const childConnexions = this.getConnexionsEnfant(idAppareil);
          if(Object.keys(childConnexions).length > 0) {
            for (const connexion of childConnexions) {
              await axios.put(`${API_BASE_URL}/connexions/${connexion.idConnexion}`, {
                dateFin: formattedNowDate,
              });
            }
            alert(`Connexion(s) où l'appareil ${idAppareil} est enfant déconnectée(s) avec succès !`);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la déconnexion des appareils:', error);
        alert("Une erreur s'est produite lors de la déconnexion des appareils. Veuillez réessayer.");
      }
    },

    async supprimerConnexion(idConnexion: number) {
      try {
        await axios.delete(`${API_BASE_URL}/connexions/${idConnexion}`);
        this.connexions = this.connexions.filter(connexion => connexion.idConnexion !== idConnexion);
        alert("Connexion supprimée avec succès.");
      } catch (error) {
        console.error('Erreur lors de la suppression de la connexion:', error);
        alert("Une erreur s'est produite lors de la suppression de la connexion. Veuillez réessayer.");
      }
    },

  },
});
</script>

<style scoped>
</style>
