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
import gql from 'graphql-tag';
import { date } from 'quasar';
import { Component, Mixins, Vue } from 'vue-property-decorator';
import { Key } from 'readline';

@Component({
  meta() {
    return {
      title: 'Patient Appointments List',
    };
  },
})
export default class Dashboard extends Vue {
  public dateTime = '';
  public columns = [
    {
      name: 'Date',
      align: 'left',
      label: 'Date',
      field: (row: any) => {
        // tslint:disable-next-line:radix
        const value = date.formatDate(parseInt(row.AppDate), 'DD-MM-YYYY');
        this.dateTime = value + ' ' + row.AppTime;
        return this.dateTime;
      },
      format: (val: any) => `${val}`,
      sortable: true,
    },
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
  public patientAppointmentsList = [];
  public connection = {};
  public path = '';
  public PatId = {};
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
    const patid = {PatId};
    this.PatId = patid;
    this.connection = obj;
    this.path = this.$route.path;
    // Dispatching actions to set values
    this.$store.dispatch('SET_CONNECTION_ASYNC', this.connection);
    this.$store.dispatch('SET_PATH_ASYNC', this.path);
    this.$store.dispatch('SET_PATID_ASYNC', this.PatId);
  }
   public mounted() {
     console.log('mount called');
     this.getPatAptList();
  }

  public getPatAptList() {
    this.$q.loading.show({
        message: 'Please wait while loading..',
      });
    this.$apollo.query({
      query: gql`query patientAppointmentsList($connection: ConnectionInput, $PatId: PatIdInput) {
        patientAppointmentsList(connection: $connection, PatId: $PatId) {
          RecNo
          PatId
          DctId
          FclId
          DctName
          FclDesc
          Duration
          AppType
          AppDate
          AppTime
          EntryDateTime
        }
      }`,
      // Parameters
      variables: {
        connection: this.connection,
        PatId: this.PatId,
      },
    }).then((data: any) => {
        this.patientAppointmentsList = data.data.patientAppointmentsList;
        this.$store.dispatch('SET_APT_LIST_ASYNC', this.patientAppointmentsList);
        this.$q.loading.hide();
      }).catch((error: any) => {
          this.$q.loading.hide();
          // tslint:disable-next-line:no-console
          console.error('error in get patient appointment list: ', error);
      });
  }
}
</script>
