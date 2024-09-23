<template>
    <div class="admin-action admin-action__small">
        <div class="admin-action__title">
            <h3>
                <b>
                    Update user activity status
                </b>
            </h3>
        </div>
        <div class="admin-action__content">
            
            <div class="single-select">
                <label>Please select a user to update</label>
                <select v-model="username">
                    <option v-for="user in filteredUsers" :key="user.id" :value="user.username">
                        {{ user.username }} - {{ user.is_active ? 'Active' : 'Not active' }}
                    </option>
                </select>
            </div>

            <button :disabled="!buttonEnable" class="button is-primary" @click="updateUserStatus">
                Update status
            </button>

        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

import { filterNoAdminUsers } from '@/composables/util';

export default defineComponent({

    setup() {

        const store = useStore();

        const username = ref('');

        const users = computed(() => {
            let data = store.getters['administrationManagement/getUsers'];
            if (!data) return
            return data;
        });

        const filteredUsers = computed(() => {
            let filteredData = filterNoAdminUsers(users.value);
            return filteredData;
        });
        const buttonEnable = ref(false);

        watch(
            () => [username.value],
            () => {
                if (username.value !== '') {
                    buttonEnable.value = true
                }
            }
        )

        const updateUserStatus = async () => {

            const userStatus = filteredUsers.value.find(user => user.username === username.value)?.is_active;

            let body = {
                username: username.value,
                is_active: !userStatus
            }

            let status = await store.dispatch('administrationManagement/updateUserStatus', body);

            if (status) {
                resetDropdown()
            }
        };

        const resetDropdown = () => {
            username.value = '';
        }

        return {
            buttonEnable,
            filteredUsers,
            username,

            updateUserStatus
        };
    },
});
</script>
<style lang="scss" scoped>
@import "@/styles/components/administration.scss";
</style>