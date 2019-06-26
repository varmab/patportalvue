<template>
  <div>
    <div class="q-px-md q-py-sm q-gutter-sm">
      <q-btn color="primary" label="Schedule An Appointment" no-caps @click="$router.push('/schedule')"/>
    </div>
    <div class="q-pa-md">
      <q-table
        title="Patient Appointments"
        :data="patientAppointmentsList"
        :columns="columns"
        row-key="name"
      />
    </div>
  </div>
</template>

<style>
</style>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';

@Component({
  meta() {
    return {
      title: 'Patient Appointments List',
    };
  },
})
export default class Dashboard extends Vue {
  public columns = [
    { name: 'Date', align: 'left', label: 'Date', field: 'AppDateTime', sortable: true },
    { name: 'Doctor',
      required: true,
      label: 'Doctor',
      align: 'center',
      field: (row: any) => row.DctName,
      format: (val: any) => `${val}`,
      sortable: false,
    },
    { name: 'Facility', label: 'Facility', field: 'FclDesc' },
    { name: 'Appointment Type', label: 'Appointment Type', field: 'AppType' },
  ];
  public patientAppointmentsList = [
    {
      AppType: 'Routine Checkup',
      DctName: 'John Doe',
      FclDesc: 'Dermotologist',
      AppDateTime: '2019-06-14',
    },
    {
      AppType: 'Vaccinations',
      DctName: 'Smith',
      FclDesc: 'Gynaecologist',
      AppDateTime: '2019-06-17',
    },
    {
      AppType: 'Eye Care',
      DctName: 'Bravo',
      FclDesc: 'Cardiologist',
      AppDateTime: '2019-06-16',
    },
    {
      AppType: 'Blood Test',
      DctName: 'Mike',
      FclDesc: 'Arthopedic',
      AppDateTime: '2019-06-22',
    },
    {
      AppType: 'Routine Checkup',
      DctName: 'Alexis',
      FclDesc: 'Dermotologist',
      AppDateTime: '2019-07-14',
    },
    {
      AppType: 'Blood Test',
      DctName: 'Kerr',
      FclDesc: 'Dentist',
      AppDateTime: '2019-06-24',
    },
    {
      AppType: 'BP Checkup',
      DctName: 'Elon',
      FclDesc: 'Gynaecologist',
      AppDateTime: '2019-06-21',
    },
    {
      AppType: 'Routine Checkup',
      DctName: 'Kelly',
      FclDesc: 'Gynaecologist',
      AppDateTime: '2019-06-20',
    },
    {
      AppType: 'Eear & Eye Checkup',
      DctName: 'John',
      FclDesc: 'Arthopedic',
      AppDateTime: '2019-08-24',
    },
    {
      AppType: 'Blood Test',
      DctName: 'Richard',
      FclDesc: 'Neurologist',
      AppDateTime: '2019-07-14',
    },
  ];
  public connection = {};
  public path = '';
  public PatId = '';
  public created() {
    const str = decodeURIComponent(this.$route.path).substring(1);
    // tslint:disable-next-line:no-console
    console.log('str coming', str);
    const userIndex = str.indexOf('user:') + 7;
    const pwdIndex = str.indexOf(',password:');
    const serverIndex = str.indexOf(',server:');
    const instanceIndex = str.indexOf(',instance:');
    const dbIndex = str.indexOf(',database:');
    const dbLast = str.indexOf('}');
    const patIdIndex = str.indexOf('/PatId=');

    const user = str.slice(userIndex, pwdIndex - 1);
    const password = str.slice(pwdIndex + 12, serverIndex - 1);
    const server = str.slice(serverIndex + 10, instanceIndex - 1);
    const instance = str.slice(instanceIndex + 12, dbIndex - 1);
    const database = str.slice(dbIndex + 12, dbLast - 1);
    const PatId = str.slice(patIdIndex + 8, str.length - 1);

    const obj: any = {};
    obj.user = user;
    obj.password = password;
    obj.server = server;
    obj.instance = instance;
    obj.database = database;
    this.PatId = PatId;
    this.connection = obj;
    this.path = this.$route.path;
    // Dispatching actions to set values
    this.$store.dispatch('SET_CONNECTION_ASYNC', this.connection);
    this.$store.dispatch('SET_PATH_ASYNC', this.path);
    this.$store.dispatch('SET_PATID_ASYNC', this.PatId);
  }
}
</script>
