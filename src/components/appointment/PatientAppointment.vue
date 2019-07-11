<template>
  <q-card class="my-card">
    <div class="q-pa-sm" v-if="showApt">
      <div class="row">
        <div class="margin-auto">
          <q-card-section>
            <q-banner class="bg-grey-3 " style= "max-width: 400px">
              <template>
                <div class="text-h6 text-weight-regular text-center">Your Next Appointment</div>
              </template>
              <q-separator inset />
                <div class="margin-auto">
                    <div class="row text-center">
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <span class="text-weight-light">Apt Date: </span>
                        <span>{{aptDate}}</span>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12 d-flex align-items-center">
                        <span class="text-weight-light">Doctor: </span>
                        <span class="three-dots">{{patientAppointment.DctName}}</span>
                      </div>
                    </div>
                    <div class="row text-center">
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <span class="text-weight-light">Facility: </span>
                        <span class="three-dots">{{patientAppointment.FclDesc}}</span>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <span class="text-weight-light">App Type: </span>
                        <span class="three-dots">{{patientAppointment.AppType}}</span>
                      </div>
                    </div>
                </div>
                <div class="text-center">
                  <q-btn flat color="primary" label="Change" @click="confirm = true"/>
                </div>
            </q-banner>
            <!-- <div class="q-pa-sm">
              <div class="row">
                <q-card class="my-card">
                  <template>
                <div class="text-h6 text-weight-regular text-center">Your Next Appointment</div>
              </template>
              <q-separator inset />
                <div class="margin-auto">
                    <div class="row text-center">
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <span class="text-weight-light">Apt Date: </span>
                        <span>Aug 02 2019, 09AM - 10AM</span>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <span class="text-weight-light">Doctor: </span>
                        <span>John Doe</span>
                      </div>
                    </div>
                    <div class="row text-center">
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <span class="text-weight-light">Facility: </span>
                        <span>Orthopedic</span>
                      </div>
                      <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                        <span class="text-weight-light">App Type: </span>
                        <span>Emergency</span>
                      </div>
                    </div>
                </div>
                <div class="text-center">
                  <q-btn flat color="primary" label="Change" @click="showApt = !showApt" />
                </div>
                </q-card>
              </div>
            </div> -->
          </q-card-section>
        </div>
      </div>
    </div>
    <q-card-section v-else>
      <q-card-section>
        <div class="q-table__title">Schedule New Appointment</div>
      </q-card-section>
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
                          <q-item-label class="three-dots">{{doctor.DctName}}</q-item-label>
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
                          <q-item-label class="three-dots">{{facility.FclDesc}}</q-item-label>
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
            <div class="q-pa-md q-pa-sm q-pa-xs q-gutter-sm" padding>Available slots</div>
            <q-calendar
              v-model="selectedDate"
              view="day"
              hour24-format
              :interval-count="86"
              :interval-minutes="15"
              @click:interval="scheduleApt"
              @click:date="scheduleApt"
              @click:time="scheduleApt"
              locale="en-us"
              style="height: 400px;"
            />
            <!-- <DayCalendar :selectedDate = "date"/> -->
            <!-- <span v-for="slot in times" :key="slot+1" class="q-pa-md q-pa-sm q-pa-xs q-gutter-sm" padding>
              <q-btn v-if="slots.findIndex(booked => booked.time === slot.time) > -1" color="green" :label="slot.time" @click="createAppointment(slot)" disable/>
              <q-btn v-else color="green" :label="slot.time" @click="createAppointment(slot)"/>
            </span> -->
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
    <q-dialog v-model="addEvent" no-backdrop-dismiss>
      <q-card v-if="addEvent" style="width: 400px;">
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>
            Create Appointment
          </q-toolbar-title>
          <q-btn flat round color="white" icon="close" v-close-popup></q-btn>
        </q-toolbar>
        <q-card-section class="inset-shadow">
          <q-form
            v-if="contextDay"
            ref='event'
            class="q-gutter-md"
          >
            <div class="q-gutter-sm">
               <div>
                <span class="three-dots"><span class="text-weight-light">Doctor:</span> {{DctName}}</span>
              </div>
              <div>
                <span class="three-dots"><span class="text-weight-light">Facility:</span> {{FclDesc}}</span>
              </div>
              <div>
                <span class="three-dots"><span class="text-weight-light">Apt Type:</span> {{Type}}</span>
              </div>
            </div>
           

            <div class="q-gutter-sm">
              <q-input color="blue-6" outlined v-model="dateTimeStart" label="Event start date and time" mask="####-##-## ##:##">
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy v-model="showDateTimeScrollerStart">

                      <q-date-time-scroller
                        v-model="dateTimeStart"
                        :locale="locale"
                        :hour24-format="true"
                        :rounded-borders="true"
                        border-color="#2196f3"
                        bar-color="#2196f3"
                        color="white"
                        background-color="primary"
                        inner-color="primary"
                        inner-background-color="white"
                        :style="scrollerPopupStyle280"
                        @close="() => { showDateTimeScrollerStart = false }"
                      />

                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input color="blue-6" outlined v-model="dateTimeEnd" label="Event end date and time" mask="####-##-## ##:##">
                <template #append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy v-model="showDateTimeScrollerEnd">

                      <q-date-time-scroller
                        v-model="dateTimeEnd"
                        :locale="locale"
                        :hour24-format="true"
                        :rounded-borders="true"
                        border-color="#2196f3"
                        bar-color="#2196f3"
                        color="white"
                        background-color="primary"
                        inner-color="primary"
                        inner-background-color="white"
                        :style="scrollerPopupStyle280"
                        @close="() => { showDateTimeScrollerEnd = false }"
                      />

                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </q-form>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="saveEvent"></q-btn>
          <q-btn flat label="Cancel" color="primary" v-close-popup></q-btn>
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
import DayCalendar from './DayCalendar.vue';

@Component({
  components: {
    DayCalendar,
  },
})
export default class PatientAppointment extends Vue {
  public confirm = false;
  public patientAppointment: any = [];
  public appDateTime = '';
  public showApt = false;
  public PatId = {};
  public slots: any = [];
  public aptList = [];
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
  public times = [
    {
      time: '07:30',
    },
    {
      time: '08:30',
    },
    {
      time: '09:30',
    },
    {
      time: '10:30',
    },
    {
      time: '11:30',
    },
    {
      time: '12:30',
    },
    {
      time: '14:30',
    },
    {
      time: '15:30',
    },
    {
      time: '16:30',
    },
    {
      time: '17:30',
    },
    {
      time: '18:30',
    },
    {
      time: '19:30',
    },
    {
      time: '20:30',
    },
    {
      time: '21:30',
    },
  ];
  public selectedDate = '';
  public addEvent = false;
  public contextDay: any = null;
  public showDateTimeScrollerStart = false;
  public showDateTimeScrollerEnd = false;
  public dateTimeStart = '';
  public dateTimeEnd = '';

  get aptDate() {
    // tslint:disable-next-line:radix
    return date.formatDate(parseInt(this.appDateTime), 'MMM DD YYYY, hh:mm A');
  }

  @Watch('date')
  public onChildChanged(val: any, oldVal: any) {
    this.showTimes = false;
    this.slots.length = 0;
  }

  public created() {
    this.connection = this.$store.state.connectionString;
    this.path = this.$store.state.path;
    this.PatId = this.$store.state.PatId;
  }

  public mounted() {
    this.getPatApt();
  }

  public getPatApt() {
    this.$q.loading.show({
      message: 'Please wait while loading..',
    });
    this.$apollo.query({
      query: gql`query patientAppointment($connection: ConnectionInput, $PatId: ListPatIdInput) {
        patientAppointment(connection: $connection, PatId: $PatId) {
          RecNo
          PatId
          DctId
          FclId
          DctName
          FclDesc
          Duration
          AppType
          AppDateTime
          EntryDateTime
        }
      }`,
      // Parameters
      variables: {
        connection: this.connection,
        PatId: this.PatId,
      },
    }).then((data: any) => {
        const patientAppointment = data.data.patientAppointment;
        if (patientAppointment.length) {
          this.showApt = true;
          this.patientAppointment = patientAppointment[0];
          this.appDateTime = patientAppointment[0].AppDateTime;
        } else {
          this.showApt = false;
        }
        this.getDoctors();
      }).catch((error: any) => {
        this.$q.loading.hide();
        // tslint:disable-next-line:no-console
        console.error('error in get patient appointment list: ', error);
      });
  }

  public getDoctors() {
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
      // tslint:disable-next-line:radix
      this.selectedDate = date.formatDate(Date.now(), 'YYYY-MM-DD');
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
      this.selectedDate = date.formatDate(this.date, 'YYYY-MM-DD');
      const availSlots = {
        AppDateTime: this.selectedDate,
        DctId: this.DctId,
        FclId: this.FclId,
        AppType: this.Type,
      };
      // tslint:disable-next-line:no-console
      console.log('availSlots', availSlots);
      this.$q.loading.show({
        message: 'Please wait while loading..',
      });
      this.$apollo.query({
        query: gql`query getAvailableSlots ($connection: ConnectionInput, $availSlots: AvailSlotsInput) {
          getAvailableSlots(connection: $connection, availSlots: $availSlots) {
            appTime
            duration
          }
        }`,
      variables: {
        connection: this.connection,
        availSlots,
      },
      }).then((data: any) => {
        this.getAvailableSlots = data.data.getAvailableSlots;
        console.log('available slots', this.getAvailableSlots);
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

  public getTimestamp(day: any) {
    return day.date + ' ' + this.padTime(day.hour) + ':' + this.padTime(day.minute) + ':00.000';
  }

  public adjustTimestamp(day: any) {
    day.minute = day.minute < 15 || day.minute >= 45 ? 0 : 30;
    return day;
  }

  public addOrUpdateEvent() {
    if (this.contextDay && this.contextDay.bgcolor) {
      return 'Update';
    }
    return 'Add';
  }

  public padTime = (val: any) => {
    // console.log('time formatttt', val);
    val = Math.floor(val);
    if (val < 10) {
      return '0' + val;
    }
    return val + '';
  }

      // tslint:disable-next-line:no-shadowed-variable
    public formatTime(date: any) {
      // tslint:disable-next-line:one-variable-per-declaration
      const d = date !== void 0 ? new Date(date) : new Date(),
        hours = '' + d.getHours(),
        minutes = '' + d.getMinutes();
      const pHours = this.padTime(hours);
      const pMinutes = this.padTime(minutes);
      return [pHours, pMinutes].join(':');
    }

  public scheduleApt(day: any, type: any) {
    // console.log('add called', day, type);
    // tslint:disable-next-line:max-line-length
    if (day.disabled === true) {
      return;
    }
      // this.resetForm();
    this.contextDay = { ...day };
    let timestamp;
    if (this.contextDay.hasTime === true) {
        timestamp = this.getTimestamp(this.adjustTimestamp(this.contextDay));
        const startTime = new Date(timestamp);
        const endTime = date.addToDate(startTime, { hours: 1 });
        const formatedDate = date.formatDate(endTime, 'YYYY-MM-DD');
        // const formatedTime = date.formatDate(endTime, 'YYYY-MM-DD');
        this.dateTimeEnd = formatedDate + ' ' + this.formatTime(endTime); // endTime.toString()
      } else {
        timestamp = this.contextDay.date + ' 00:00';
      }
    this.dateTimeStart = timestamp;
    this.addEvent = true; // show dialog
    }

  public createAppointment(time: any) {
    // this.$q.loading.show({
    //   message: 'Creating appointment your appointment',
    // });
    const selectedDate = date.formatDate(this.date, 'YYYY-MM-DD');
    const timeMod = time.time + ':00';
    const selectedTime = date.formatDate(timeMod, 'hh:mm:ss');
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
    this.selectedDate = date.formatDate(Date.now(), 'YYYY-MM-DD');
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
  display: inline-block;
  width: 220px;
  white-space: nowrap;
  overflow: hidden !important;
  text-overflow: ellipsis;
</style>

