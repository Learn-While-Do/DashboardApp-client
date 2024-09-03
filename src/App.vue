<template>
  <router-view v-if="logged"/>
   <login-view v-else/>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import LoginView from '@/views/user/LoginView.vue';

import { get as getFromStore, load as loadFromStore } from './localStorage';

export default defineComponent({
  components: {
    LoginView
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
