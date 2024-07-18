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

            <select v-model="productId">
                <option value="" disabled selected>Select product</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                    {{ product.product_name }}
                </option>
            </select>

            <label>
                <strong>
                    <small>
                        Customer
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>

            <select v-model="customerId">
                <option value="" disabled selected>Select customer</option>
                <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                    {{ customer.title }} - {{ customer.first_name }} {{ customer.last_name }}
                </option>
            </select>

            <label>
                <strong>
                    <small>
                        Required date
                        <span class="validation-mark">*</span>
                    </small>
                </strong>
            </label>

            <input type="date" v-model="requiredDate">

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
                    <button :disabled="!buttonEnable" class="confirm" @click="addNewRecord()">CONFIRM</button>
                </div>
            </div>
        </div>
    </modal>

</template>

<script lang="ts">
import Modal from '@/components/common/Modal.vue'

import Close_Icon from '@/assets/icons/Close_Icon.vue'

import { defineComponent, onBeforeMount, ref, watch } from 'vue'
import { loadCustomers } from '@/api/relations/customers';
import { loadProducts } from '@/api/reporting/products';
import { IOrder } from '@/models/IOrder';
import { addNewOrder } from '@/api/reporting/orders';

import { useStore } from 'vuex';

export default defineComponent({
    components: {
        Close_Icon,
        Modal
    },

    emits: ['close-modal'],

    setup(_, context) {

        const store = useStore()

        const buttonEnable = ref(false)

        const productId = ref('')
        const customerId = ref('')
        const requiredDate = ref('')
        const shippedName = ref('')
        const shippedAddress = ref('')
        const shippedCity = ref('')
        const shippedCountry = ref('')
        const shippedPostalCode = ref('')

        const customers = ref()
        const products = ref()

        watch(()=> [customerId.value, productId.value, requiredDate.value, shippedName.value,  
                    shippedAddress.value, shippedCity.value, shippedCountry.value, shippedPostalCode.value],
                    ()=> {
                        if(customerId.value === '' 
                            || productId.value === '' 
                            || requiredDate.value === '' 
                            || shippedName.value === '' 
                            || shippedAddress.value === '' 
                            || shippedCity.value === '' 
                            || shippedCountry.value === '' 
                            || shippedPostalCode.value === ''
                        ) {
                            buttonEnable.value = false
                        } else {
                            buttonEnable.value = true
                        }
                    }
                )

        const getCustomers = async () => {
            customers.value = await loadCustomers();
            
        }

        const getProducts = async () => {
            products.value = await loadProducts();
        }

        const addNewRecord = () => {
            
            let newOrderRecord: Partial<IOrder> = {}
                newOrderRecord.customerId = customerId.value;
                newOrderRecord.productId = productId.value;
                newOrderRecord.requiredDate = requiredDate.value;
                newOrderRecord.shippedName = shippedName.value;
                newOrderRecord.shippedAddress = shippedAddress.value;
                newOrderRecord.shippedCity = shippedCity.value;
                newOrderRecord.shippedCountry = shippedCountry.value;
                newOrderRecord.shippedPostalCode = shippedPostalCode.value;

                addNewOrder(newOrderRecord).then((responseObject)=> {
                   
                    store.dispatch('orderManagement/postOrder', { responseObject})
                    closeModal();
                }).catch(error => {
                    console.log('error creating object', error);  
                })
        }

        const closeModal = () => {
            context.emit('close-modal');
        }

        onBeforeMount(() => {
            getCustomers();
            getProducts();
        })

        return {
            buttonEnable,

            productId,
            customerId,
            requiredDate,
            shippedName,
            shippedAddress,
            shippedCity,
            shippedCountry,
            shippedPostalCode,

            customers,
            products,

            addNewRecord,
            closeModal

        }
    }
})

</script>