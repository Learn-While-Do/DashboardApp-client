import Notification from '@/components/outlets/Notification.vue';
import { nanoid } from 'nanoid';
import { markRaw, ref } from "vue";

const outlets = ref([])

export const getOutlets = () => outlets.value;

export const showOutlet = ({component, props, ...params}: any) => {

    const outlet = {
        outlet_id: nanoid(),
        component: markRaw(component),
        props,
        ...params
    }

    outlets.value = outlets.value.concat(outlet);
}

export const hideOutlet = (outlet_id: string) => {
    outlets.value = outlets.value.filter(
        (outlet: any) => outlet.outlet_id !== outlet_id
    );
}

export const showNotification = ({props, ...params}: any) => {

    showOutlet({
        component: Notification,
        props,
        type: 'notification',
        ...params
    });
}
export const showModal = ({component, props, ...params}: any) => {

    showOutlet({
        component,
        props,
        type: 'modal',
        ...params
    });
}