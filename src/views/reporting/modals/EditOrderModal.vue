<template>
    <modal @close="closeModal">

        <div class="modal-content">
            <div class="header">
                <div class="content">
                    <span class="title">Order properties</span>
                    <Close_Icon class="icon" @click="closeModal()"></Close_Icon>
                </div>
            </div>

            <label>
                <strong>
                    <small>
                        Shipped name
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>

            <input type="text" v-model="shippedName">

            <label>
                <strong>
                    <small>
                        Shipped address
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>

            <input type="text" v-model="shippedAddress">

            <label>
                <strong>
                    <small>
                        Shipped city
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>

            <input type="text" v-model="shippedCity">

            <label>
                <strong>
                    <small>
                        Shipped country
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>

            <input type="text" v-model="shippedCountry">

            <label>
                <strong>
                    <small>
                        Shipped postal code
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>

            <input type="text" v-model="shippedPostalCode">

            <div class="footer">
                <div class="content">
                    <button class="cancel" @click="closeModal()">CANCEL</button>
                    <button :disabled="!buttonEnable" class="confirm" @click="handleUpdateOrder()">CONFIRM</button>
                </div>
            </div>
        </div>
    </modal>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

import Modal from '@/components/common/Modal.vue';
import Close_Icon from '@/assets/icons/Close_Icon.vue';
import { IOrder } from '@/models/IOrder';

export default defineComponent({
    components: {
        Close_Icon,
        Modal
    },
    props: {
        order: {
            type: Object,
            required: true
        }
    },
    emits: ['close-modal', 'handle-edit'],

    setup(props, context) {

        const buttonEnable = ref(false);

        const order = ref(props.order);

        const shippedAddress = ref(order.value.shipped_address);
        const shippedCity = ref(order.value.shipped_city);
        const shippedCountry = ref(order.value.shipped_country);
        const shippedName = ref(order.value.shipped_name);
        const shippedPostalCode = ref(order.value.shipped_postal_code);

        const closeModal = () => {
            context.emit('close-modal');
        }

        const editOrder = (editedOrder: Partial<IOrder>) => {
            context.emit('handle-edit', editedOrder);
        }

        watch(
            () => [shippedName.value, shippedAddress.value, shippedPostalCode.value, shippedCity.value, shippedCountry.value],
            () => {
                if ((shippedName.value !== '' 
                    && shippedAddress.value !== '' 
                    && shippedPostalCode.value !== ''
                    && shippedCity.value !== '' 
                    && shippedCountry.value !== '')
                    &&
                    ( shippedName.value !== order.value.shipped_name 
                    || shippedAddress.value !== order.value.shipped_address 
                    || shippedPostalCode.value !== order.value.shipped_postal_code 
                    || shippedCity.value !== order.value.shipped_city
                    || shippedCountry.value !== order.value.shipped_country )
                ) {
                    buttonEnable.value = true;
                }
                else {
                    buttonEnable.value = false;
                }
            },
        );

        const handleUpdateOrder = () => {
            let editedOrder: Partial<IOrder> = {
                shippedAddress: shippedAddress.value,
                shippedCity: shippedCity.value,
                shippedCountry: shippedCountry.value,
                shippedName: shippedName.value,
                shippedPostalCode: shippedPostalCode.value
            }
            editOrder(editedOrder)
        }

        return {
            buttonEnable,
            shippedAddress,
            shippedCity,
            shippedCountry,
            shippedName,
            shippedPostalCode,

            closeModal,
            handleUpdateOrder

        };
    },
});

</script>
<style lang=“sccs>
</style>