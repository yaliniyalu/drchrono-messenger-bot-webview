<template>
    <div class="doctor">
        <q-card class="skeleton" flat bordered v-if="loading">

            <q-card-section class="profile-container">
                <div class="profile-skeleton-container">
                    <q-skeleton type="QAvatar" class="profile" />
                    <q-skeleton type="text" class="skeleton-name" />
                    <q-skeleton type="text" width="50%" class="skeleton-job" />
                </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-list bordered separator>
                    <q-item v-for="i in 5" :key="i">
                        <q-item-section avatar>
                            <q-skeleton type="QAvatar" height="30px" width="30px" />
                        </q-item-section>
                        <q-item-section><q-skeleton type="text" /></q-item-section>
                        <q-item-section side><q-skeleton type="text" width="50px" /></q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>

        <q-card flat bordered  v-if="doctor">
            <q-card-section class="profile-container">
                <q-img class="profile" :src="doctor.profile_picture" alt="profile image" height="40vw"/>
                <span class="name">{{ doctor.first_name }} {{ doctor.last_name }}</span>
                <span class="job_title">{{ doctor.job_title }}</span>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-list bordered separator>
                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="fas fa-user-md" />
                        </q-item-section>
                        <q-item-section>Speciality</q-item-section>
                        <q-item-section side>{{  doctor.specialty  }}</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple @click="openEmail(doctor.email)">
                        <q-item-section avatar>
                            <q-icon name="fas fa-envelope" />
                        </q-item-section>
                        <q-item-section>Email</q-item-section>
                        <q-item-section side>{{doctor.email }}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="fas fa-notes-medical" />
                        </q-item-section>
                        <q-item-section>NPI Number</q-item-section>
                        <q-item-section side>{{ doctor.npi_number }}</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple @click="openTel(doctor.office_phone)">
                        <q-item-section avatar>
                            <q-icon name="fas fa-phone" />
                        </q-item-section>
                        <q-item-section>Office</q-item-section>
                        <q-item-section side>{{ doctor.office_phone }}</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple @click="openTel(doctor.cell_phone)">
                        <q-item-section avatar>
                            <q-icon name="fas fa-mobile-alt" />
                        </q-item-section>
                        <q-item-section>Cell</q-item-section>
                        <q-item-section side>{{ doctor.cell_phone }}</q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
import http from "src/http";

export default {
    name: "ViewDoctor",
    props: {
        id: {
            type: [Number, String],
            required: false
        }
    },

    title() {
        return 'Doctor'
    },

    data() {
        return {
            doctor: null,
            loading: true
        }
    },

    methods: {
        loadDoctor() {
            this.loading = true;
            http.get(`doctor/${this.$route.params.id}`)
                .then(response => {
                    this.doctor = response.data.data;
                })
                .catch(_ => {

                })
                .finally(_ => {
                    this.loading = false;
                })
        },

        openEmail(email) {
            location.href = "mailto:" + email;
        },

        openTel(phone) {
            location.href = "tel:" + phone
        }
    },

    mounted() {
        this.loadDoctor();
        this.$root.$emit('global-button:config', { visible: true, label: 'close', click: 'close' })
    }
}
</script>

<style lang="scss">

.doctor {
    .profile-container {
        text-align: center;

        .profile {
            width: 40vw;
            max-width: 150px;
            max-height: 150px;
            border-radius: 50%;
        }

        .name {
            display: block;
            font-size: 25px;
        }

        .job_title {
            display: block;
        }
    }

    .skeleton {
        .profile-container {
            .profile {
                height: 40vw;
                max-height: 150px;
            }
        }

        .profile-skeleton-container {
            width: 40vw;
            max-width: 150px;
            margin: 0 auto;

            .skeleton-name {
                margin-top: 5px;
            }

            .skeleton-job {
                margin: 0 auto;
            }
        }
    }

    .margin-0-auto {
        margin: 0 auto;
    }
}

</style>
