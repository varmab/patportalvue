<template>
  <q-calendar
    v-model="selectedDate"
    view="day"
    locale="en-us"
    style="height: 400px;"
  />
</template>

<script lang="ts">
import { Component, Mixins, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DayCalendar extends Vue {
  @Prop() private selectedDate!: string;
}
</script>
