<template>
    <modal @close="closeModal">
        <div class="modal-content">
            <div>
                <div class="header">
                    <div class="content">
                        <span class="title">Service properties</span>
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

                <select v-model="supplierIdToUpdate">
                    <option value="" disabled selected>{{ presentSupplier.company_name }}</option>
                    <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                        {{ supplier.company_name }}
                    </option>
                </select>

                <label>
                    <strong>
                        Unit price:
                    </strong>
                </label>
                <input type="number" v-model="unitPrice" />
                <label>
                    <strong>
                        Units in stock:
                    </strong>
                </label>
                <input type="number" v-model="unitsInStock" />
                <label>
                    <strong>
                        Units on order:
                    </strong>
                </label>
                <input type="number" v-model="unitsOnOrder" />

                <div class="footer">
                    <div class="content">
                        <button class="cancel" @click="closeModal();">
                            Cancel
                        </button>
                        <!--  -->
                        <button :disabled="!buttonEnable" class="confirm" @click="
                            handleUpdateProduct();
                            closeModal();"
                            >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </modal>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, reactive, ref, watch } from 'vue';

import Modal from '@/components/common/Modal.vue';

import Close_Icon from '@/assets/icons/Close_Icon.vue';

import { loadSuppliers } from '@/api/reporting/suppliers';

import { IProduct } from "@/models/IProduct";

export default defineComponent({
    components: {
        Close_Icon,
        Modal,
    },
    props: {
        product: {
            type: Object,
            required: true
        }
    },

    emits: ['close-modal', 'handle-edit'],

    setup(props, context) {


        const buttonEnable = ref(false);

        const product = ref(props.product)
        const unitPrice = ref(product.value.unit_price)
        const unitsInStock = ref(product.value.units_in_stock)
        const unitsOnOrder = ref(product.value.units_on_order)

        const supplierIdToUpdate = ref('');
        const suppliers = ref()
        const presentSupplier = reactive({ ...product.value.supplier })
  
        const closeModal = () => {
            context.emit('close-modal');
        };

        const editProduct = (editedProduct: any) => {
            context.emit('handle-edit', editedProduct);
        };

        const getSuppliers = async () => {
            suppliers.value = await loadSuppliers();
        };

        watch(
            () => [unitPrice.value, unitsInStock.value, unitsOnOrder.value, supplierIdToUpdate.value],
            () => {
                if (
                    unitPrice.value !== product.value.unit_price
                    ||
                    unitsInStock.value !== product.value.units_in_stock
                    ||
                    unitsOnOrder.value !== product.value.units_on_order
                    ||
                    presentSupplier.id !== supplierIdToUpdate.value
                ) {
                    buttonEnable.value = true;
                } else
                    if (unitPrice.value === product.value.unit_price
                        ||
                        unitsInStock.value === product.value.units_in_stock
                        ||
                        unitsOnOrder.value === product.value.units_on_order
                        ||
                        presentSupplier.id === supplierIdToUpdate.value
                    ) {
                        buttonEnable.value = false;
                    }
            }
        );

        const handleUpdateProduct = () => {

            let editedProduct: Partial<IProduct> = {
                unitPrice: unitPrice.value === '' ? 0 : unitPrice.value,
                unitsInStock: unitsInStock.value === '' ? 0 : unitsInStock.value,
                unitsOnOrder: unitsOnOrder.value === '' ? 0 : unitsOnOrder.value,
                supplierId: supplierIdToUpdate.value === '' ? presentSupplier.id : supplierIdToUpdate.value,
            }
            editProduct(editedProduct)
        };

        onBeforeMount(() => {
            getSuppliers()
        })

        return {
            buttonEnable,

            presentSupplier,
            supplierIdToUpdate,
            suppliers,
            unitPrice,
            unitsInStock,
            unitsOnOrder,

            closeModal,
            handleUpdateProduct,
        };
    },
});

</script>