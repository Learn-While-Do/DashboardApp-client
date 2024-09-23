<template>
    <div class="admin-action admin-action__small">
        <div class="admin-action__title">
            <h3>
                <b>
                    Are you sure you want to deactivate your profile?
                </b>
            </h3>
        </div>
        <div class="admin-action__content">

            <div>
                <button class="button is-primary" @click="deactivateProfile">
                    Deactivate
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent } from 'vue';

import { deactivate } from '@/api/admin/users'

import { get as getFromStore, remove as removeFromStore } from '@/localStorage';
import router from '@/router';

export default defineComponent({


    setup() {


        const username = computed(() => getFromStore('logged.username'))
        const deactivateProfile = async () => {

            var status = confirm("Are you sure you want to do that?");

            if (status == true) {
                deactivate(username.value)
                    .then(() => {
                        removeFromStore('logged');
                        router.push({
                            name: 'dashboard',
                        });
                    })
            }
            else {
                console.log("Problems deactivation profile, try again later.");
            }
        }

        return {
            deactivateProfile,
        };
    },
});

</script>
<style lang="scss" scoped>
@import "@/styles/components/administration.scss";
</style>