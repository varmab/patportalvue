<template>
  <div>
    <div class="q-pa-md">
      <q-table
        title="List Of Pending Appointments"
        :data="patientAppointment"
        :columns="columns"
        row-key="name"
      >
      <q-tr slot="body" slot-scope="props" :props="props">
        <q-td key="Date" :props="props">
          {{aptDate(props.row.AppDateTime)}}
        </q-td>
        <q-td key="Doctor" :props="props">
          {{props.row.DctName}}
        </q-td>
        <q-td key="Facility" :props="props">
          {{props.row.FclDesc}}
        </q-td>
        <q-td key="AppointmentType" :props="props">
          {{props.row.AppType}}
        </q-td>
        <q-td key="Action" :props="props">
          <q-btn flat label="Cancel" color="primary" @click='openCancelDialog(props.row)'></q-btn>
        </q-td>
      </q-tr>
      </q-table>
    </div>
    <div class="q-px-md q-py-sm q-gutter-sm text-center">
      <q-btn color="primary" label="Make New Appointment" no-caps @click="$router.push('/schedule')"/>
    </div>
    <q-dialog v-model="confirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Are you sure you want to cancel the current appointment and schedule new appointment?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="No" color="red" v-close-popup @click="showApt = true"/>
          <q-btn flat label="Sure, Schedule new" color="primary" v-close-popup @click="cancelPatApt()"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
  
</template>

<script lang="ts">
import gql from 'graphql-tag';
import { date } from 'quasar';
import { Component, Mixins, Vue, Watch } from 'vue-property-decorator';

@Component
export default class PatientAppointment extends Vue {
  public cancelApt: any = [];
  public confirm = false;
  public dateTime = '';
  public columns = [
    {
      name: 'Date',
      align: 'left',
      label: 'Date/Time',
      field: (row: any) => row.AppDateTime,
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
    { name: 'AppointmentType', label: 'Appointment Type', field: 'AppType' },
    {
      name: 'Action',
      field: 'action',
      align: 'center',
    },
  ];
  public patientAppointment = [];
  public connection = {};
  public path = '';
  public PatId = {};

  public aptDate(aptDate: any) {
    // tslint:disable-next-line:radix
    return date.formatDate(parseInt(aptDate), 'DD/MM/YY hh:mm');
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
        if (patientAppointment.length > 0) {
          this.patientAppointment = patientAppointment;
        } else {
          this.$router.push('/schedule');
        }
      }).catch((error: any) => {
        this.$q.loading.hide();
        // tslint:disable-next-line:no-console
        console.error('error in get patient appointment: ', error);
      });
  }

  public openCancelDialog(appointment: any) {
    this.cancelApt = appointment;
    this.confirm = true;
  }

  public cancelPatApt() {
    const appointment = this.cancelApt;
    const deleteAptObj = {
        // tslint:disable-next-line:radix
      AppDateTime: date.formatDate(parseInt(appointment.AppDateTime), 'YYYY-MM-DD hh:mm:ss'),
      PatId: appointment.PatId,
    };
    // tslint:disable-next-line:no-console
    console.log('deleteAptObj', deleteAptObj);
    this.confirm = false;
    this.$q.loading.show({
      message: 'Cancelling your next appointment',
    });
    this.$apollo.mutate({
      // Query
      mutation: gql`mutation ($connection: ConnectionInput, $appointment: DeletePatAptInput) {
        deletePatApt(connection: $connection, appointment: $appointment) {
          message
        }
      }`,
      // Parameters
      variables: {
        appointment: deleteAptObj,
        connection: this.connection,
      },
    }).then((data: any) => {
      this.$q.loading.hide();
      // tslint:disable-next-line:no-console
      console.log('appointment deleted sussessfully', data);
      this.$q.notify({
        color: 'green-4',
        textColor: 'white',
        icon: 'fas fa-check-circle',
        message: 'Appointment Cancelled successfully!',
      });
      this.$router.push('/schedule');
    }).catch((error: any) => {
      this.$q.loading.hide();
      // tslint:disable-next-line:no-console
      console.error('error in delete apt apt api call: ', error);
    });
  }

}
</script>