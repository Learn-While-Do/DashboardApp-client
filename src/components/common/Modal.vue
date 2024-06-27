<template>
    <div class="modal" @keyup.esc="$emit('close')">
        <div class="modal-background" @click="$emit('close')"></div>
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    emits: ['close'],
    setup() { }
})
</script>

<style lang="scss" scoped>
.modal {
    z-index: 100;
}
</style>