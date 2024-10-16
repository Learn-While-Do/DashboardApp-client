
<template>
    <div class="outlets" v-if="hasOutlets">
        <section class="modals">
            <component
            v-for="outlet in modals"
            :key="outlet.outlet_id"
            :is="outlet.component"
            :id="outlet.outlet_id"
            v-bind="outlet.props"
            ></component>
        </section>
        <section class="notifications">
            <component
            v-for="outlet in notifications"
            :key="outlet.outlet_id"
            :is="outlet.component"
            :id="outlet.outlet_id"
            v-bind="outlet.props"
            ></component>
        </section>
    </div>
</template>
<script lang="ts">
import { getOutlets } from '@/composables/outlets';
import { computed, defineComponent } from 'vue';

export default defineComponent({
    
    setup() {
        const outlets = computed<any>(() => getOutlets());

        const hasOutlets = computed(() => Boolean(outlets.value.length));

        const notifications = computed(() => outlets.value.filter((outlet: any) => outlet.type === 'notification'));

        const modals = computed(() => outlets.value.filter((outlet: any) => outlet.type === 'modal'))


        return {
            hasOutlets,
            modals,
            notifications,
        };
    },
});

</script>
<style lang='scss' scoped>
@import "@/styles/components/outlets.scss";
</style>