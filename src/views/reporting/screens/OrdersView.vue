<template>

    <header>
        <span class="title">
            Reporting / Orders
        </span>
        <button class="button is-primary is-on-header" @click="openCreateModal">
            <Plus_Icon class="nav_icon" />
            New order
        </button>
    </header>

    <div class="filters">

        <div class="filter-wrapper">
            <p>Shipped country:</p>
            <select v-model="filteredCountry">
                <option value="" disabled selected>All countries</option>
                <option v-for="(country, i) in countries" :key="i" :value="country">
                    {{ country }}
                </option>
            </select>
        </div>

        <div class="filter-wrapper">
            <p>Shipped city:</p>
            <select v-model="filteredCity">
                <option value="" disabled selected>All cities</option>
                <option v-for="(city, i) in cities" :key="i" :value="city">
                    {{ city }}</option>

            </select>
        </div>
        <div class="filter-wrapper">
            <p>Search:</p>
            <input type="text" v-model="search" placeholder="Search (product or customer)" @keyup.enter="filterList">
        </div>

        <div class="filter-wrapper">
            <p>Filter:</p>
            <button id="filter" class="filters_button" @click="filterList">Filter</button>
        </div>

        <div class="filter-wrapper">
            <p>Refresh:</p>
            <button id="refresh" class="filters_button" @click="refreshList">Refresh</button>
        </div>


    </div>

    <create-order-modal v-if="isCreateModalVisible" @close-modal="closeModal"></create-order-modal>

    <edit-order-modal v-if="isEditModalVisible" @close-modal="closeModal" :order="orderToUpdate"
        @handle-edit="handleEdit"></edit-order-modal>

    <confirm-delete-modal v-if="isDeleteModalVisible" :entity-type="ENTITY_TYPE" :entity-id="entityId"
        @close-modal="closeModal" @handle-delete="handleDelete"></confirm-delete-modal>

    <div>
        <table>
            <thead>
                <tr>
                    <th @click="setSortingBy(ORDER_BY_ID)">ID
                        <Sorting_Icon :class="orderBy === ORDER_BY_ID ? 'active-sorting' : ''" class="sorting-icon" />
                    </th>
                    <th @click="setSortingBy(ORDER_BY_DATE)">Order date
                        <Sorting_Icon :class="orderBy === ORDER_BY_DATE ? 'active-sorting' : ''" class="sorting-icon" />
                    </th>
                    <th>Customer name</th>
                    <th>Product name</th>
                    <th>Required date</th>
                    <th>Shipped name</th>
                    <th>Shipped address</th>
                    <th>Shipped city</th>
                    <th>Shipped postal code</th>
                    <th>Shipped country</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in orders" :key="i" @click="openDetails(item)">
                    <td>{{ item.id }}</td>
                    <td>{{ formatDate(item.order_date) }}</td>
                    <td>{{ item.customer.last_name }}</td>
                    <td>{{ item.product.product_name }}</td>
                    <td>{{ formatDate(item.required_date) }}</td>
                    <td>{{ item.shipped_name }}</td>
                    <td>{{ item.shipped_address }}</td>
                    <td>{{ item.shipped_city }}</td>
                    <td>{{ item.shipped_postal_code }}</td>
                    <td>{{ item.shipped_country }}</td>
                    <td>
                        <span>
                            <Edit_Icon class="table_icon" @click.stop @click="openEditModal(item.id)" />
                        </span>
                        <span>
                            <Trash_Icon class="table_icon__left" @click.stop @click="openDeleteModal(item.id)" />
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
        <pagination v-if="count > 0" :current-page="currentPage" :per-page="perPage" :number-of-pages="numberOfPages"
            :count="count" @update-page="updatePage" @update-table-size="updateTableSize"></pagination>
    </div>
</template>
<script lang="ts">

import formatDate, { extractValues } from '@/composables/util';

import { deleteRecordsInOrders, editRecordInOrders } from '@/api/reporting/orders';

import { computed, defineComponent, onMounted, ref, toRaw } from 'vue';

import Edit_Icon from '@/assets/icons/Edit_Icon.vue';
import Plus_Icon from '@/assets/icons/Plus_Icon.vue';
import Sorting_Icon from '@/assets/icons/Sorting_Icon.vue';
import Trash_Icon from '@/assets/icons/Trash_Icon.vue';

import Pagination from '@/components/common/Pagination.vue';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal.vue';
import CreateOrderModal from '../modals/CreateOrderModal.vue';
import EditOrderModal from '../modals/EditOrderModal.vue';

import { loadCities } from '@/api/common/cities';
import { loadCountries } from '@/api/common/countries';
import { IOrder } from '@/models/IOrder';
import router from '@/router';
import { useStore } from 'vuex';

export default defineComponent({

    components: {
        ConfirmDeleteModal,
        CreateOrderModal,
        EditOrderModal,
        Edit_Icon,
        Pagination,
        Plus_Icon,
        Sorting_Icon,
        Trash_Icon
    },

    setup() {

        const ORDER_BY_ID = 'id';
        const ORDER_BY_DATE = 'order_date';

        const store = useStore()

        const orders = computed(() => {
            let data = store.getters['orderManagement/getOrders']
            if (!data) return
            return data;
        })

        const search = ref()
        const countries = ref();
        const cities = ref();
        const filteredCountry = ref();
        const filteredCity = ref();

        const ENTITY_TYPE = 'order';
        const entityId = ref();
        const orderIdToDelete = ref('')

        const isCreateModalVisible = ref(false);
        const isEditModalVisible = ref(false);
        const isDeleteModalVisible = ref(false);

        const orderIdToUpdate = ref('');
        const orderToUpdate = ref();

        const orderBy = ref('id');

        const currentPage = ref(1);
        const perPage = ref(5);

        const numberOfPages = computed(() => {
            const data = store.getters['paginationManagement/getNumberOfPages'];
            return Number(data);
        });

        const count = computed(() => {
            const data = store.getters['paginationManagement/getCount'];
            return Number(data);
        });

        const updatePage = (page: any) => {
            currentPage.value = page;
            updateList();
        }

        const updateTableSize = (pageSize: any) => {
            perPage.value = pageSize.value;
            currentPage.value = 1;
            updateList();
        }

        const openDetails = (item: IOrder) => {
            let id = item.id;
            setDataForDetailsPage(item);
            router.push({
                name: 'order-details',
                params: {
                    id
                }
            })
        }

        const setDataForDetailsPage = (item: IOrder) => {
            return store.dispatch('orderManagement/setOrderDetails', {
                ...item
            })
        }

        const openCreateModal = () => {
            isCreateModalVisible.value = true;
        }

        const openEditModal = (id: string) => {
            orderIdToUpdate.value = id;
            orderToUpdate.value = toRaw(orders.value).find((x: any) => x.id === id);
            isEditModalVisible.value = true;
        }

        const openDeleteModal = (id: string) => {
            entityId.value = id;
            isDeleteModalVisible.value = true;
            orderIdToDelete.value = id;
        }

        const closeModal = () => {
            isCreateModalVisible.value = false;
            isEditModalVisible.value = false;
            isDeleteModalVisible.value = false;
        }

        const setSortingBy = (ordering: string) => {
            orderBy.value = ordering;
            updateList();
        }

        const filterList = () => {
            currentPage.value = 1
            updateList()
        }

        const refreshList = () => {
            window.location.reload();
        }

        const getCountries = async () => {
            let data: any = await loadCountries();
            countries.value = extractValues(data);
        }

        const getCities = async () => {
            let data: any = await loadCities();
            cities.value = extractValues(data);
        }

        const updateList = async () => {

            let data: any = await Promise.allSettled([
              
                store.dispatch('orderManagement/setOrders', {
                    filteredCountry: filteredCountry.value,
                    filteredCity: filteredCity.value,
                    search: search.value,
                    per_page: perPage.value,
                    page: currentPage.value,
                    order_by: orderBy.value,
                }),
            ]);

            let paginationInfo = data[0].value
            store.dispatch('paginationManagement/setNumberOfPages', paginationInfo.number_of_pages);
            store.dispatch('paginationManagement/setCount', paginationInfo.count);
            
            return data;
        }

        const handleEdit = (editedOrder: any) => {
            isEditModalVisible.value = false;

            let id = orderIdToUpdate.value;

            editRecordInOrders(orderIdToUpdate.value, editedOrder)
                .then(() => {
                    closeModal();

                    store.dispatch('orderManagement/updateOrder', { editedOrder, id })
                    orderIdToUpdate.value = '';
                })
        }

        const handleDelete = () => {
            isDeleteModalVisible.value = false;
            deleteRecordsInOrders(orderIdToDelete.value).then(() => {

                return store.dispatch('orderManagement/deleteOrder', orderIdToDelete.value);
            }).catch((error) => {
                console.log(error);
            })
        }

        onMounted(() => {
            updateList();
            getCities();
            getCountries();
        })

        return {

            ENTITY_TYPE,
            ORDER_BY_ID,
            ORDER_BY_DATE,

            cities,
            count,
            countries,
            currentPage,
            entityId,
            filteredCity,
            filteredCountry,
            isCreateModalVisible,
            isDeleteModalVisible,
            isEditModalVisible,
            numberOfPages,
            orderBy,
            orders,
            orderToUpdate,
            perPage,
            search,

            closeModal,
            filterList,
            formatDate,
            handleDelete,
            handleEdit,
            openCreateModal,
            openDetails,
            openDeleteModal,
            openEditModal,
            refreshList,
            setSortingBy,
            updatePage,
            updateTableSize
        }
    }
})
</script>
<style lang="scss">

</style>