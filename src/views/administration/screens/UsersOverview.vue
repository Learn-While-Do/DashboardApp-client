<template>

    <div class="body">
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Last logged</th>
                    <th>Is Admin</th>
                    <th>Is active</th>
                    <th>Require password change</th>
                    <th>Password date change </th>
                    <th>Blocked</th>                   
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in users" :key="i">
                    <td>{{ item.username }}</td>
                    <td>{{ item.first_name }}</td>
                    <td>{{ item.last_name }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.last_login ? formatDate(item.last_login) : 'Never logged'}}</td>
                    <td>{{ item.is_staff ? 'Yes' : "No"}}</td>
                    <td>{{ item.is_active ? 'Yes' : "No"}}</td>
                    <td>{{ item.required_password_change ? 'Yes' : "No" }}</td>
                    <td>{{ item.password_change_date ? formatDate(item.password_change_date) : 'Not set'}}</td>
                    <td>{{ item.is_blocked ? 'Yes' : 'No' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue';
import { useStore } from 'vuex';
import formatDate from '@/composables/util'


export default defineComponent({
 
    setup() {

        const store = useStore();
        const users = computed(() => {
            let data = store.getters['administrationManagement/getUsers'];
            if (!data) return
            return data;
        });

        return {
            users,
            formatDate
        }
    }
})
</script>

<style lang="scss" scoped></style>