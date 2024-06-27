<template>
    <modal @close="closeModal">
        <div class="modal-content">
            <div class="header">
                <div class="content">
                    <span class="title">Product properties</span>
                    <Close_Icon class="icon" @click="closeModal()"></Close_Icon>
                </div>
            </div>
            <label>
                <strong>
                    <small>
                        Supplier
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <select v-model="supplierId">
                <option value="" disabled selected>Select Supplier</option>
            </select>
            <label>
                <strong>
                    <small>

                        Category
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <select v-model="categoryId">
                <option value="" disabled selected>Select Category</option>
            </select>
            <label>
                <strong>
                    <small>
                        Product Name

                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="text" v-model="productName" />
            <label>
                <strong>
                    <small>
                        Unit Price
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="number" v-model="unitPrice" />
            <label>
                <strong>
                    <small>
                        Units on order
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="number" v-model="unitsOnOrder" />
            <label>
                <strong>
                    <small>
                        Units in Stock
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>
            <input type="number" v-model="unitsInStock" />

            <div class="footer">
                <div class="content">
                    <button class="cancel" @click="closeModal()">CANCEL</button>
                    <button class="confirm" disabled @click="addNewRecord()">CONFIRM</button>

                </div>
            </div>
        </div>
    </modal>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import Modal from '@/components/common/Modal.vue'

import Close_Icon from '@/assets/icons/Close_Icon.vue';


export default defineComponent({
    components: {
        Close_Icon,
        Modal,

    },
    emits: ['close-modal'],

    setup(_, context) {

        const buttonEnable = ref(false)

        const supplierId = ref('');
        const categoryId = ref('');
        const productName = ref('');
        const unitPrice = ref();
        const unitsInStock = ref();
        const unitsOnOrder = ref();

        const addNewRecord = () => {
            closeModal();
        };

        const closeModal = () => {
            context.emit('close-modal');
        };

        return {
            buttonEnable,
            categoryId,
            supplierId,
            productName,
            unitPrice,
            unitsInStock,
            unitsOnOrder,

            addNewRecord,
            closeModal,
        };
    },
});
</script>