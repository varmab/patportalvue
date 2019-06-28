<template>
  <div>
    <div class="q-px-md q-py-sm q-gutter-sm">
      <q-btn color="primary" class="block" icon="keyboard_backspace" label="Back" no-caps @click="$router.push(`${path}`)"/>
    </div>
    <div class="q-pa-md">
      <q-card class="my-card">
        <q-card-section>
          <div class="q-table__title">Schedule Appointment</div>
        </q-card-section>
        <q-card-section>
          <div class="q-pa-md">
            <div class="row">
              <div class="margin-auto">
                <div class="q-pa-xs" style="max-width: 400px">
                  <q-form
                    @submit="onSubmit"
                    @reset="onReset"
                    class="q-gutter-md"
                  >
                    <q-input
                      v-model="date"
                      mask="date"
                      :rules="[ val => val && val.length > 0 || 'Please select the date' ]"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="date" @input="() => $refs.qDateProxy.hide()" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                    <div class="col-12">
                      <q-btn-dropdown class="btn-full-width" :label="DctName" no-caps>
                        <q-list v-for="doctor in allDoctors" :key="doctor.DctId">
                          <q-item clickable v-close-popup @click="selectDoctor(doctor)">
                            <q-item-section>
                              <q-item-label>{{doctor.DctName}}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                      <div class="customErr" v-if="doctorErr">Please select Doctor</div>
                    </div>
                    <div class="col-12">
                      <q-btn-dropdown class="btn-full-width" :label="FclDesc" no-caps>
                        <q-list v-for="facility in allFacilities" :key="facility.FclId">
                          <q-item clickable v-close-popup @click="selectFacility(facility)">
                            <q-item-section>
                              <q-item-label>{{facility.FclDesc}}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                      <div class="customErr" v-if="facilityErr">Please select Facility</div>
                    </div>
                    <div class="col-12">
                      <q-btn-dropdown class="btn-full-width" :label="Type" no-caps>
                        <q-list v-for="ftype in allAppointmentTypes" :key="ftype.RecNo">
                          <q-item clickable v-close-popup @click="selectType(ftype)">
                            <q-item-section>
                              <q-item-label>{{ftype.Type}}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                      <div class="customErr" v-if="typeErr">Please select Appointment Type</div>
                    </div>

                    <div>
                      <q-btn label="Submit" type="submit" color="primary"/>
                      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                    </div>
                  </q-form>

                </div>
              </div>
              <div v-if="showTimes" class="col-xs-12 col-sm-8 col-md-6">
                <div class="q-pa-md q-pa-sm q-pa-xs q-gutter-sm" padding>
                  <q-btn v-for="slot in times" :key="slot+1" color="primary" :label="slot.time" @click="createAppointment(slot)" />
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<style>
</style>

<script lang="ts">
import gql from 'graphql-tag';
import { date } from 'quasar';
import { Key } from 'readline';
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';

@Component({
  meta() {
    return {
      title: 'Schedule Appointment',
    };
  },
})
export default class ScheduleAppointment extends Vue {
  public aptList = [];
  public connection = {};
  public path = '';
  public showTimes = false;
  public date = date.formatDate(Date.now(), 'YYYY-MM-DD');
  public doctorErr = false;
  public DctId = '';
  public DctName = 'Select Doctor';
  public allDoctors = [];
  public facilityErr = false;
  public FclId = '';
  public FclDesc = 'Select Facility';
  public allFacilities = [];
  public typeErr = false;
  public RecNo = '';
  public Type = 'Select Appointment Type';
  public allAppointmentTypes = [];
  public times = [
    {
      time: '07:30 AM',
    },
    {
      time: '08:30 AM',
    },
    {
      time: '09:30 AM',
    },
    {
      time: '10:30 AM',
    },
    {
      time: '11:30 AM',
    },
    {
      time: '12:30 PM',
    },
    {
      time: '01:30 PM',
    },
    {
      time: '02:30 PM',
    },
    {
      time: '03:30 PM',
    },
    {
      time: '04:30 PM',
    },
    {
      time: '05:30 PM',
    },
    {
      time: '06:30 PM',
    },
    {
      time: '07:30 PM',
    },
  ];
  public timesCopy = [
    {
      time: '07:30 AM',
    },
    {
      time: '08:30 AM',
    },
    {
      time: '09:30 AM',
    },
    {
      time: '10:30 AM',
    },
    {
      time: '11:30 AM',
    },
    {
      time: '12:30 PM',
    },
    {
      time: '01:30 PM',
    },
    {
      time: '02:30 PM',
    },
    {
      time: '03:30 PM',
    },
    {
      time: '04:30 PM',
    },
    {
      time: '05:30 PM',
    },
    {
      time: '06:30 PM',
    },
    {
      time: '07:30 PM',
    },
  ];

  @Watch('date')
  public onChildChanged(val: any, oldVal: any) {
    this.showTimes = false;
    // Replacing the times with actual times
    this.times.splice(0, this.times.length, ...this.timesCopy);
  }

  public created() {
    const connection = this.$store.state.connectionString;
    const path = this.$store.state.path;
    this.aptList = this.$store.state.AptList;
    this.connection = connection;
    this.path = path;
  }

  public mounted() {
    this.getDoctors();
  }

  public getDoctors() {
    this.$q.loading.show({
        message: 'Please wait while loading..',
      });
    this.$apollo.query({
        query: gql`query allDoctors ($connection: ConnectionInput) {
          allDoctors(connection: $connection) {
            DctId
            DctName
          }
        }`,
      variables: {
        connection: this.connection,
      },
      }).then((data: any) => {
        this.allDoctors = data.data.allDoctors;
        this.getFacilities();
      }).catch((error: any) => {
          this.$q.loading.hide();
          // tslint:disable-next-line:no-console
          console.error('error in get all doctors: ', error);
      });
  }
  public getFacilities() {
    this.$apollo.query({
      query: gql`query allFacilities ($connection: ConnectionInput) {
        allFacilities(connection: $connection) {
          FclId
          FclDesc
        }
      }`,
      variables: {
          connection: this.connection,
      },
    }).then((data: any) => {
      this.allFacilities = data.data.allFacilities;
      this.getAppointmentTypes();
    }).catch((error: any) => {
      this.$q.loading.hide();
      // tslint:disable-next-line:no-console
      console.error('error in get all facilities: ', error);
    });
  }
  public getAppointmentTypes() {
    this.$apollo.query({
      query: gql`query allAppointmentTypes ($connection: ConnectionInput) {
        allAppointmentTypes(connection: $connection) {
          RecNo
          Type
        }
      }`,
      variables: {
        connection: this.connection,
      },
    }).then((data: any) => {
      this.allAppointmentTypes = data.data.allAppointmentTypes;
      this.$q.loading.hide();
    }).catch((error: any) => {
      this.$q.loading.hide();
      // tslint:disable-next-line:no-console
      console.error('error in get all appointment types: ', error);
    });
  }

  public selectDoctor(doctor: any) {
    // tslint:disable-next-line:no-console
    console.log('selected doctor', doctor);
    this.doctorErr = false;
    this.DctId = doctor.DctId;
    this.DctName = doctor.DctName;
  }
  public selectFacility(facility: any) {
    // tslint:disable-next-line:no-console
    console.log('selected facility', facility);
    this.facilityErr = false;
    this.FclId = facility.FclId;
    this.FclDesc = facility.FclDesc;
  }

  public selectType(type: any) {
    // tslint:disable-next-line:no-console
    console.log('selected type', type);
    this.typeErr = false;
    this.RecNo = type.RecNo;
    this.Type = type.Type;
  }
  public onSubmit() {
    if (this.DctName === 'Select Doctor') {
      this.doctorErr = true;
      this.showTimes = false;
    } else if (this.FclDesc === 'Select Facility') {
      this.facilityErr = true;
      this.showTimes = false;
    } else if (this.Type === 'Select Appointment Type') {
      this.typeErr = true;
      this.showTimes = false;
    } else {
      this.aptList.map((apt: any, key: any) => {
        // tslint:disable-next-line:radix
        const aptDate = date.formatDate(parseInt(apt.AppDate), 'YYYY-MM-DD');
        const selectedDate = date.formatDate(this.date, 'YYYY-MM-DD');
        // Checking the selected date with patient appointments dates
        if (selectedDate === aptDate) {
          // Removing the already booked slot time from the times based on selectedDate
          const index = this.times.findIndex(slot => slot.time === apt.AppTime);
          this.times.splice(index, 1);
        }
      });
      this.showTimes = true;
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'fas fa-check-circle',
        message: 'Please select time to request an appointment',
      });
    }
  }

  public createAppointment(time: any) {
    const appointment = {
      PatId: this.$store.state.PatId.PatId,
      PatName: 'XYZ',
      FclId: this.FclId,
      DctId: this.DctId,
      DctName: this.DctName,
      FclDesc: this.FclDesc,
      Duration: 60,
      AppType: this.Type,
      AppDate: this.date,
      AppTime: time.time,
    };
    const connectionDetails = this.$store.state.connectionString;
    // tslint:disable-next-line:no-console
    console.log('create appointment object: ', appointment);
    this.$apollo.mutate({
      // Query
      mutation: gql`mutation ($connection: ConnectionInput, $appointment: AppointmentInput) {
        createAppointment(connection: $connection, appointment: $appointment) {
          RecNo
          PatId
          DctId
          DctName
          FclDesc
          FclId
          Duration
          AppType
          AppDate
          AppTime
          EntryDateTime
        }
      }`,
      // Parameters
      variables: {
        appointment,
        connection: connectionDetails,
      },
    }).then((data: any) => {
      // tslint:disable-next-line:no-console
      console.log('data', data);
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'fas fa-check-circle',
        message: 'Appointment created successfully!',
      });
      this.onReset();
      this.$router.push(`${this.path}`);
    }).catch((error: any) => {
      // tslint:disable-next-line:no-console
      console.error('error in api call: ', error);
    });
  }

  public onReset() {
    this.showTimes = false;
    this.date = date.formatDate(Date.now(), 'YYYY-MM-DD');
    this.DctName = 'Select Doctor';
    this.DctId = '';
    this.doctorErr = false;
    this.FclDesc = 'Select Facility';
    this.FclId = '';
    this.facilityErr = false;
    this.Type = 'Select Appointment Type';
    this.RecNo = '';
    this.typeErr = false;
  }
}
</script>

<style lang="stylus" scoped>
.row > div
  padding 10px 15px
.row + .row
  margin-top 1rem
.my-card
  width 100%
.customErr
  color #c10015
  font-size 12px
  padding 8px 0 0
.btn-full-width
  width 100%
.margin-auto
  margin 0 auto
</style>