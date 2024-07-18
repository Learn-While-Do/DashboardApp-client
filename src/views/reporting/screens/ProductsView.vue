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
                    <th>ID</th>
                    <th>Product name</th>
                    <th>Category</th>
                    <th>Unit price</th>
                    <th>Units in stock</th>
                    <th>Units on order</th>
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
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRaw } from 'vue';

import Edit_Icon from '@/assets/icons/Edit_Icon.vue';
import Trash_Icon from '@/assets/icons/Trash_Icon.vue';
import Plus_Icon from '@/assets/icons/Plus_Icon.vue';

import CreateProductModal from '../modals/CreateProductModal.vue';
import EditProductModal from '../modals/EditProductModal.vue';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal.vue'

import { useStore } from 'vuex';


import { deleteRecordsInProducts, editRecordInProducts, loadProducts } from '@/api/reporting/products';
import { IProduct } from '@/models/IProduct';

import router from '@/router';


export default defineComponent({
    components: {
        ConfirmDeleteModal,
        CreateProductModal,
        EditProductModal,
        Edit_Icon,
        Plus_Icon,
        Trash_Icon
    },

    setup() {

        const store = useStore();

        const products = computed(() => {
            let data = store.getters['productManagement/getProducts'];
            if (!data) return
            return data;
        });

        const ENTITY_TYPE = 'product';
        const entityId = ref();
        const productIdToDelete = ref('')

        const isCreateModalVisible = ref(false);
        const isEditModalVisible = ref(false);
        const isDeleteModalVisible = ref(false);

        const productIdToUpdate = ref('');
        const productToUpdate = ref();


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

        const updateList = async () => {
            return Promise.allSettled([
                store.dispatch('productManagement/setProducts', {}),
            ]);
        }

        onMounted(() => {
            if (!products.value) updateList();
        })

        return {
            ENTITY_TYPE,
            entityId,
            isCreateModalVisible,
            isDeleteModalVisible,
            isEditModalVisible,
            products,
            productToUpdate,

            handleDelete,
            handleEditRecord,
            closeModal,
            openDetails,
            openDeleteModal,
            openCreateModal,
            openEditModal,

        }
    }
})
</script>
<style lang="">

</style>