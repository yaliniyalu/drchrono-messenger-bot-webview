<template>
    <div id="office">
        <q-card class="skeleton" flat bordered  v-if="loading">
            <q-card-section class="profile-container">
                <div class="profile-skeleton-container">
                    <q-skeleton type="text" class="skeleton-name" />
                    <q-skeleton type="text" width="50%" class="skeleton-city" />
                </div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-list bordered separator>
                    <q-item v-for="i in 4" :key="i">
                        <q-item-section avatar>
                            <q-skeleton type="QAvatar" height="30px" width="30px" />
                        </q-item-section>
                        <q-item-section><q-skeleton type="text" /></q-item-section>
                        <q-item-section side><q-skeleton type="text" width="50px" /></q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>

        <q-card flat bordered  v-if="office">
            <q-card-section class="profile-container">
                <span class="name">{{ office.name }}</span>
                <span class="city">{{ office.city }}</span>
            </q-card-section>

            <q-card-section class="q-pt-none">
                <q-list bordered separator>
                    <q-item>
                        <q-item-section avatar>
                            <q-icon name="fas fa-clock" />
                        </q-item-section>
                        <q-item-section>Opening Time</q-item-section>
                        <q-item-section side>{{  office.start_time === office.end_time ? '24/7' : (timeTo12(office.start_time) + ' - ' + timeTo12(office.end_time)) }}</q-item-section>
                    </q-item>

                    <q-item clickable>
                        <q-item-section avatar>
                            <q-icon name="fas fa-map-marker-alt" />
                        </q-item-section>
                        <q-item-section>Address</q-item-section>
                        <q-item-section side v-html="getAddress(office)"></q-item-section>
                    </q-item>

                    <q-item clickable v-ripple active :to="'/doctor/' + office.doctor.id">
                        <q-item-section avatar>
                            <q-icon name="fas fa-user-md" />
                        </q-item-section>
                        <q-item-section>Primary Doctor</q-item-section>
                        <q-item-section side>{{ office.doctor.first_name + ' ' + office.doctor.last_name }}</q-item-section>
                    </q-item>

                    <q-item clickable v-ripple @click="openTel(office.phone_number)">
                        <q-item-section avatar>
                            <q-icon name="fas fa-phone" />
                        </q-item-section>
                        <q-item-section>Phone</q-item-section>
                        <q-item-section side>{{ office.phone_number }}</q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
import http from "src/http";
import {Loading} from "quasar";

export default {
  name: "ViewOffice",

    data() {
      return {
          loading: false,
          office: null
      }
    },

    title() {
      return 'Office';
    },

    methods: {
      loadOffice() {
          this.loading = true;
          http.get(`office/${this.$route.params.id}`)
              .then(response => {
                  this.office = response.data.data;
              })
              .catch(_ => {

              })
              .finally(_ => {
                  this.loading = false;
              })
      },

        openTel(phone) {
            location.href = "tel:" + phone
        },

        timeTo12(timeString) {
            return new Date('1970-01-01T' + timeString + 'Z')
                .toLocaleTimeString({},
                    {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
                );
        },

        getAddress(office) {
          let l = [];

          if (office.address) {
              l.push(office.address);
          }

          if (office.city) {
              l.push(office.city)
          }

          if (office.state) {
              l.push(office.state);
          }

          let address = l.join(', <br>');

          if (!address) {
              return '-';
          }

          if (office.zip_code) {
              address += '.<br>' + office.zip_code
          }
          return address;
        }
    },

    mounted() {
        this.loadOffice();
        this.$root.$emit('global-button:config', { visible: true, label: 'close', click: 'close' })
    }
}
</script>

<style lang="scss">
#office {
    .profile-container {
        text-align: center;

        .name {
            display: block;
            font-size: 25px;
        }

        .city {
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

            .skeleton-city {
                margin: 0 auto;
            }
        }
    }
}
</style>
