<template>

    <div class="admin-action admin-action__small">
        <div class="admin-action__title">
            <h3>
                <b>
                    Delete user
                </b>
            </h3>
        </div>
        <div class="admin-action__content">
          
            <div class="single-select">
                <label>Please select a user to delete</label>
                <select v-model="userId">
                    <option v-for="(user, index) in filteredUsers" :key="index" :value="user.id">
                        {{ user.username }}
                    </option>
                </select>
            </div>

            <button :disabled="!buttonEnable" class="button is-primary" @click="deleteUser">
                Delete
            </button>

        </div>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { useStore } from 'vuex';

import { filterNoAdminUsers } from '@/composables/util'

export default defineComponent({

    setup() {
        const store = useStore();

        const userId = ref(null);

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
            () => [userId.value],
            () => {
                if (userId.value !== null) {
                    buttonEnable.value = true
                } else {
                    buttonEnable.value = false
                }
            }
        )

        const deleteUser = async () => {
            
            await store.dispatch('administrationManagement/deleteUser', { id: userId.value });
            resetDropdown()
        };

        const resetDropdown = () => {
            userId.value = null;
        }

        return {
            buttonEnable,
            filteredUsers,
            userId,
            deleteUser
        };
    },
});

</script>
<style lang="scss" scoped>
@import "@/styles/components/administration.scss";
</style>