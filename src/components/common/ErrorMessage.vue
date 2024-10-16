<template>
    <span class="wrapper">
        <Error_Icon class="icon"></Error_Icon>
        <p>{{ message }}</p>
    </span>
</template>
<script lang="ts">
import { defineComponent } from 'vue';

import Error_Icon from '@/assets/icons/Error_Icon.vue';

export default defineComponent({
    components: {
        Error_Icon
    },
    props: {
        message: {
            type: String,
            default: ''
        }
    },

    setup() {
        return {};
    },
});

</script>
<style lang='scss' scoped>
    .wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: $color-white;
        .icon {
            margin-right: 18px;
        }
        p {
            font-size: 14px;
            color: red;
        }
    }
</style>