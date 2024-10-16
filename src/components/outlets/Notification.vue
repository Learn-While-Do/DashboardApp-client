<template>
    <div class="notification">
        <header>
            <Success_Icon v-if="iconType === 'success'"/>
            <Info_Icon v-if="iconType === 'info'"/>
            <Error_Icon v-if="iconType === 'error'"/>
        </header>
        <div class="body">
            {{ message }}
        </div>
        <button class="close button" @click.prevent="close">
            OK
        </button>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';

import Error_Icon from '@/assets/icons/Error_Icon.vue';
import Info_Icon from '@/assets/icons/Info_Icon.vue';
import Success_Icon from '@/assets/icons/Success_Icon.vue';

import { hideOutlet } from '@/composables/outlets';

export default defineComponent({
    components: {
        Error_Icon,
        Info_Icon,
        Success_Icon
    },
    props: {
        id: {
            type: String,
            required: true
        },
        type: {
            type: String,
            default: ''
        },
        message: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            default: 3000
        }
    },

    setup(props) {
        const timer = ref();

        const close = () => {
            hideOutlet(props.id)
            timer.value && clearTimeout(timer.value)
        }

        const iconType = computed(
            () =>
            ({
                info: 'info',
                success: 'success',
                error: 'error'
            }
            [props.type])
        );

        onMounted(() => {
            timer.value = setTimeout(close, props.duration)
        })
        return {
            iconType,
            close
        };
    },
});

</script>
<style lang='scss' scoped>
@import "@/styles/components/outlets.scss";
</style>