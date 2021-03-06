import Vue from 'vue';
import Vuex from 'vuex';

// import example from './module-example'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    connectionString: {},
    path: '',
    PatId: '',
    AptList: [],
    PatientApt: [],
  },
  mutations: {
    SET_CONNECTION_STRING(state, connection) {
      state.connectionString = connection;
    },
    SET_PATH(state, path) {
      state.path = path;
    },
    SET_PATID(state, PatId) {
      state.PatId = PatId;
    },
    SET_APT_LIST(state, list) {
      state.AptList = list;
    },
  },
  actions: {
    SET_CONNECTION_ASYNC(context, connection) {
      context.commit('SET_CONNECTION_STRING', connection);
    },
    SET_PATH_ASYNC(context, path) {
      context.commit('SET_PATH', path);
    },
    SET_PATID_ASYNC(context, PatId) {
      context.commit('SET_PATID', PatId);
    },
    SET_APT_LIST_ASYNC(context, List) {
      context.commit('SET_APT_LIST', List);
    },
  },
});

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

// export default function(/* { ssrContext } */) {
//   const Store = new Vuex.Store({
//     modules: {
//       // example
//     },

//     // enable strict mode (adds overhead!)
//     // for dev mode only
//     strict: process.env.DEV,
//   });

//   return Store;
// }
