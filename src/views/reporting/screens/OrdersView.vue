<template>

    <header>
        <span class="title">
            Reporting / Orders
        </span>
        <button class="button is-primary is-on-header" @click="openCreateModal">
            <Plus_Icon class="nav_icon"/>
            New order
        </button>
    </header>

    <create-order-modal v-if="isCreateModalVisible" @close-modal="closeModal" @update-list="updateList"></create-order-modal>

    <edit-order-modal v-if="isEditModalVisible" @close-modal="closeModal" :order="orderToUpdate" @handle-edit="handleEdit"></edit-order-modal>

    <confirm-delete-modal v-if="isDeleteModalVisible" :entity-type="ENTITY_TYPE" :entity-id="entityId" @close-modal="closeModal"
    @handle-delete="handleDelete"></confirm-delete-modal>

    <div>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Order date</th>
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
                <tr v-for="(item, i) in orders" :key="i">
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
                            <Edit_Icon class="table_icon" @click="openEditModal(item.id)"/>
                        </span>
                        <span>
                            <Trash_Icon class="table_icon__left" @click="openDeleteModal(item.id)"/>
                         </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script lang="ts">

import formatDate from '@/composables/util';

import { deleteRecordsInOrders, editRecordInOrders, loadOrders } from '@/api/reporting/orders';

import { defineComponent, onMounted, ref, toRaw } from 'vue'

import Edit_Icon from '@/assets/icons/Edit_Icon.vue';
import Trash_Icon from '@/assets/icons/Trash_Icon.vue';
import Plus_Icon from '@/assets/icons/Plus_Icon.vue';

import CreateOrderModal from '../modals/CreateOrderModal.vue';
import EditOrderModal from '../modals/EditOrderModal.vue';
import ConfirmDeleteModal from '../modals/ConfirmDeleteModal.vue'


export default defineComponent({

    components: {
        ConfirmDeleteModal,
        CreateOrderModal,
        EditOrderModal,
        Edit_Icon,
        Trash_Icon,
        Plus_Icon
    },

    setup() {

        const orders = ref()

        const ENTITY_TYPE = 'order';
        const entityId = ref();
        const orderIdToDelete = ref('')

        const isCreateModalVisible = ref(false);
        const isEditModalVisible = ref(false);
        const isDeleteModalVisible = ref(false);

        const orderIdToUpdate = ref('');
        const orderToUpdate = ref();

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

        const updateList = async () => {
            orders.value = await loadOrders()
        }

        const handleEdit = (editedOrder: any) => {
            isEditModalVisible.value = false;

            editRecordInOrders(orderIdToUpdate.value,
                editedOrder
            )
            .then(() => {
                closeModal();
                updateList();
                orderIdToUpdate.value = '';
            })
        }

        const handleDelete = () => {
            isDeleteModalVisible.value = false;
            deleteRecordsInOrders(orderIdToDelete.value).then(() => {
                updateList();
            })
        }


        onMounted(() => {
            updateList();
            
        })

        return {

            ENTITY_TYPE,
            entityId,
            isCreateModalVisible,
            isDeleteModalVisible,
            isEditModalVisible,
            orders,
            orderToUpdate,

            closeModal,
            formatDate,
            handleDelete,
            handleEdit,
            openCreateModal,
            openDeleteModal,
            openEditModal,
            updateList
        }
    }
})
</script>
<style lang="">

</style>