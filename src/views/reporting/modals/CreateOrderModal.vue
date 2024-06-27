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
                        Product
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>

            <select>
                <option value="" disabled selected>Select product</option>
            </select>

            <label>
                <strong>
                    <small>
                        Customer
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>

            <select>
                <option value="" disabled selected>Select customer</option>
            </select>

            <label>
                <strong>
                    <small>
                        Required date
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>

            <input type="date">

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
                    <button class="confirm" @click="addNewRecord()">CONFIRM</button>
                </div>
            </div>
        </div>
    </modal>

</template>

<script lang="ts">
import Modal from '@/components/common/Modal.vue'

import Close_Icon from '@/assets/icons/Close_Icon.vue'

import { defineComponent, ref } from 'vue'

export default defineComponent({
    components: {
        Close_Icon,
        Modal
    },

    emits: ['close-modal'],

    setup(_, context) {

        const buttonEnable = ref(false)

        const productId = ref('')
        const customerId = ref('')
        const requiredDate = ref('')
        const shippedName = ref('')
        const shippedAddress = ref('')
        const shippedCity = ref('')
        const shippedCountry = ref('')
        const shippedPostalCode = ref('')

        const addNewRecord = () => {
            closeModal();
        }

        const closeModal = () => {
            context.emit('close-modal');
        }

        return {
            productId,
            customerId,
            requiredDate,
            shippedName,
            shippedAddress,
            shippedCity,
            shippedCountry,
            shippedPostalCode,

            addNewRecord,
            closeModal

        }
    }
})

</script>