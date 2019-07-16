<template>
    <q-table
    title="List Of Available Appointments"
    :data="getAvailableSlots"
    :columns="columns"
    row-key="RecNo"
    >
        <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="Action" :props="props">
                <q-btn flat label="Select" color="primary" @click='openCreateDialog(props.row)'></q-btn>
            </q-td>
            <q-td key="Date" :props="props">
                {{aptDate(props.row.appDateTime)}}
            </q-td>
            <q-td key="Facility" :props="props">
                {{props.row.FclDesc}}
            </q-td>
            <q-td key="AppointmentType" :props="props">
                {{props.row.AppType}}
            </q-td>
        </q-tr>
    </q-table> 
</template>

<script lang="ts">
import { date } from 'quasar';
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';

@Component
export default class AvailableSlotsTable extends Vue {
    @Prop({ default: [] }) public readonly getAvailableSlots!: any[];
    @Prop({ default: [] }) public readonly columns!: any[];
    @Prop({ default: '' }) public readonly FclDesc!: string;
    public openCreateDialog(row: any) {
        this.$emit('openCreateDialog', row);
    }
    public closeCreate(value: any) {
        this.$emit('closeCreate', value);
    }
    public aptDate(aptDate: any) {
        // tslint:disable-next-line:radix
        return date.formatDate(parseInt(aptDate), 'DD/MM/YY hh:mm');
    }
}
</script>
