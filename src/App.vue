<template>
  <router-view v-if="logged"/>
   <login-view v-else/>
   <outlets></outlets>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import LoginView from '@/views/user/screens/LoginView.vue';

import { get as getFromStore, load as loadFromStore } from './localStorage';

import Outlets from './components/outlets/Outlets.vue';

export default defineComponent({
  components: {
    LoginView,
    Outlets
  },
  setup() {
    const logged = computed(() => getFromStore('logged'));

    loadFromStore('logged');

    return {
      logged
    }
  }
})
</script>

<style lang="scss">
#app {
  font-family: "IBM Plex Sans", sans-serif;  
}
</style>
