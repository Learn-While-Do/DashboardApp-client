<template>
    <div class="admin-action">

        <div class="admin-action__title">
            <h3><b>Update your profile</b></h3>
        </div>
        <div class="admin-action__content">

            <form @submit.prevent="submitForm">
                <div>
                    <label for="username">Username</label>
                    <input required type="text" name="username" id="username" v-model.trim="username" />
                </div>
                <div>
                    <label for="firstName">First Name</label>
                    <input required type="text" name="firstName" id="firstName" v-model.trim="firstName" />
                </div>
                <div>
                    <label for="lastName">Last Name</label>
                    <input required type="text" name="lastName" id="lastName" v-model.trim="lastName" />
                </div>
                <div>
                    <label for="email">Email</label>
                    <input required type="text" name="email" id="email" v-model.trim="email" />
                </div>

                <button type="submit" class="button is-primary">
                    Save
                </button>

            </form>
        </div>
    </div>

</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'vuex';

import { get as getFromStore, load as loadFromStore, save as saveToStore } from '@/localStorage/index';


export default defineComponent({
    components: {},
    props: {
        user: {
            type: Object,
            required: true,

        },
    },

    setup(props) {

        const store = useStore();

        const username = ref(props.user.username);
        const _username = ref(props.user.username);
        const firstName = ref(props.user.first_name);
        const lastName = ref(props.user.last_name);
        const email = ref(props.user.email);

        const submitForm = async () => {

            const body = {
                username: username.value,
                first_name: firstName.value,
                last_name: lastName.value,
                email: email.value,
                _username: _username.value

            };

            let status = await store.dispatch('administrationManagement/updateOwnProfile', body);

            if (status) {
                resetForm()
                updateUI(body.username);
            }

        };

        const updateUI = (username: string) => {
            loadFromStore('logged');

            const { is_admin, access_token, refresh_token, requiresReset, id } = getFromStore('logged');
            saveToStore('logged', {
                username: username,
                id: id,
                isAdmin: is_admin,
                access_token: access_token,
                refresh_token: refresh_token,
                requiresReset: requiresReset,
            });


        }

        const resetForm = () => {
            username.value = '';
            firstName.value = '';
            lastName.value = '';
            email.value = '';
        }

        return {
            email,
            firstName,
            lastName,
            username,

            submitForm
        };
    },
});

</script>
<style lang="scss" scoped>
@import "@/styles/components/administration.scss";
</style>