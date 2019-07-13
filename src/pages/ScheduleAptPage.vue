<template>
  <q-card class="my-card">
    <q-card-section>
      <q-card-section>
        <div class="q-table__title">Schedule New Appointment</div>
      </q-card-section>
      <div class="q-pa-md q-pa-0">
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
                  :rules="[ val => val && val.length > 0 || 'Please select date' ]"
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
                  <q-btn-dropdown class="btn-full-width three-dots" :label="DctName" no-caps>
                    <q-list v-for="doctor in allDoctors" :key="doctor.DctId">
                      <q-item clickable v-close-popup @click="selectDoctor(doctor)">
                        <q-item-section>
                          <q-item-label class="three-dots">{{doctor.DctName}}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                  <div class="customErr" v-if="doctorErr">Please select Doctor</div>
                </div>
                <div class="col-12">
                  <q-btn-dropdown class="btn-full-width three-dots" :label="FclDesc" no-caps>
                    <q-list v-for="facility in allFacilities" :key="facility.FclId">
                      <q-item clickable v-close-popup @click="selectFacility(facility)">
                        <q-item-section>
                          <q-item-label class="three-dots">{{facility.FclDesc}}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                  <div class="customErr" v-if="facilityErr">Please select Facility</div>
                </div>
                <div class="col-12">
                  <q-btn-dropdown class="btn-full-width three-dots" :label="Type" no-caps>
                    <q-list v-for="ftype in allAppointmentTypes" :key="ftype.RecNo">
                      <q-item clickable v-close-popup @click="selectType(ftype)">
                        <q-item-section>
                          <q-item-label class="three-dots">{{ftype.Type}}</q-item-label>
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
          <div v-if="showTimes" class="margin-auto col-xs-12 col-sm-8 col-md-6">
            <q-table
                title="List Of Available Appointments"
                :data="getAvailableSlots"
                :columns="columns"
                row-key="RecNo"
            >
             <template slot="col-action" scope="row">
                <q-btn flat label="Cancel" color="primary"></q-btn>
            </template>
            </q-table>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Are you sure you want to cancel the current appointment and schedule new appointment?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="No" color="red" v-close-popup @click="showApt = true"/>
          <q-btn flat label="Sure, Schedule new" color="primary" v-close-popup @click="showSchedule(patientAppointment)"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script lang="ts">
import gql from 'graphql-tag';
import { date } from 'quasar';
import { Key } from 'readline';
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';

@Component
export default class ScheduleAptPage extends Vue {
  public confirm = false;
  public patientAppointment: any = [];
  public appDateTime = '';
  public showApt = false;
  public PatId = {};
  public getAvailableSlots = [];
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
  public columns = [
    {
      name: 'Date',
      align: 'left',
      label: 'Date/Time',
      field: (row: any) => {
        console.log('row coming', row);
        // tslint:disable-next-line:radix
        const value = date.formatDate(parseInt(row.appDateTime), 'DD/MM/YY hh:mm');
        return value;
      },
      format: (val: any) => `${val}`,
      sortable: true,
    },
    { name: 'Facility',
      label: 'Facility',
      align: 'center',
      field: (row: any) => row.FclDesc ? row.FclDesc : '',
      format: (val: any) => `${val}`,
      sortable: false,
    },
    { name: 'Appointment Type',
      label: 'Appointment Type',
      align: 'center',
      field: (row: any) => row.AppType ? row.AppType : '',
      format: (val: any) => `${val}`,
      sortable: false,
    },
    {
      name: 'Action',
      label: 'Action',
      align: 'center',
    },
  ];

  @Watch('date')
  public onChildChanged(val: any, oldVal: any) {
    this.showTimes = false;
  }

  public created() {
    this.connection = this.$store.state.connectionString;
    this.path = this.$store.state.path;
    this.PatId = this.$store.state.PatId;
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

  public showSchedule(appointment: any) {
      const connectionDetails = this.$store.state.connectionString;
      const deleteAptObj = {
        // tslint:disable-next-line:radix
        AppDateTime: date.formatDate(parseInt(appointment.AppDateTime), 'YYYY-MM-DD hh:mm:ss'),
        PatId: appointment.PatId,
      };
      console.log('deleteAptObj', deleteAptObj);
    //   this.$apollo.mutate({
    //   // Query
    //   mutation: gql`mutation ($connection: ConnectionInput, $appointment: DeletePatAptInput) {
    //     deletePatApt(connection: $connection, appointment: $appointment) {
    //       message
    //     }
    //   }`,
    //   // Parameters
    //   variables: {
    //     appointment: deleteAptObj,
    //     connection: connectionDetails,
    //   },
    // }).then((data: any) => {
    //   // this.$q.loading.hide();
    //   // tslint:disable-next-line:no-console
    //   console.log('appointment created sussessfully', data);
    //   this.$q.notify({
    //     color: 'green-4',
    //     textColor: 'white',
    //     icon: 'fas fa-check-circle',
    //     message: 'Appointment created successfully!',
    //   });
    //   this.onReset();
    //   this.$router.push(`${this.path}`);
    // }).catch((error: any) => {
    //   this.$q.loading.hide();
    //   // tslint:disable-next-line:no-console
    //   console.error('error in api call: ', error);
    // });
    // tslint:disable-next-line:no-console
      console.log('appointment coming', appointment);
      this.showApt = !this.showApt;
    // tslint:disable-next-line:radix
      this.date = date.formatDate(Date.now(), 'YYYY/MM/DD');
      this.DctId = '';
      this.DctName = 'Select Doctor';
      this.FclId = '';
      this.FclDesc = 'Select Facility';
      this.Type = 'Select Appointment Type';
      this.RecNo = '';
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
      const availSlots = {
        AppDateTime: date.formatDate(this.date, 'YYYY-MM-DD'),
        DctId: this.DctId,
        FclId: this.FclId,
        AppType: this.Type,
      };
      console.log('OnSubmit -> availSlots', availSlots);
      this.$q.loading.show({
        message: 'Please wait loading available slots.',
      });
      this.$apollo.query({
        query: gql`query getAvailableSlots ($connection: ConnectionInput, $availSlots: AvailSlotsInput) {
          getAvailableSlots(connection: $connection, availSlots: $availSlots) {
            appDateTime
            FclDesc
            AppType
          }
        }`,
        variables: {
          connection: this.connection,
          availSlots,
        },
      }).then((data: any) => {
        this.getAvailableSlots = data.data.getAvailableSlots;
        console.log('slotssss', this.getAvailableSlots);
        this.$q.loading.hide();
      }).catch((error: any) => {
          this.$q.loading.hide();
          // tslint:disable-next-line:no-console
          console.error('error in get all doctors: ', error);
      });
      // this.aptList.map((apt: any, key: any) => {
      //   const bookedSlot: any = {};
      //   const selectedDate = date.formatDate(this.date, 'MMM DD YYYY');
      //   // tslint:disable-next-line:radix
      //   const AptDate = date.formatDate(parseInt(apt.AppDateTime), 'MMM DD YYYY');
      //   // tslint:disable-next-line:radix
      //   const AptTime = date.formatDate(parseInt(apt.AppDateTime), 'hh:mm A');
      //   if (selectedDate === AptDate) {
      //     bookedSlot.time = AptTime;
      //     this.slots.push(bookedSlot);
      //   }
      // });
      this.showTimes = true;
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'fas fa-check-circle',
        message: 'Select available slots to request an appointment',
      });
    }
  }

  public createAppointment(time: any) {
    console.log('createAppointment -> time', time);
    // this.$q.loading.show({
    //   message: 'Creating appointment your appointment',
    // });
    const selectedDate = date.formatDate(this.date, 'YYYY-MM-DD');
    const selectedTime = date.formatDate(time, 'hh:mm:ss');
    const modifiedDate =  selectedDate + ' ' + selectedTime;
    console.log('AppDateTime', modifiedDate);
    const appointment = {
      PatId: this.$store.state.PatId.PatId,
      PatName: 'XYZ',
      FclId: this.FclId,
      DctId: this.DctId,
      Duration: 60,
      AppType: this.Type,
      AppDateTime: modifiedDate,
    };
    const connectionDetails = this.$store.state.connectionString;
    // tslint:disable-next-line:no-console
    console.log('create appointment object: ', appointment);
    // this.$apollo.mutate({
    //   // Query
    //   mutation: gql`mutation ($connection: ConnectionInput, $appointment: AppointmentInput) {
    //     createAppointment(connection: $connection, appointment: $appointment) {
    //       RecNo
    //       PatId
    //       DctId
    //       DctName
    //       FclDesc
    //       FclId
    //       Duration
    //       AppType
    //       AppDateTime
    //       EntryDateTime
    //     }
    //   }`,
    //   // Parameters
    //   variables: {
    //     appointment,
    //     connection: connectionDetails,
    //   },
    // }).then((data: any) => {
    //   // this.$q.loading.hide();
    //   // tslint:disable-next-line:no-console
    //   console.log('appointment created sussessfully', data);
    //   this.$q.notify({
    //     color: 'green-4',
    //     textColor: 'white',
    //     icon: 'fas fa-check-circle',
    //     message: 'Appointment created successfully!',
    //   });
    //   this.onReset();
    //   this.$router.push(`${this.path}`);
    // }).catch((error: any) => {
    //   this.$q.loading.hide();
    //   // tslint:disable-next-line:no-console
    //   console.error('error in api call: ', error);
    // });
  }
  public onReset() {
    this.confirm = false;
    this.showApt = false;
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
.three-dots
  display: inline-block
  width: 220px
  white-space: nowrap
  overflow: hidden !important
  text-overflow: ellipsis
.d-flex 
  display : flex
</style>

