<script setup>
    import { ref, watch } from 'vue';
    import { useRouter} from 'vue-router';

    const type = ref('');
    const router = useRouter();

    watch(
        () => router.currentRoute.value,
        (newType) => {
            type.value = newType.name;
        }
    );
</script>

<template>
    <div class="h-16 w-full flex items-center justify-center border-b border-solid border-gray-700">
        <div class="inline-block mr-20 text-2xl" :class="{ active: type === item }" v-for="(item, index) in ['Welcome', 'List', 'Web3d']" :key="`nav_${index}`" @click="type = item">
            <RouterLink :to="`/${item}`">{{ item }}</RouterLink>
        </div>
    </div>

    <main>
        <router-view />
    </main>
</template>

<style scoped></style>
