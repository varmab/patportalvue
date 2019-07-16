<template>
    <q-header elevated>
      <q-toolbar>
        <!-- <img alt="Cal-Med image" class="cpp-logo" src="~assets/cal-med-logo.png" /> -->
        <q-toolbar-title>
          Cal-Med Patient Portal
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {}
</script>

<style lang="stylus" scoped>
.cpp-logo
  width: 80px;
  height: 72px;
</style>

