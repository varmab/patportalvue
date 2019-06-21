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
              <div class="col">
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
                    <div>
                      <q-btn-dropdown :label="doctorName" no-caps>
                        <q-list v-for="doctor in doctors" :key="doctor.doctorId">
                          <q-item clickable v-close-popup @click="selectDoctor(doctor)">
                            <q-item-section>
                              <q-item-label>{{doctor.doctorName}}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                      <div class="customErr" v-if="doctorErr">Please select Doctor</div>
                    </div>
                    <div>
                      <q-btn-dropdown :label="facilityName" no-caps>
                        <q-list v-for="facility in facilities" :key="facility.facilityId">
                          <q-item clickable v-close-popup @click="selectFacility(facility)">
                            <q-item-section>
                              <q-item-label>{{facility.facilityName}}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                      <div class="customErr" v-if="facilityErr">Please select Facility</div>
                    </div>
                    <div>
                      <q-btn-dropdown :label="typeName" no-caps>
                        <q-list v-for="ftype in types" :key="ftype.typeId">
                          <q-item clickable v-close-popup @click="selectType(ftype)">
                            <q-item-section>
                              <q-item-label>{{ftype.typeName}}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-btn-dropdown>
                      <div class="customErr" v-if="typeErr">Please select Facility Type</div>
                    </div>

                    <div>
                      <q-btn label="Submit" type="submit" color="primary"/>
                      <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                    </div>
                  </q-form>

                </div>
              </div>
              <div v-if="this.showTimes" class="col">
                <div class="q-pa-md q-gutter-sm" padding>
                  <q-btn color="primary" label="07:30 am" />
                  <q-btn color="primary" label="08:30 am" />
                  <q-btn color="primary" label="09:30 am" />
                  <q-btn color="primary" label="10:30 am" />
                  <q-btn color="primary" label="11:30 am" />
                  <q-btn color="primary" label="12:30 pm" />
                  <q-btn color="primary" label="01:30 pm" />
                  <q-btn color="primary" label="02:30 pm" />
                  <q-btn color="primary" label="03:30 pm" />
                  <q-btn color="primary" label="04:30 pm" />
                  <q-btn color="primary" label="05:30 pm" />
                  <q-btn color="primary" label="06:30 pm" />
                  <q-btn color="primary" label="07:30 pm" />
                  <q-btn color="primary" label="08:30 pm" />
                  <q-btn color="primary" label="09:30 pm" />
                  <q-btn color="primary" label="10:30 pm" />
                  <q-btn color="primary" label="11:30 pm" />
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
  public doctorId = '';
  public doctorName = 'Select Doctor';
  public doctors = [
    {
      doctorId: '1',
      doctorName: 'John Doe',
    },
    {
      doctorId: '2',
      doctorName: 'Mike',
    },
    {
      doctorId: '3',
      doctorName: 'Stella',
    },
    {
      doctorId: '4',
      doctorName: 'Dr Smith',
    },
    {
      doctorId: '5',
      doctorName: 'Alexa',
    },
    {
      doctorId: '6',
      doctorName: 'Cortana',
    },
    {
      doctorId: '7',
      doctorName: 'Mr Bella',
    },
    {
      doctorId: '8',
      doctorName: 'Dr Bravo',
    },
    {
      doctorId: '9',
      doctorName: 'Alexis',
    },
    {
      doctorId: '10',
      doctorName: 'Cortanaa',
    },
  ];
  public facilityErr = false;
  public facilityId = '';
  public facilityName = 'Select Facility';
  public facilities = [
    {
      facilityId: '1',
      facilityName: 'Neurologist',
    },
    {
      facilityId: '2',
      facilityName: 'Skin Specialist',
    },
    {
      facilityId: '3',
      facilityName: 'Brain Specailist',
    },
    {
     facilityId: '4',
      facilityName: 'Gynaecologist',
    },
    {
      facilityId: '5',
      facilityName: 'Dentist',
    },
    {
      facilityId: '6',
      facilityName: 'Dermotologist',
    },
    {
      facilityId: '7',
      facilityName: 'Arthopedic',
    },
    {
      facilityId: '8',
      facilityName: 'Cardiologist',
    },
    {
      facilityId: '9',
      facilityName: 'Gynaecologist',
    },
    {
      facilityId: '10',
      facilityName: 'Dermotologist',
    },
  ];
  public typeErr = false;
  public typeId = '';
  public typeName = 'Select Facility Type';
  public types = [
    {
      typeId: '1',
      typeName: 'Routine Checkup',
    },
    {
      typeId: '2',
      typeName: 'Vaccinations',
    },
    {
      typeId: '3',
      typeName: 'Eye Care',
    },
    {
     typeId: '4',
      typeName: 'Blood Test',
    },
    {
      typeId: '5',
      typeName: 'Routine Checkup',
    },
  ];

  public selectDoctor(doctor: any) {
    // tslint:disable-next-line:no-console
    console.log('selected doctor', doctor);
    this.doctorErr = false;
    this.doctorId = doctor.doctorId;
    this.doctorName = doctor.doctorName;
  }
  public selectFacility(facility: any) {
    // tslint:disable-next-line:no-console
    console.log('selected facility', facility);
    this.facilityErr = false;
    this.facilityId = facility.facilityId;
    this.facilityName = facility.facilityName;
  }

  public selectType(type: any) {
    // tslint:disable-next-line:no-console
    console.log('selected type', type);
    this.typeErr = false;
    this.typeId = type.typeId;
    this.typeName = type.typeName;
  }
  public onSubmit() {
      if (this.doctorName === 'Select Doctor') {
        this.doctorErr = true;
        this.showTimes = false;
      } else if (this.facilityName === 'Select Facility') {
        this.facilityErr = true;
        this.showTimes = false;
      } else if (this.typeName === 'Select Facility Type') {
        this.typeErr = true;
        this.showTimes = false;
      } else {
        this.showTimes = true;
        this.$q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'fas fa-check-circle',
          message: 'Please select the time to request appointment',
        });
      }
  }

  public onReset() {
    this.showTimes = false;
    this.date = date.formatDate(Date.now(), 'YYYY-MM-DD');
    this.doctorName = 'Select Doctor';
    this.doctorId = '';
    this.doctorErr = false;
    this.facilityName = 'Select Facility';
    this.facilityId = '';
    this.facilityErr = false;
    this.typeName = 'Select Facility Type';
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
</style>
