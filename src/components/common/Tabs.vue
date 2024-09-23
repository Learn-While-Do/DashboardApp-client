<template>
    <div class="tabs">
        <input v-for="(tab, i) in tabs" :key="i" type="radio" :id="tab" class="option"
            @click="selectedTab = tab; $emit('tabChange', tab)">
        <label v-for="(tab, i) in tabs" :key="i" :for="tab" :class="selectedTab === tab ? 'checked' : ''">{{ tab }}</label>
    </div>
    <slot></slot>
</template>
<script lang="ts">
import { defineComponent, provide, ref } from 'vue';

export default defineComponent({
    components: {},

    emits: ['tabChange'],

    setup(_, { slots }) {

        const tabs = ref(slots.default!().map((tab) => tab.props!.title))

        const selectedTab = ref(tabs.value[0])

        provide('selectedTab', selectedTab);

        return {
            selectedTab,
            tabs,
        };
    },
});

</script>
<style lang='scss' scoped>
.tabs {
    border-bottom: 1px dotted $color-4;
    margin-bottom: 24px;
    font-family: "IBM Plex Sans", sans-serif;

    .option {
        opacity: 0;
        width: 0px !important;
        margin: 16px 0;
    }

    label {
        padding: 12px 8px;
        font-family: "IBM Plex Sans", sans-serif;
        font-size: 14px;
        color: $color-3;
        opacity: .8;
        margin-right: 24px;
        cursor: pointer;
    }

    .checked {
        border-bottom: 4px solid $color-2;
        opacity: 1;
    }
}
</style>