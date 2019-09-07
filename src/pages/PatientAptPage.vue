<template>
  <div>
    <div class="q-pa-md">
      <PatientAppointment />
    </div>
  </div>
</template>

<script lang="ts">
import CryptoJS from 'crypto-js';
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
    // decoding the encoded connection string
    const decoded = decodeURIComponent(this.$route.params.connection);
    // decrypting the decoded string
    const bytes  = CryptoJS.AES.decrypt(decoded.toString(), 'Calmed');
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // preparing obj of connection string for api calls
    const obj: any = {};
    obj.user = decrypted.userName;
    obj.password = decrypted.password;
    obj.server = decrypted.server;
    obj.instance = decrypted.instance ? decrypted.instance : '';
    obj.database = decrypted.database;

    this.path = this.$route.path;
    this.connection = obj;
    const PatId = this.$route.params.PatId;
    const patid = {PatId};
    this.PatId = patid;
    // Dispatching actions to set values
    this.$store.dispatch('SET_CONNECTION_ASYNC', this.connection);
    this.$store.dispatch('SET_PATH_ASYNC', this.path);
    this.$store.dispatch('SET_PATID_ASYNC', this.PatId);
  }
}
</script>
