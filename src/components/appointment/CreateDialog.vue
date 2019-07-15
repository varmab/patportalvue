<template>
    <q-dialog v-model="createAptDialog" no-backdrop-dismiss>
        <q-card v-if="createAptDialog" style="width: 400px;">
        <q-toolbar class="bg-primary text-white">
            <q-toolbar-title>
            Create Appointment
            </q-toolbar-title>
            <q-btn flat round color="white" icon="close" @click="closeCreate(false)"></q-btn>
        </q-toolbar>
        <q-card-section class="inset-shadow">
            <q-form
            ref='event'
            class="q-gutter-md"
            >
            <div class="q-gutter-sm">
                <div>
                    <span class="three-dots"><span class="text-weight-light">Doctor: </span> {{DctName}}</span>
                </div>
                <div>
                <span class="three-dots"><span class="text-weight-light">Facility: </span> {{FclDesc}}</span>
                </div>
                <div>
                <span class="three-dots"><span class="text-weight-light">AppointmentType: </span> {{Type}}</span>
                </div>
                <div>
                <span class="three-dots"><span class="text-weight-light">Date/Time: </span> {{appDateTime}}</span>
                </div>
            </div>
            </q-form>
        </q-card-section>
        <q-card-actions align="right">
            <q-btn flat label="Create" color="green" @click="createAppointment()"></q-btn>
            <q-btn flat label="Cancel" color="primary"  @click="closeCreate(false)"></q-btn>
        </q-card-actions>
    </q-card>
    </q-dialog>
    
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CreateDailog extends Vue {
    @Prop({ default: false }) public readonly createAptDialog!: boolean;
    @Prop({ default: '' }) public readonly DctName!: string;
    @Prop({ default: '' }) public readonly FclDesc!: string;
    @Prop({ default: '' }) public readonly Type!: string;
    @Prop({ default: '' }) public readonly appDateTime!: string;
    public createAppointment() {
        this.$emit('createAppointment');
    }
    public closeCreate(value: any) {
        this.$emit('closeCreate', value);
    }
}
</script>
