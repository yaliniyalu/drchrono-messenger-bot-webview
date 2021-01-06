<template>
    <div id="lab_results">
        <q-card class="skeleton" flat bordered  v-if="loading">
            <q-card-section class="profile-container">
                <div class="profile-skeleton-container">
                    <q-skeleton type="text" class="skeleton-name" />
                    <q-skeleton type="text" width="50%" class="skeleton-subtitle" />
                </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-list bordered separator>
                    <q-item v-for="i in 6" :key="i">
                        <q-item-section avatar>
                            <q-skeleton type="QAvatar" height="30px" width="30px" />
                        </q-item-section>
                        <q-item-section><q-skeleton type="text" /></q-item-section>
                        <q-item-section side><q-skeleton type="text" width="50px" /></q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>

        <q-card flat bordered  v-if="lab">
            <q-card-section class="profile-container">
                <span class="name">{{ lab.title }}</span>
                <span class="subtitle">Dr. {{ lab.ordering_doctor.first_name }} {{ lab.ordering_doctor.last_name }}</span>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-list bordered separator>
                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="fas fa-chart-bar" />
                        </q-item-section>
                        <q-item-section>Result</q-item-section>
                        <q-item-section side>{{ lab.lab_result_value }}{{ lab.lab_result_value_units }}</q-item-section>
                    </q-item>

                    <q-item clickable>
                        <q-item-section avatar>
                            <q-icon name="fas fa-exclamation-triangle" />
                        </q-item-section>
                        <q-item-section>Abnormal Flag</q-item-section>
                        <q-item-section side>{{ lab.lab_abnormal_flag }}</q-item-section>
                    </q-item>

                    <q-item clickable>
                        <q-item-section avatar>
                            <q-icon name="fas fa-chart-line" />
                        </q-item-section>
                        <q-item-section>Normal Range</q-item-section>
                        <q-item-section side>{{ lab.lab_normal_range }}</q-item-section>
                    </q-item>

                    <q-item clickable>
                        <q-item-section avatar>
                            <q-icon name="fas fa-calendar-alt" />
                        </q-item-section>
                        <q-item-section>Date</q-item-section>
                        <q-item-section side>{{ lab.date_test_performed | humanize_date }}</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple :to="'/doctor/' + lab.ordering_doctor.id" active>
                        <q-item-section avatar>
                            <q-icon name="fas fa-user-md" />
                        </q-item-section>
                        <q-item-section>Doctor</q-item-section>
                        <q-item-section side>{{ lab.ordering_doctor.first_name }} {{ lab.ordering_doctor.last_name }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="fas fa-lightbulb" />
                        </q-item-section>
                        <q-item-section>Status</q-item-section>
                        <q-item-section side>
                            {{ lab.lab_order_status }}
                        </q-item-section>
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
    name: "ViewLabResult",
    filters: {
        humanize_date(date) {
            return moment(date).format('lll');
        }
    },
    data() {
        return {
            loading: false,
            lab: null
        }
    },

    title() {
        return 'Lab Result';
    },

    methods: {
        loadLabResult() {
            this.loading = true;
            http.get(`lab-result/${this.$route.params.id}`)
                .then(response => {
                    this.lab = response.data.data;
                })
                .catch(_ => {

                })
                .finally(_ => {
                    this.loading = false;
                })
        },

        getStatusColor(status) {
            let color = '';
            switch (status) {
                case 'Not Confirmed': color = 'red';    break;
                case 'Confirmed':     color = 'blue';   break;
                case 'Complete':      color = 'green';  break;
                case 'Rescheduled':   color = 'purple'; break;
                case 'Cancelled':     color = 'red-10'; break;
                case 'No Show':       color = 'pink';   break;
                case '':              color = 'teal';   break;
                default:              color = 'cyan';   break;
            }
            return color;
        }
    },

    mounted() {
        this.loadLabResult();
        this.$root.$emit('global-button:config', { visible: true, label: 'close', click: 'close' })
    }
}
</script>

<style lang="scss">
#lab_results {
    .profile-container {
        text-align: center;

        .name {
            display: block;
            font-size: 25px;
        }

        .subtitle {
            display: block;
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

            .skeleton-subtitle {
                margin: 0 auto;
            }
        }
    }
}
</style>
