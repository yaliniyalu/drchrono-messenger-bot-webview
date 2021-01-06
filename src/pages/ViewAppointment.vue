<template>
    <div id="appointment">
        <q-card class="skeleton" flat bordered  v-if="loading">
            <q-card-section>
                <q-list bordered separator>
                    <q-item v-for="i in 7" :key="i">
                        <q-item-section avatar>
                            <q-skeleton type="QAvatar" height="30px" width="30px" />
                        </q-item-section>
                        <q-item-section><q-skeleton type="text" /></q-item-section>
                        <q-item-section side><q-skeleton type="text" width="50px" /></q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>

        <q-card flat bordered  v-if="apt">
            <q-card-section>
                <q-list bordered separator>
                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="fas fa-calendar-alt" />
                        </q-item-section>
                        <q-item-section>Date/Time</q-item-section>
                        <q-item-section side>{{ apt.scheduled_time | humanize_date }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="fas fa-hourglass-half" />
                        </q-item-section>
                        <q-item-section>Duration</q-item-section>
                        <q-item-section side>{{ apt.duration }} Minutes</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple active :to="'/doctor/' + apt.doctor.id">
                        <q-item-section avatar>
                            <q-icon name="fas fa-user-md" />
                        </q-item-section>
                        <q-item-section>Doctor</q-item-section>
                        <q-item-section side>{{ apt.doctor.first_name + ' ' + apt.doctor.last_name }}</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple active :to="'/office/' + apt.office.id">
                        <q-item-section avatar>
                            <q-icon name="fas fa-hospital" />
                        </q-item-section>
                        <q-item-section>Office</q-item-section>
                        <q-item-section side>{{ apt.office.name }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="fas fa-procedures" />
                        </q-item-section>
                        <q-item-section>Exam Room</q-item-section>
                        <q-item-section side>{{ apt.exam_room }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="fas fa-stethoscope" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Reason</q-item-label>
                            <q-item-label caption>{{ apt.reason }}</q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="fas fa-lightbulb" />
                        </q-item-section>
                        <q-item-section>Status</q-item-section>
                        <q-item-section side v-if="apt.status">
                            <q-badge :color="getStatusColor(apt.status)">{{ apt.status }}</q-badge>
                        </q-item-section>
                    </q-item>

                </q-list>
            </q-card-section>
        </q-card>
    </div>

</template>

<script>
import http from "src/http";
import moment from "moment"

export default {
    name: "ViewAppointment",

    filters: {
        humanize_date(date) {
            return moment(date).format('lll');
        }
    },

    title() {
        return 'Appointment'
    },

    data() {
        return {
            loading: false,
            apt: null
        }
    },

    methods: {
        loadAppointment() {
            this.loading = true;
            http.get(`appointment/${this.$route.params.id}`)
                .then(response => {
                    this.apt = response.data.data;
                })
                .catch(_ => {
                    MessengerExtensions.requestCloseBrowser(() => {}, () => {})
                })
                .finally(_ => {
                    this.loading = false;
                })
        },

        timeTo12(timeString) {
            return new Date('1970-01-01T' + timeString + 'Z')
                .toLocaleTimeString({},
                    {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
                );
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
        this.loadAppointment();
        this.$root.$emit('global-button:config', { visible: true, label: 'close', click: 'close' });
    }
}
</script>

<style lang="scss">
#appointment {
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
