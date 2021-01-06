<template>
    <div id="medication">
        <q-card class="skeleton" flat bordered  v-if="loading">
            <q-card-section class="profile-container">
                <div class="profile-skeleton-container">
                    <q-skeleton type="text" class="skeleton-name" />
                </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-list bordered separator>
                    <q-item v-for="i in 8" :key="i">
                        <q-item-section><q-skeleton type="text" /></q-item-section>
                        <q-item-section side><q-skeleton type="text" width="50px" /></q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>

        <q-card flat bordered  v-if="medic">
            <q-card-section class="profile-container">
                <span class="name">{{ medic.name }}</span>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-list bordered separator>
                    <q-item>
                        <q-item-section>Indication</q-item-section>
                        <q-item-section side>{{ medic.indication }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section>Prescribed On</q-item-section>
                        <q-item-section side>{{ medic.date_prescribed | humanize_date }}</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple :to="'/doctor/' + medic.doctor.id" active>
                        <q-item-section>Prescribed By</q-item-section>
                        <q-item-section side>Dr. {{ medic.doctor.first_name + ' ' + medic.doctor.last_name }}</q-item-section>
                    </q-item>

                    <q-item clickable>
                        <q-item-section>Started Taking On</q-item-section>
                        <q-item-section side>{{ medic.date_started_taking | humanize_date }}</q-item-section>
                    </q-item>

                    <q-item clickable>
                        <q-item-section>Stopped Taking On</q-item-section>
                        <q-item-section side>{{ medic.date_stopped_taking | humanize_date }}</q-item-section>
                    </q-item>

                    <q-item clickable>
                        <q-item-section>Dispense Quantity</q-item-section>
                        <q-item-section side>{{ medic.dispense_quantity }}</q-item-section>
                    </q-item>

                    <q-item clickable>
                        <q-item-section>Dosage Quantity</q-item-section>
                        <q-item-section side>{{ medic.dosage_quantity }} {{ medic.dosage_units }}</q-item-section>
                    </q-item>

                    <q-item clickable>
                        <q-item-section>Frequency</q-item-section>
                        <q-item-section side>{{ medic.frequency }}</q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
import http from "src/http";
import moment from "moment";

export default {
    name: "ViewMedication",
    filters: {
        humanize_date(date) {
            if (!date) return '';
            return moment(date).format('lll');
        }
    },
    data() {
        return {
            loading: false,
            medic: null
        }
    },

    title() {
        return 'Medication';
    },

    methods: {
        loadMedication() {
            this.loading = true;
            http.get(`medication/${this.$route.params.id}`)
                .then(response => {
                    this.medic = response.data.data;
                })
                .catch(_ => {

                })
                .finally(_ => {
                    this.loading = false;
                })
        },
    },

    mounted() {
        this.loadMedication();
        this.$root.$emit('global-button:config', { visible: true, label: 'close', click: 'close' })
    }
}
</script>

<style lang="scss">
#medication {
    .profile-container {
        text-align: center;

        .name {
            display: block;
            font-size: 25px;
        }
    }

    .skeleton {
        .profile-skeleton-container {
            width: 40vw;
            max-width: 150px;
            margin: 0 auto;

            .skeleton-name {
                margin-top: 5px;
            }

            .skeleton-city {
                margin: 0 auto;
            }
        }
    }
}
</style>
