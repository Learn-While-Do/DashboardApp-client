<template>
    <div class="admin-action admin-action__small">
        <div class="admin-action__title">
            <h3>
                <b>
                    Update user's password
                </b>
            </h3>
        </div>
        <div class="admin-action__content">
            <input type="text" v-model.trim="password" placeholder="New password" @blur="validate()">
            <input type="text" v-model.trim="passwordRepeat" placeholder="Repeat password">
            <div>
                <button class="button is-primary" @click="updateUserPassword" :disabled="!buttonEnable">
                    Update
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

import { resetOwnPassword } from '@/api/admin/users';
import router from '@/router';

import { remove as removeFromStore } from '@/localStorage';
import { showNotification } from '@/composables/outlets';

export default defineComponent({

    setup() {

        const TYPE_ERROR = 'error';
        const TYPE_SUCCESS = 'success';

        const password = ref('')
        const passwordRepeat = ref('')

        const requirmentsPattern = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*\\W)');
        const charRepeatPattern = new RegExp('(.)\\1\\1');

        const buttonEnable = ref(false)

        watch(
            () => [password.value, passwordRepeat.value],
            () => {
                if (password.value === '' || passwordRepeat.value === '') {
                    buttonEnable.value = false
                } else {
                    buttonEnable.value = true
                }
            }
        )


        const notify = (message: string, type: string) => {
            showNotification({
                props: {
                    type,
                    duration: 5000,
                    message
                },
            });
        }

        const validate = () => {
            if (!requirmentsPattern.test(password.value)) {
                const message = `You need at least one uppercase letter, one lowercase letter, one number, one non-word character!`
                notify(message, TYPE_ERROR);
            }
            if (charRepeatPattern.test(password.value)) {
                const message = "You can't repeat one character more than two times in succession!"
                notify(message, TYPE_ERROR);
            }
            if (password.value.length < 8) {
                const message = 'Password needs to be at least 8 characters long!'
                notify(message, TYPE_ERROR);
            }
        }

        const updateUserPassword = async () => {
            const body = {
                new_passwd: password.value,
                confirm_passwd: passwordRepeat.value
            }

            if (password.value !== passwordRepeat.value) {
                const message = 'Passwords have to match!'
                notify(message, TYPE_ERROR);
                return;
            }

            const response = await resetOwnPassword(body);

            if (response && response.status && response.status === 200) {

                let message = response.data.response;

                notify(message, TYPE_SUCCESS);

                logout();
                router.push({
                    name: 'dashboard',
                });
            } else if (response.response.status === 403) {

                let errors = response.response.data.errors;

                errors.forEach((error: string) => {
                    notify(error.toString().replace('[', ''), TYPE_ERROR)
                });
            }
        }

        const logout = () => {
            removeFromStore('logged');
        }

        return {
            buttonEnable,
            password,
            passwordRepeat,
            updateUserPassword,
            validate

        };
    },
});

</script>
<style lang='scss' scoped>
@import "@/styles/components/administration.scss"
</style>