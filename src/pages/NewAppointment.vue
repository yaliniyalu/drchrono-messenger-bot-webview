<template>
    <div id="new-appointment">
        <q-card flat bordered>
            <q-card-section>
                <div class="q-gutter-md">
                    <q-select
                        outlined
                        stack-label
                        emit-value
                        v-model="doctor"
                        label="Doctor"
                        :options="mappedDoctors"
                        behavior="dialog"
                        map-options
                        option-label="name"
                        option-value="id"
                    >
                        <template v-slot:option="scope">
                            <q-item
                                v-bind="scope.itemProps"
                                v-on="scope.itemEvents"
                            >
                                <q-item-section avatar>
                                    <q-avatar>
                                        <img :src="scope.opt.avatar" :alt="scope.opt.name">
                                    </q-avatar>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label v-html="scope.opt.name" />
                                    <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>

                    <q-select
                        outlined
                        stack-label
                        emit-value
                        v-model="office"
                        label="Office"
                        :options="mappedOffices"
                        behavior="dialog"
                        map-options
                        option-label="name"
                        option-value="id"
                    >
                        <template v-slot:option="scope">
                            <q-item
                                v-bind="scope.itemProps"
                                v-on="scope.itemEvents"
                            >
                                <q-item-section>
                                    <q-item-label v-html="scope.opt.name" />
                                    <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </template>
                    </q-select>

                    <q-input
                        type="textarea"
                        outlined
                        stack-label
                        v-model="reason"
                        label="Reason"
                        autogrow
                    />

                    <q-card flat bordered class="relative-position">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6">Pick the date</div>
                        </q-card-section>

                        <q-separator/>

                        <q-card-section class="text-center">
                            <q-date
                                flat
                                minimal
                                v-model="date"
                                :options="dateLimitingFn"
                                :navigation-min-year-month="dateNavMin"
                                :navigation-max-year-month="dateNavMax"
                                mask="YYYY-MM-DD"
                            />
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="relative-position">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6">Pick the time</div>
                        </q-card-section>

                        <q-card-section v-if="!rooms">
                            <div class="text-grey text-center">No free slots available</div>
                        </q-card-section>

                        <q-card-section v-else>
                            <q-tabs v-model="tabRoom" class="text-primary">
                                <q-tab :label="r.name" :name="r.id" v-for="r in rooms" :key="r.id" />
                            </q-tabs>

                            <q-separator />

                            <q-tab-panels v-model="tabRoom" animated>
                                <q-tab-panel class="slot-container" :name="r.id" v-for="r in rooms" :key="r.id">
                                    <div class="slot" v-for="(slot, index) in r.slots" :key="index" @click="selectSlot(r, slot)">
                                        <div class="slot-content" :data-active="room === r.id && time === slot.from">
                                            {{ slot.from | humanize_time }}<br> - <br>{{ slot.to | humanize_time }}
                                        </div>
                                    </div>

                                    <div class="text-grey text-center" v-if="!r.slots.length">No slots available in this room</div>
                                </q-tab-panel>
                            </q-tab-panels>
                        </q-card-section>

                        <q-inner-loading :showing="loadingSlots">
                            <q-spinner-bars color="primary" size="2em" />
                        </q-inner-loading>
                    </q-card>
                </div>
            </q-card-section>
        </q-card>
    </div>
</template>

<script>
import http from "src/http";
import moment from "moment"
import context from "src/context";

export default {
    name: "NewAppointment",
    title() {
        return "New Appointment"
    },
    filters: {
        humanize_time(val) {
            return new Date('1970-01-01T' + val + 'Z')
                .toLocaleTimeString({},
                    {timeZone:'UTC',hour12:true,hour:'numeric',minute:'numeric'}
                );
        }
    },
    data() {
        return {
            doctors: [],
            offices: [],

            patient: null,
            duration: 30,
            doctor: null,
            office: null,
            room: null,
            reason: '',
            status: '',

            date: null,
            time: null,

            rooms: null,
            tabRoom: null,

            loading: 0,
            loadingSlots: false,

            disable: "disable"
        }
    },

    watch: {
        loading(val, prev) {
            if (val && !prev) {
                this.$q.loading.show();
            }
            else if (!val && prev) {
                this.$q.loading.hide();
            }
        },

        date() {
            this.loadFreeSlots();
            this.checkValidForm();
        },

        office() {
            this.loadFreeSlots();
            this.checkValidForm();
        },

        doctor() {
            this.checkValidForm();
        },

        time() {
            this.checkValidForm();
        },

        reason() {
            this.checkValidForm();
        },

        patient() {
            this.checkValidForm();
        }
    },

    computed: {
        mappedDoctors() {
            return this.doctors.map(v => {
                return {
                    id: v.id,
                    name: v.first_name + ' ' + v.last_name,
                    avatar: v.profile_picture,
                    description: v.job_title
                }
            })
        },

        mappedOffices() {
            return this.offices.map(v => {
                return {
                    id: v.id,
                    name: v.name,
                    description: v.city
                }
            })
        },

        dateNavMin() {
            return moment().format("YYYY/MM");
        },

        dateNavMax() {
            return moment().add(15, "days").format("YYYY/MM");
        },

    },

    methods: {
        getDoctors() {
            this.loading ++;
            http.get('/doctor')
                .then(response => {
                    this.doctors = response.data.data;
                })
                .finally(() => {
                    this.loading --;
                })
        },

        getOffices() {
            this.loading ++;
            http.get('/office')
                .then(response => {
                    this.offices = response.data.data;
                })
                .finally(() => {
                    this.loading --;
                })
        },

        getPatient() {
            this.patient = this.$route.query['patient'];
        },

        dateLimitingFn(date) {
            return moment(date).isBetween(moment(), moment().add(15, 'days'))
        },

        loadFreeSlots() {
            if (!(this.date && this.office)) {
                return;
            }

            this.loadingSlots = true;
            http.get(`/appointment/slots?office=${this.office}&date=${this.date}&duration=${this.duration}`)
                .then(response => {
                    this.rooms = response.data.data;

                    this.room = null;
                    this.time = null;

                    if (this.rooms.length) {
                        this.tabRoom = this.rooms[0]['id'];
                    } else {
                        this.rooms = null;
                        this.tabRoom = null;
                    }
                })
                .catch(() => {
                    this.tabRoom = null;
                    this.rooms = null;
                    this.room = null;
                    this.time = null;
                })
                .finally(() => {
                    this.loadingSlots = false;
                })
        },

        selectSlot(room, slot) {
            this.room = room.id;
            this.time = slot.from;
        },

        createAppointment() {
            this.loading = true;
            http.post('/appointment', {
                office: this.office,
                doctor: this.doctor,
                duration: this.duration,
                room: this.room,
                date: this.date + ' ' + this.time,
                reason: this.reason,
                patient: this.patient
            })
                .then(() => {
                    this.setButtonClose();

                    this.$q.dialog({
                        title: "Appointment",
                        message: 'Appointment Created Successfully'
                    }).onOk(() => {
                        MessengerExtensions.requestCloseBrowser(() => {}, () => {})
                    });
                })
                .catch(() => {
                    this.$q.dialog({
                        title: "Appointment",
                        message: 'Unable to create appointment'
                    });
                })
                .finally(() => {
                    this.loading = false;
                })
        },

        checkValidForm() {
            if (this.office && this.doctor && this.duration && this.room && this.date && this.time && this.reason && this.patient) {
                this.setButtonEnable();
            }
            else {
                this.setButtonDisable();
            }
        },

        setButtonDisable() {
            this.$root.$emit('global-button:config', { visible: true, label: 'Create', click: 'emit', disable: true });
        },

        setButtonEnable() {
            this.$root.$emit('global-button:config', { visible: true, label: 'Create', click: 'emit', payload: 'create', disable: false });
        },

        setButtonClose() {
            this.$root.$emit('global-button:config', { visible: true, label: 'close', click: 'close' });
        }
    },

    created() {
        this.getDoctors();
        this.getOffices();
        this.getPatient();

        this.setButtonDisable();

        this.$root.$on('global-button:click', (payload) => {
            if (payload === 'create') {
                this.createAppointment();
            }
        });
    }
}
</script>

<style lang="scss">
#new-appointment {
    .slot {
        text-align: center;
        cursor: pointer;
        line-height: 1em;
        font-size: 12px;
        margin: 3px;
        width: 62px;

        .slot-content {
            font-size: 10px;
            font-weight: bold;
            padding: 5px;
            border: 2px solid #979797;
            color: #979797;
            border-radius: 5px;

            &[data-active] {
                border-color: var(--q-color-primary);
                color: var(--q-color-primary);
            }
        }
    }

    .slot-container {
        display: flex;
        flex-flow: wrap;
        justify-content: space-evenly;
    }
}
</style>
