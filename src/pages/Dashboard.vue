<template>
  <div>
    <div class="q-px-md q-py-sm q-gutter-sm">
      <q-btn color="primary" label="Schedule An Appointment" no-caps @click="$router.push('/schedule')"/>
    </div>
    <div class="q-pa-md">
      <q-table
        title="Patient Appointments"
        :data="appointments"
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
export default class PageDashboard extends Vue {
  public columns = [
    { name: 'Date', align: 'left', label: 'Date', field: 'date', sortable: true },
    { name: 'Doctor',
      required: true,
      label: 'Doctor',
      align: 'center',
      field: (row: any) => row.doctor,
      format: (val: any) => `${val}`,
      sortable: false,
    },
    { name: 'Facility', label: 'Facility', field: 'facility' },
    { name: 'Appointment Type', label: 'Appointment Type', field: 'aptType' },
  ];
  public appointments = [
    {
      aptType: 'Routine Checkup',
      doctor: 'John Doe',
      facility: 'Dermotologist',
      date: '2019-06-14',
    },
    {
      aptType: 'Vaccinations',
      doctor: 'Smith',
      facility: 'Gynaecologist',
      date: '2019-06-17',
    },
    {
      aptType: 'Eye Care',
      doctor: 'Bravo',
      facility: 'Cardiologist',
      date: '2019-06-16',
    },
    {
      aptType: 'Blood Test',
      doctor: 'Mike',
      facility: 'Arthopedic',
      date: '2019-06-22',
    },
    {
      aptType: 'Routine Checkup',
      doctor: 'Alexis',
      facility: 'Dermotologist',
      date: '2019-07-14',
    },
    {
      aptType: 'Blood Test',
      doctor: 'Kerr',
      facility: 'Dentist',
      date: '2019-06-24',
    },
    {
      aptType: 'BP Checkup',
      doctor: 'Elon',
      facility: 'Gynaecologist',
      date: '2019-06-21',
    },
    {
      aptType: 'Routine Checkup',
      doctor: 'Kelly',
      facility: 'Gynaecologist',
      date: '2019-06-20',
    },
    {
      aptType: 'Eear & Eye Checkup',
      doctor: 'John',
      facility: 'Arthopedic',
      date: '2019-08-24',
    },
    {
      aptType: 'Blood Test',
      doctor: 'Richard',
      facility: 'Neurologist',
      date: '2019-07-14',
    },
  ];
}
</script>
