<template>
    <header>
        <div class="title">
            Reporting / Orders / Details
        </div>

        <button class="button is-cancel" style="margin-right: 2.8rem;" @click="$router.go(-1)">
            <Back_Icon class="nav_icon" />
            Go back
        </button>
    </header>

    <div class="details-body">

        <div class="details-content">
            <h4 class="details-label">Customer:</h4>
            <p class="details-input-desc">{{ customer }}</p>
            <hr>
        </div>

        <div class="details-content">
            <h4 class="details-label">Product info:</h4>
            <p class="details-input-desc">{{ product }}</p>
            <hr>
        </div>


        <div class="details-content">
            <h4 class="details-label">Order date:</h4>
            <p class="details-input-desc">{{ orderDate }}</p>
            <hr>
        </div>

        <div class="details-content">
            <h4 class="details-label">Shipping info:</h4>
            <p class="details-input-desc">{{ shippingInfo }}</p>
            <hr>
        </div>

        <div class="details-content">
            <h4 class="details-label">Required shipping date</h4>
            <p class="details-input-desc">{{ requiredDate }}</p>
            <hr>
        </div>
        <div class="details-content">
            <h4 class="details-label">Supplier:</h4>
            <p class="details-input-desc">{{ supplier }}</p>
            <hr>
        </div>

        <div class="details-content">
            <h4 class="details-label">Supplier info:</h4>
            <p class="details-input-desc">{{ supplierInfo }}</p>
            <hr>
        </div>

    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router'

import { getOrderDetails } from '@/api/reporting/orders';

import Back_Icon from '@/assets/icons/Back_Icon.vue';
import formatDate from '@/composables/util'

import { useStore } from 'vuex';

export default defineComponent({
    components: {
        Back_Icon
    },
    setup() {
        const route = useRoute();
        const store = useStore();

        const customer = ref('')
        const orderDate = ref('')
        const product = ref('')
        const supplier = ref('')
        const supplierInfo = ref('')
        const shippingInfo = ref('')
        const requiredDate = ref('')

        const passedID = computed(() => {
            return route.params.id ? route.params.id as string : ''
        });

        const getDetails = async () => {

            let details = store.getters['orderManagement/getOrderDetails'];

            if(!details) {
                details = await getOrderDetails(passedID.value);
            }

            customer.value = details.customer.title + " " + details.customer.first_name + " " + details.customer.last_name
            product.value = details.product.product_name + ", " + details.product.category.name + ", " + details.product.category.description;
            shippingInfo.value = details.shipped_name + ", " + details.shipped_address + ", " + details.shipped_postal_code + ", " + details.shipped_city + ", " + details.shipped_country;
            orderDate.value = formatDate(details.order_date);
            supplier.value = details.product.supplier.contact_title + " - " + details.product.supplier.contact_name + " in " + details.product.supplier.company_name
            supplierInfo.value = "Phone: " + details.product.supplier.phone + ", " + "Email: " + details.product.supplier.email
            requiredDate.value = formatDate(details.required_date)

        }

        onBeforeMount(() => {
            getDetails()
        })
        return {
            customer,
            orderDate,
            product,
            requiredDate,
            shippingInfo,
            supplier,
            supplierInfo
        }
    }
})
</script>
