<template>
    <header>
        <span class="title">User Settings</span>
    </header>
    <Tabs>
        <Tab title="Reset password">
            <reset-own-password-action></reset-own-password-action>
        </Tab>
        <Tab title="Update profile">

            <span v-if="user">
                <update-own-profile-action :user="user" v-if="!requiresReset"></update-own-profile-action>
                <p v-else>{{ NOT_AUTHORIZED }}</p>
            </span>

        </Tab>
        <Tab title="Deactivate">
            <deactivate-self-action v-if="!requiresReset"></deactivate-self-action>
            <p v-else>{{ NOT_AUTHORIZED }}</p>
        </Tab>
    </Tabs>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';

import Tab from '@/components/common/Tab.vue';
import Tabs from '@/components/common/Tabs.vue';

import ResetOwnPasswordAction from '../actions/ResetOwnPasswordAction.vue';
import UpdateOwnProfileAction from '../actions/UpdateOwnProfileAction.vue';
import DeactivateSelfAction from '../actions/DeactivateSelfAction.vue';

import { get as getFromStore } from '@/localStorage';

import { useStore } from 'vuex';


export default defineComponent({
    components: {
        DeactivateSelfAction,
        ResetOwnPasswordAction,
        Tab,
        Tabs,
        UpdateOwnProfileAction,
    },


    setup() {

        const NOT_AUTHORIZED = 'You are not authorized to see this section, you have to update your password first!'

        const requiresReset = computed(() => getFromStore('logged.requiresReset'));

        const store = useStore();

        const userId = computed(() => getFromStore("logged.id"));

        const setUser = async () => {

            return Promise.allSettled([
                store.dispatch('administrationManagement/setUser', userId.value)
            ])
        }

        const user = computed(() => { 
            let user = store.getters['administrationManagement/getUser'];
            return user;
        });

        onMounted(() => {
            setUser()
        })


        return {
            NOT_AUTHORIZED,
            requiresReset,

            user
        };
    },
});

</script>
<style lang="scss" scoped>
@import "@/styles/components/administration.scss";
</style>