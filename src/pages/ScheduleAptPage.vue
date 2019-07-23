<template>
  <div>
    <q-card class="my-card q-pa-md">
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
            <div v-if="showTimes" class="margin-auto q-pa-md col-xs-12 col-sm-12 col-md-8">
              <q-table
                table-style="height:400px"
                title="List Of Available Appointments"
                :data="getAvailableSlots"
                :columns="columns"
                :rows-per-page-options="[0]"
                :pagination.sync="pagination"
                row-key="RecNo"
                hide-bottom
              >
                <q-tr slot="body" slot-scope="props" :props="props">
                  <q-td key="Action" :props="props">
                    <q-btn flat label="Select" color="primary" @click='openCreateDialog(props.row)'></q-btn>
                  </q-td>
                  <q-td key="Date" :props="props">
                    {{aptDate(props.row.appDateTime)}}
                  </q-td>
                  <q-td key="Facility" :props="props">
                    {{props.row.FclDesc}}
                  </q-td>
                  <q-td key="AppointmentType" :props="props">
                    {{props.row.AppType}}
                  </q-td>
                </q-tr>
              </q-table>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <CreateDialog v-bind:createAptDialog="createAptDialog" v-bind:DctName="DctName" v-bind:FclDesc="FclDesc" v-bind:Type="Type" v-bind:appDateTime="appDateTime" @closeCreate="closeCreate" @createAppointment="createAppointment(createObj)"/>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag';
import { date } from 'quasar';
import { Key } from 'readline';
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';
import CreateDialog from '../components/appointment/CreateDialog.vue';

@Component({
  components: {
    CreateDialog,
  },
})
export default class ScheduleAptPage extends Vue {
  public createAptDialog = false;
  public createObj: any = {};
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
  public pagination={
    page:1,
    rowsPerPage:0
  };
  public columns = [
    {
      name: 'Action',
      label: 'Action',
      align: 'center',
    },
    {
      name: 'Date',
      align: 'left',
      label: 'Date/Time',
      field: (row: any) => row.appDateTime,
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
    { name: 'AppointmentType',
      label: 'Appointment Type',
      align: 'center',
      field: (row: any) => row.AppType ? row.AppType : '',
      format: (val: any) => `${val}`,
      sortable: false,
    },
  ];

  @Watch('date')
  public onChildChanged(val: any, oldVal: any) {
    this.showTimes = false;
  }

  public aptDate(aptDate: any) {
    // tslint:disable-next-line:radix
    return date.formatDate(parseInt(aptDate), 'MM/DD/YY hh:mm a');
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
        this.$q.loading.hide();
      }).catch((error: any) => {
          this.$q.loading.hide();
          // tslint:disable-next-line:no-console
          console.error('error in get all doctors: ', error);
      });
      this.showTimes = true;
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'fas fa-check-circle',
        message: 'Select available slots to request an appointment',
      });
    }
  }

  public openCreateDialog(apt: any) {
    this.createAptDialog = true;
    // tslint:disable-next-line:radix
   //const selectedDate = date.formatDate(parseInt(apt.appDateTime), 'YYYY-MM-DD');
    // tslint:disable-next-line:radix
    //const selectedTime = date.formatDate(parseInt(apt.appDateTime), 'hh:mm:ss');
    const modifiedDate =   date.formatDate(parseInt(apt.appDateTime), 'MM/DD/YYYY hh:mm a');
    this.appDateTime = modifiedDate;
    const appointment = {
      PatId: this.$store.state.PatId.PatId,
      PatName: '',
      FclId: this.FclId,
      DctId: this.DctId,
      Duration: 15,
      AppType: this.Type,
      AppDateTime: this.appDateTime,
    };
    this.createObj = appointment;
  }

  public closeCreate() {
    console.log('close called');
    this.createAptDialog = false;
  }

  public createAppointment(appointment: any) {
    console.log('creted called', appointment);
    this.createAptDialog = false;
    this.$q.loading.show({
      message: 'Creating your appointment',
    });
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
          AppDateTime
          EntryDateTime
        }
      }`,
      // Parameters
      variables: {
        appointment,
        connection: this.connection,
      },
    }).then((data: any) => {
      // this.$q.loading.hide();
      // tslint:disable-next-line:no-console
      console.log('appointment created sussessfully', data);
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'fas fa-check-circle',
        message: 'Appointment created successfully!',
      });
      this.onReset();
      this.$router.push(`${this.path}`);
    }).catch((error: any) => {
      this.$q.loading.hide();
      // tslint:disable-next-line:no-console
      console.error('error in create: ', error);
    });
  }
  public onReset() {
    this.createAptDialog = false;
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

