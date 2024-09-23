<template>
    <div class="login">
        <form @submit.prevent="login" autocomplete="off">
            <p class="login-title">Login</p>
            <div class="input">
                <label for="login_username">Username</label>
                <input type="text" placeholder="Username" v-model="input.username"/>
            </div>
            <div class="input">
                <label for="login_password">Password</label>
                <input type="password" placeholder="Password" v-model="input.password"/>
            </div>
            <button class="button is-primary" :disabled="!isValid">
                Login 
            </button>
          
        </form>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { authenticate } from '@/api/admin/users'
import { ILoginCredentials } from '@/models/ILoginCredentials';

import { save as saveToStore } from '@/localStorage';
import router from '@/router';

export default defineComponent({
    components: {},
   

    setup() {

        const input = ref({
            username: '',
            password: ''
        });

        const isValid = computed(() => {
            return Object.values(input.value).every(Boolean);
        })

     
        const login = async () => {

            const {username, password} = input.value;

            const body: ILoginCredentials = { 
                username,
                password
            }

            let response  = await authenticate(body);

            if(response !== undefined && response.status === 401) {
                console.warn('error logging', response);
            } else if (response !== undefined && response.status === 200) {

                console.info('loggin successfull!', response.data);
                
                saveToStore('logged', {
                    username: response.data.username,
                    id: response.data.id,
                    isAdmin: response.data.is_admin,
                    access_token: response.data.access,
                    requiresReset: response.data.requires_reset
                });
                router.push({
                    name: 'orders'
                })
            }
        }
        return {
            input,
            isValid,
            login,
            
        };
    },
});

</script>
<style lang='scss'>
    .login {
        background-image: url('../../../assets/login_background.jpg');
        background-size: cover;
        height: 100vh;
        width: 100%;
        overflow-y: scroll;
        display: flex;
        align-items: center;

        @include flex-v;
        min-height: 100vh;
        justify-content: center;
        align-items: center;

        >form {
            margin: 0 10%;
            padding: 30px 60px 80px;
            min-width: 480px;
            max-width: 480px;
            background-color: transparent;
            border: 1px solid #fff;
            border-radius: 20px;

            .login-title {
                margin: 10px auto 20px;
                color: #fff;
                font-size: 26px;
                font-weight: bold;
            }

            .input {
                @include flex-v;

                >label {
                    margin-bottom: 8px;
                    font-size: 22px;
                    color: #fff;
                }

                >input {
                    border-radius: 8px;
                    max-width: 440px;
                    border: 1px solid #fff;
                    color: gray;
                    width: 100%;
                    padding: 16px;
                    

                }
            }

            @include flex-v;

            @include not-last-child {
                margin-bottom: 24px;
            }

            >.button {
                padding: 16px 24px;
                border-radius: 8px;
            }

            button[disabled] {
                cursor: auto;
                opacity: .6;
                border: none;
            }

            bottom[disabled]:hover {
                background: transparent;
                color: transparent;
            }
        }
    }
</style>