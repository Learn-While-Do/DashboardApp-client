<template>
    <header>
        <span class="title">
            Reporting / Products
        </span>
        <button class="button is-primary is-on-header" @click="openCreateModal">
            <Plus_Icon class="nav_icon" />
            New product
        </button>
    </header>

    <div class="filters">

        <div class="filter-wrapper">
            <p>Supplier:</p>
            <select v-model="filteredCompany">
                <option value="" disabled selected>All suppliers</option>
                <option v-for="(supplier, i) in suppliers" :key="i" :value="supplier.company_name">
                    {{ supplier.company_name }}
                </option>
            </select>
        </div>

        <div class="filter-wrapper">
            <p>Unit price:</p>
            <select v-model="filteredPrice">
                <option value="" disabled selected>All prices</option>
                <option v-for="(price, i) in prices" :key="i" :value="price">
                    {{ price }}</option>

            </select>
        </div>

        <div class="filter-wrapper">
            <p>Search:</p>
            <input type="text" v-model="search" placeholder="Search (product or supplier)" @keyup.enter="filterList">
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

    <create-product-modal v-if="isCreateModalVisible" @close-modal="closeModal">
    </create-product-modal>

    <edit-product-modal v-if="isEditModalVisible" @close-modal="closeModal" :product="productToUpdate"
        @handle-edit="handleEditRecord">
    </edit-product-modal>

    <confirm-delete-modal v-if="isDeleteModalVisible" :entity-type="ENTITY_TYPE" :entity-id="entityId"
        @close-modal="closeModal" @handle-delete="handleDelete"></confirm-delete-modal>

    <div>
        <table>
            <thead>
                <tr>
                    <th @click="setSortingBy(ORDER_BY_ID)">ID
                        <Sorting_Icon :class="orderBy === ORDER_BY_ID ? 'active-sorting' : ''" class="sorting-icon" />
                    </th>
                    <th>Product name</th>
                    <th>Category</th>
                    <th @click="setSortingBy(ORDER_BY_UNIT_PRICE)">
                        Unit price
                        <Sorting_Icon :class="orderBy === ORDER_BY_UNIT_PRICE ? 'active-sorting' : ''"
                            class="sorting-icon" />
                    </th>
                    <th @click="setSortingBy(ORDER_BY_UNITS_IN_STOCK)">
                        Units in stock
                        <Sorting_Icon :class="orderBy === ORDER_BY_UNITS_IN_STOCK ? 'active-sorting' : ''"
                            class="sorting-icon" />
                    </th>
                    <th @click="setSortingBy(ORDER_BY_UNITS_ON_ORDER)">
                        Units on order
                        <Sorting_Icon :class="orderBy === ORDER_BY_UNITS_ON_ORDER ? 'active-sorting' : ''"
                            class="sorting-icon" />
                    </th>
                    <th>Supplier</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, i) in products" :key="i" @click="openDetails(item)">
                    <td>{{ item.id }}</td>
                    <td>{{ item.product_name }}</td>
                    <td>{{ item.category.name }}</td>
                    <td>{{ item.unit_price }}</td>
                    <td>{{ item.units_in_stock }}</td>
                    <td>{{ item.units_on_order }}</td>
                    <td>{{ item.supplier.company_name }}</td>
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
            :count="count" @update-page="updatePage" @update-table-size="updateTableSize">
        </pagination>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRaw } from 'vue';

import Edit_Icon from '@/assets/icons/Edit_Icon.vue';
import Trash_Icon from '@/assets/icons/Trash_Icon.vue';
import Plus_Icon from '@/assets/icons/Plus_Icon.vue';
import Sorting_Icon from '@/assets/icons/Sorting_Icon.vue';

import CreateProductModal from '../modals/CreateProductModal.vue';
import EditProductModal from '../modals/EditProductModal.vue';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal.vue';
import Pagination from '@/components/common/Pagination.vue';

import { useStore } from 'vuex';

import { deleteRecordsInProducts, editRecordInProducts } from '@/api/reporting/products';
import { IProduct } from '@/models/IProduct';

import router from '@/router';

import { loadProductPrices } from '@/api/common/productPrices';
import { extractValues } from '@/composables/util';
import { loadSuppliers } from '@/api/common/suppliers';


export default defineComponent({
    components: {
        ConfirmDeleteModal,
        CreateProductModal,
        EditProductModal,
        Edit_Icon,
        Pagination,
        Plus_Icon,
        Sorting_Icon,
        Trash_Icon
    },

    setup() {

        const ORDER_BY_ID = 'id';
        const ORDER_BY_UNITS_IN_STOCK = 'units_in_stock';
        const ORDER_BY_UNITS_ON_ORDER = 'units_on_order';
        const ORDER_BY_UNIT_PRICE = 'unit_price';

        const store = useStore();

        const products = computed(() => {
            let data = store.getters['productManagement/getProducts'];
            if (!data) return
            return data;
        });

        const search = ref()
        const prices = ref();
        const suppliers = ref();
        const filteredPrice = ref();
        const filteredCompany = ref();

        const ENTITY_TYPE = 'product';
        const entityId = ref();
        const productIdToDelete = ref('')

        const isCreateModalVisible = ref(false);
        const isEditModalVisible = ref(false);
        const isDeleteModalVisible = ref(false);

        const productIdToUpdate = ref('');
        const productToUpdate = ref();

        const orderBy = ref('id');


        const perPage = ref(5);
        const currentPage = ref(1);
        const numberOfPages = computed(() => {
            const data = store.getters['paginationManagement/getNumberOfPages'];
            return Number(data);
        });
        const count = computed(() => {
            const data = store.getters['paginationManagement/getCount'];
            return Number(data);
        });

        const updatePage = (page: number) => {
            currentPage.value = page;
            updateList();
        };


        const updateTableSize = (pageSize: any) => {
            perPage.value = pageSize.value;
            currentPage.value = 1;
            updateList();
        };

        const updateList = async () => {
            let data: any = await Promise.allSettled([
                store.dispatch('productManagement/setProducts', {
                    filteredCompany: filteredCompany.value,
                    filteredPrice: filteredPrice.value,
                    search: search.value,
                    order_by: orderBy.value,
                    per_page: perPage.value,
                    page: currentPage.value,
                }),
            ]);
            let paginationInfo = data[0].value

            store.dispatch('paginationManagement/setNumberOfPages', paginationInfo.number_of_pages);
            store.dispatch('paginationManagement/setCount', paginationInfo.count);
            return data;
        };


        const setDataForDetailsPage = (item: IProduct) => {
            return store.dispatch('productManagement/setProductDetails', {
                ...item,
            });
        };

        const openDetails = (item: IProduct) => {
            let id = item.id
            setDataForDetailsPage(item);
            router.push({
                name: 'product-details',
                params: {
                    id,
                }
            })
        }

        const openCreateModal = () => {
            isCreateModalVisible.value = true;
        };

        const openEditModal = (id: string) => {
            productIdToUpdate.value = id;
            productToUpdate.value = toRaw(products.value).find((x: any) => x.id === id)
            isEditModalVisible.value = true;
        }

        const openDeleteModal = (id: string) => {
            entityId.value = id;
            isDeleteModalVisible.value = true;
            productIdToDelete.value = id;
        }

        const closeModal = () => {
            isCreateModalVisible.value = false;
            isEditModalVisible.value = false;
            isDeleteModalVisible.value = false;
        };


        const handleEditRecord = (editedproduct: any) => {
            isEditModalVisible.value = false;

            let id = productIdToUpdate.value;

            editRecordInProducts(
                productIdToUpdate.value,
                editedproduct)
                .then(() => {
                    closeModal();
                    store.dispatch('productManagement/updateProduct', { editedproduct, id })
                    productIdToUpdate.value = '';
                });
        };

        const handleDelete = () => {
            isDeleteModalVisible.value = false;
            deleteRecordsInProducts(productIdToDelete.value)
                .then(() => {
                    return store.dispatch('productManagement/deleteProduct', productIdToDelete.value)
                })
                .catch(error => {
                    console.log('error deleting product', error);
                })
        }

        const getProductPrices = async () => {
            let data: any = await loadProductPrices();
            prices.value = extractValues(data);

        }

        const getSuppliers = async () => {
            suppliers.value = await loadSuppliers();
        }

        const setSortingBy = (ordering: string) => {
            orderBy.value = ordering;
            updateList();
        }

        const filterList = () => {

            updateList()
        }

        const refreshList = () => {
            window.location.reload()
        }



        onMounted(() => {

            updateList();
            getProductPrices()
            getSuppliers()
        })

        return {

            ENTITY_TYPE,
            ORDER_BY_ID,
            ORDER_BY_UNITS_IN_STOCK,
            ORDER_BY_UNITS_ON_ORDER,
            ORDER_BY_UNIT_PRICE,

            currentPage,
            count,
            entityId,
            filteredPrice,
            filteredCompany,
            isCreateModalVisible,
            isDeleteModalVisible,
            isEditModalVisible,
            numberOfPages,
            orderBy,
            perPage,
            prices,
            products,
            productToUpdate,
            search,
            suppliers,

            filterList,
            refreshList,
            handleDelete,
            handleEditRecord,
            closeModal,
            openDetails,
            openDeleteModal,
            openCreateModal,
            openEditModal,
            setSortingBy,
            updatePage,
            updateTableSize,

        }
    }
})
</script>
<style lang="">

</style>