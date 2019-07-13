<template>
  <div>
    <div class="q-pa-md">
      <q-table
        title="List Of Pending Appointments"
        :data="patientAppointment"
        :columns="columns"
        row-key="name"
      >
      <template slot="col-action" slot-scope="props">
        <q-btn flat label="Cancel" color="primary" @click='CancelClicked(props)'></q-btn>
      </template>
      </q-table>
    </div>
    <div class="q-px-md q-py-sm q-gutter-sm text-center">
      <q-btn color="primary" label="Make New Appointment" no-caps @click="$router.push('/schedule')"/>
    </div>
  </div>
  
</template>

<script lang="ts">
import gql from 'graphql-tag';
import { date } from 'quasar';
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';

@Component
export default class PatientAppointment extends Vue {
  public dateTime = '';
  public columns = [
    {
      name: 'Date',
      align: 'left',
      label: 'Date/Time',
      field: (row: any) => {
        // tslint:disable-next-line:radix
        const value = date.formatDate(parseInt(row.AppDateTime), 'DD/MM/YY hh:mm');
        return value;
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
    {
      label: '',
      field: 'action',
      align: 'center',
    },
  ];
  public patientAppointment = [];
  public connection = {};
  public path = '';
  public PatId = {};

  public CancelClicked(row: any) {
    console.log('hellooo its working', row);
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
        this.$q.loading.hide();
        if (patientAppointment.length) {
          this.patientAppointment = patientAppointment;
          // this.appDateTime = patientAppointment[0].AppDateTime;
        } else {
          // this.$router.push()
        }
      }).catch((error: any) => {
        this.$q.loading.hide();
        // tslint:disable-next-line:no-console
        console.error('error in get patient appointment: ', error);
      });
  }
}
</script>