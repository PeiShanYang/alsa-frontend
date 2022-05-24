import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Layout from './../components/layout/Layout.vue';
import Dashboard from '@/views/dashboard/Dashboard.vue';
import Dataset from '@/views/dataset/Dataset.vue';
import Experiments from '@/views/experiments/Experiments.vue';
import Models from '@/views/models/Models.vue';
import CreateProject from '@/views/create-project/CreateProject.vue';
import Login from '@/views/login/Login.vue';
import store from '@/services/store.service';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path:"/login",
        component:Login,
    },
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
        path:'/createProject',
        component: Layout,
        children:[{
            name: 'createProject',
            path: '',
            component: CreateProject,
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

router.beforeEach((to, from, next) => {
    if (['dataset', 'experiments', 'models'].includes(to.name ?? '')) {
        if (to.params.projectName) store.currentProject = to.params.projectName;
        next();
    }
    else next();
})

export default router