<template>
    <header>
        <span class="title">Admin area</span>
    </header>
    <Tabs>
        <Tab title="Add new user">
            <add-user-action></add-user-action>
        </Tab>
        
        <Tab title="Delete a user">
            <delete-user-action></delete-user-action>
        </Tab>

        <Tab title="Unblock user">
          <unblock-user-action ></unblock-user-action>
        </Tab>

        <Tab title=" Update user status">
            <update-user-status-action></update-user-status-action>
        </Tab>
        <Tab title=" Update user password">
            <update-user-password-action></update-user-password-action>
        </Tab>

    </Tabs>
    <div>
        <users-overview class="users"></users-overview>
        
    </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';

import { useStore } from 'vuex';

import Tab from '@/components/common/Tab.vue';
import Tabs from '@/components/common/Tabs.vue';

import UsersOverview from './screens/UsersOverview.vue';
import AddUserAction from './actions/AddUserAction.vue';
import DeleteUserAction from './actions/DeleteUserAction.vue';
import UnblockUserAction from '@/views/administration/actions/UnblockUserAction.vue';
import UpdateUserStatusAction from '@/views/administration/actions/UpdateUserStatusAction.vue'
import UpdateUserPasswordAction from '@/views/administration/actions/UpdateUserPasswordAction.vue'


export default defineComponent({
    components: {
        AddUserAction,
        DeleteUserAction,
        Tab,
        Tabs,
        UnblockUserAction,
        UpdateUserPasswordAction,
        UpdateUserStatusAction,
        UsersOverview
    },


    setup() {
        const store = useStore();

        const updateList = async () => {
            return Promise.allSettled([
                store.dispatch('administrationManagement/setUsers')
            ])
        }

        onMounted(() => {
            updateList()
        })


        return {
           
        };
       
    },
});

</script>

<style lang="scss" scoped>
@import "@/styles/components/administration.scss";
</style>