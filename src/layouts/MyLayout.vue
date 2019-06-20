<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="text-capitalize">
          Calmed Patient Portal
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { Component, Mixins, Vue } from 'vue-property-decorator';

@Component
export default class MyLayout extends Vue {}
</script>
