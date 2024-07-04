import { createWebHistory, createRouter } from 'vue-router';

import Welcome from '@/views/Welcome.vue';
import List from '@/views/List.vue';
import Web3d from '@/views/Web3d.vue';

const routes = [
    {
        path: '/',
        redirect: '/Welcome',
    },
    {
        path: '/Welcome',
        name: 'Welcome',
        component: Welcome,
    },
    {
        path: '/List',
        name: 'List',
        component: List,
    },
    {
        path: '/Web3d',
        name: 'Web3d',
        component: Web3d,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
