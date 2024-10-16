<template>
    <div class="overlay">
        <div class="relogin">
            <h3 class="title">Your session has expired</h3>
            <div class="message">Please enter your password to continue working</div>
            <div><input type="password" class="input" ref="passwordRef" placeholder="Enter password"
                    v-model="password" /></div>
            <div class="ticking">
                <div>
                    <small>
                        You will be signed out in
                        <strong>{{ secondsLeft }}</strong>
                    </small>
                </div>
                <div>
                    <button @click="submit" :disabled="!password">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { authenticate } from '@/api/admin/users';
import { hideOutlet } from '@/composables/outlets';
import { defineComponent, onMounted, onUnmounted, ref } from 'vue';
import { save as saveToStore } from '@/localStorage';
export default defineComponent({
    props: {
        id: {
            type: String,
            required: true
        },
        loginInfo: {
            type: Object,
            required: true
        },
        onSuccess: {
            type: Function,
            required: true
        },
        onTimeout: {
            type: Function,
            required: true
        },
        onError: {
            type: Function,
            required: true
        }
    },

    setup(props) {

        const secondsLeft = ref(30);
        const password = ref('');
        const passwordRef = ref<Partial<HTMLInputElement>>('passwordRef');

        const countDown = () => {
            if (secondsLeft.value === 0) {
                timeout()
            } else {
                secondsLeft.value--;
            }
        }

        const timeout = () => {
            hideOutlet(props.id);
            props.onTimeout();
        }
        const intervalId = setInterval(countDown, 1000);

        const submit = async () => {
            const { username } = props.loginInfo;

            const body: any = {
                username,
                password: password.value
            };

            const response = await authenticate(body);

            if (response !== undefined && response.status === 401) {
                let message = `Error: ${response.data.detail}`

                await props.onError(message)
            } else if (response !== undefined && response.status === 200) {

                await saveToStore('logged', {
                    username,
                    isAdmin: response.data.is_admin,
                    access_token: response.data.access,
                    requiresReset: response.data.requires_reset,
                    id: response.data.id,
                    refresh_token: response.data.refresh
                })

                await props.onSuccess();

                clearInterval(intervalId);
                hideOutlet(props.id);
            }
        }
        onMounted(() => {
            passwordRef.value && passwordRef.value.focus!()
        })

        onUnmounted(() => {
            clearInterval(intervalId);
        })
        return {
            password,
            passwordRef,
            secondsLeft,
            submit
        };
    },
});

</script>
<style lang='scss' scoped>
@import "@/styles/components/outlets.scss";
</style>