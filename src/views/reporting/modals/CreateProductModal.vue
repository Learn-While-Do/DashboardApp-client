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
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                    {{ supplier.company_name }}
                </option>
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
                <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
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
                    <button class="confirm" :disabled="!buttonEnable" @click="addNewRecord()">CONFIRM</button>

                </div>
            </div>
        </div>
    </modal>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';

import Modal from '@/components/common/Modal.vue'

import Close_Icon from '@/assets/icons/Close_Icon.vue';


import { loadSuppliers } from '@/api/reporting/suppliers';
import { loadCategories } from '@/api/common/categories';
import { addNewProduct } from '@/api/reporting/products';
import { IProduct } from '@/models/IProduct';

import { useStore } from 'vuex';

export default defineComponent({
    components: {
        Close_Icon,
        Modal,

    },
    emits: ['close-modal'],

    setup(_, context) {

        const store = useStore()

        const buttonEnable = ref(false)

        const supplierId = ref('');
        const categoryId = ref('');
        const productName = ref('');
        const unitPrice = ref();
        const unitsInStock = ref();
        const unitsOnOrder = ref();

        const suppliers = ref()
        const categories = ref()

        watch(
            () => [
                supplierId.value,
                categoryId.value,
                productName.value,
                unitPrice.value,
                unitsInStock.value,
                unitsOnOrder.value,
            ],
            () => {
                if (supplierId.value === ''
                    || categoryId.value === ''
                    || productName.value === ''
                    || unitPrice.value === undefined
                    || unitsInStock.value === undefined
                    || unitsOnOrder.value === undefined
                    || unitPrice.value === ''
                    || unitsInStock.value === ''
                    || unitsOnOrder.value === '') {
                    buttonEnable.value = false;
                } else {
                    buttonEnable.value = true;
                }
            }
        );

        const getCategories = async () => {
            categories.value = await loadCategories();
        };
        const getSuppliers = async () => {
            suppliers.value = await loadSuppliers();
        };

        const addNewRecord = () => {
            let newProductRecord: Partial<IProduct> = {};
            newProductRecord.supplierId = supplierId.value;
            newProductRecord.categoryId = categoryId.value;
            newProductRecord.productName = productName.value;
            newProductRecord.unitPrice = unitPrice.value;
            newProductRecord.unitsInStock = unitsInStock.value;
            newProductRecord.unitsOnOrder = unitsOnOrder.value;

            addNewProduct(newProductRecord).then((responseObject) => {
                store.dispatch('productManagement/postProduct', { responseObject})
                closeModal();
            });
        };

        const closeModal = () => {
            context.emit('close-modal');
        };

        onBeforeMount(() => {
            getCategories()
            getSuppliers()

        })

        return {
            buttonEnable,
            categoryId,
            supplierId,
            productName,
            unitPrice,
            unitsInStock,
            unitsOnOrder,

            suppliers,
            categories,

            addNewRecord,
            closeModal,
        };
    },
});
</script>