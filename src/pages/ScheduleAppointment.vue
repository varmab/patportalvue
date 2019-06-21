<template>
  <div>
    <div class="q-px-md q-py-sm q-gutter-sm">
      <q-btn color="primary" class="block" icon="keyboard_backspace" label="Back" no-caps @click="$router.push('/')"/>
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
                        <q-list v-for="doctor in doctors" :key="doctor.DctId">
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
                        <q-list v-for="facility in facilities" :key="facility.FclId">
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
                      <q-btn-dropdown class="btn-full-width" :label="AppType" no-caps>
                        <q-list v-for="ftype in types" :key="ftype.typeId">
                          <q-item clickable v-close-popup @click="selectType(ftype)">
                            <q-item-section>
                              <q-item-label>{{ftype.AppType}}</q-item-label>
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
                  <q-btn v-for="time in times" :key="time" color="primary" :label="time.time" />
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
import { date } from 'quasar';
import { Component, Mixins, Vue } from 'vue-property-decorator';

@Component({
  meta() {
    return {
      title: 'Schedule Appointment',
    };
  },
})
export default class ScheduleAppointment extends Vue {
  public showTimes = false;
  public date = date.formatDate(Date.now(), 'YYYY-MM-DD');
  public doctorErr = false;
  public DctId = '';
  public DctName = 'Select Doctor';
  public doctors = [
    {
      DctId: '1',
      DctName: 'John Doe',
    },
    {
      DctId: '2',
      DctName: 'Mike',
    },
    {
      DctId: '3',
      DctName: 'Stella',
    },
    {
      DctId: '4',
      DctName: 'Dr Smith',
    },
    {
      DctId: '5',
      DctName: 'Alexa',
    },
    {
      DctId: '6',
      DctName: 'Cortana',
    },
    {
      DctId: '7',
      DctName: 'Mr Bella',
    },
    {
      DctId: '8',
      DctName: 'Dr Bravo',
    },
    {
      DctId: '9',
      DctName: 'Alexis',
    },
    {
      DctId: '10',
      DctName: 'Cortanaa',
    },
  ];
  public facilityErr = false;
  public FclId = '';
  public FclDesc = 'Select Facility';
  public facilities = [
    {
      FclId: '1',
      FclDesc: 'Neurologist',
    },
    {
      FclId: '2',
      FclDesc: 'Skin Specialist',
    },
    {
      FclId: '3',
      FclDesc: 'Brain Specailist',
    },
    {
     FclId: '4',
      FclDesc: 'Gynaecologist',
    },
    {
      FclId: '5',
      FclDesc: 'Dentist',
    },
    {
      FclId: '6',
      FclDesc: 'Dermotologist',
    },
    {
      FclId: '7',
      FclDesc: 'Arthopedic',
    },
    {
      FclId: '8',
      FclDesc: 'Cardiologist',
    },
    {
      FclId: '9',
      FclDesc: 'Gynaecologist',
    },
    {
      FclId: '10',
      FclDesc: 'Dermotologist',
    },
  ];
  public typeErr = false;
  public typeId = '';
  public AppType = 'Select Appointment Type';
  public types = [
    {
      typeId: '1',
      AppType: 'Routine Checkup',
    },
    {
      typeId: '2',
      AppType: 'Vaccinations',
    },
    {
      typeId: '3',
      AppType: 'Eye Care',
    },
    {
     typeId: '4',
      AppType: 'Blood Test',
    },
  ];
  public times = [
    {
      time: '07:30 am',
    },
    {
      time: '08:30 am',
    },
    {
      time: '09:30 am',
    },
    {
      time: '10:30 am',
    },
    {
      time: '11:30 am',
    },
    {
      time: '12:30 pm',
    },
    {
      time: '01:30 pm',
    },
    {
      time: '02:30 pm',
    },
    {
      time: '03:30 pm',
    },
    {
      time: '04:30 pm',
    },
    {
      time: '05:30 pm',
    },
    {
      time: '06:30 pm',
    },
    {
      time: '07:30 pm',
    },
  ];

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
    this.typeId = type.typeId;
    this.AppType = type.AppType;
  }
  public onSubmit() {
      if (this.DctName === 'Select Doctor') {
        this.doctorErr = true;
        this.showTimes = false;
      } else if (this.FclDesc === 'Select Facility') {
        this.facilityErr = true;
        this.showTimes = false;
      } else if (this.AppType === 'Select Appointment Type') {
        this.typeErr = true;
        this.showTimes = false;
      } else {
        this.showTimes = true;
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'fas fa-check-circle',
          message: 'Please select time to request an appointment',
        });
      }
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
    this.AppType = 'Select Appointment Type';
    this.typeId = '';
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
