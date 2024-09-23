<template>
    <div class="admin-action admin-action__small">
        <div class="admin-action__title">
            <h3>
                <b>
                    Reset user's password
                </b>
            </h3>
        </div>
        <div class="admin-action__content">

            <div class="single-select">
                <label>Please select a user</label>
                <select v-model="username">
                   
                    <option v-for="user in filteredUsers" :key="user.id" :value="user.username">
                        {{ user.username }}
                    </option>
                </select>
            </div>

            <input type="password" v-model="password" placeholder="New password" class="single-input"/>
            <div>
                <button :disabled="!buttonEnable" class="button is-primary" @click="resetUserPassword">
                    Reset
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

import { updateUserPassword } from "@/api/admin/admin";
import { filterNoAdminUsers } from '@/composables/util';


export default defineComponent({

    setup() {

        const store = useStore();
        const username = ref('');
        const password = ref('');

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
            () => [username.value, password.value],
            () => {
                if (username.value !== '' && password.value !== '') {
                    buttonEnable.value = true
                } else {
                    buttonEnable.value = false
                }
            }
        )

        const resetUserPassword = async () => {
            const body = {
                new_passwd: password.value,
                target_user: username.value
            };

            let status = await updateUserPassword(body);

            if (status) {
                resetDropdown()

            }

        };

        const resetDropdown = () => {
            username.value = ''
            password.value = ''
        }


        return {
            buttonEnable,
            filteredUsers,
            password,
            username,

            resetUserPassword,

        };
    },
});
</script>
<style lang="scss" scoped>
@import "@/styles/components/administration.scss";
</style>