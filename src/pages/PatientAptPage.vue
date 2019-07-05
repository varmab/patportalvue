<template>
  <div>
    <div class="q-pa-md">
      <PatientAppointment />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import PatientAppointment from '../components/appointment/PatientAppointment.vue';

@Component({
  meta() {
    return {
      title: 'Patient Appointment',
    };
  },
  components: {
    PatientAppointment,
  },
})
export default class PatientAptPage extends Vue {
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
}
</script>
