import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */'@/views/dashboard/Dashboard.vue'),
    },
    {
        path: '/:projectName/dataset',
        name: 'dataset',
        component: () => import(/* webpackChunkName: "dataset" */'@/views/dataset/Dataset.vue'),
        props: true,
    },
    {
        path: '/:projectName/experiments',
        name: 'experiments',
        component: () => import(/* webpackChunkName: "experiments" */'@/views/experiments/Experiments.vue'),
        props: true,
    },
    {
        path: '/:projectName/models',
        name: 'models',
        component: () => import(/* webpackChunkName: "models" */'@/views/models/Models.vue'),
        props: true,
    },

]

const router = new VueRouter({
    mode:'history',
    base: process.env.Base_URL,
    routes
})

export default router