import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Layout from './../components/layout/Layout.vue';
import Dashboard from '@/views/dashboard/Dashboard.vue';
import Dataset from '@/views/dataset/Dataset.vue';
import Experiments from '@/views/experiments/Experiments.vue';
import Models from '@/views/models/Models.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            name: 'dashboard',
            path: 'dashboard',
            component: Dashboard,
        }]
    },
    {
        path: '/:projectName',
        component: Layout,
        children: [{
            name: "dataset",
            path: 'dataset',
            component: Dataset,
        },
        {
            name: "experiments",
            path: 'experiments',
            component: Experiments,
        },
        {
            name:"models",
            path: 'models',
            component: Models,
        },
        ]
    },
]

const router = new VueRouter({
    mode:'history',
    base: process.env.Base_URL,
    routes
})

export default router