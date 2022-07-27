import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from './../components/layout/Layout.vue';
import Dashboard from '@/views/dashboard/Dashboard.vue';
import Dataset from '@/views/dataset/Dataset.vue';
import Experiments from '@/views/experiments/Experiments.vue';
import Models from '@/views/models/Models.vue';
import CreateProject from '@/views/create-project/CreateProject.vue';
import AuthMgmt from '@/views/authMgmt/AuthMgmt.vue';
import ProjectAuth from '@/views/projectAuth/ProjectAuth.vue';
import Login from '@/views/login/Login.vue';
import store from '@/services/store.service';
import { StringUtil } from '@/utils/string.util';
import storeService from '@/services/store.service';
import { AxiosUtils } from '@/utils/axios.utils';
import Api from '@/services/api.service';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: "/login",
        component: Login,
        name: 'login',
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
        path: '/createProject',
        component: Layout,
        children: [{
            name: 'createProject',
            path: '',
            component: CreateProject,
        }]
    },
    {
        path: '/authMgmt',
        component: Layout,
        children: [{
            name: 'authMgmt',
            path: '',
            component: AuthMgmt,
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
            name: "models",
            path: 'models',
            component: Models,
        },
        {
            name: "management",
            path: 'management',
            component: ProjectAuth,
        },
        ]
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.Base_URL,
    routes
})

router.beforeEach(async (to, from, next) => {

    if (AxiosUtils.getToken() === '' && to.name !== "login") next({ name: 'login' })

    if (storeService.userInfo.token === '' || storeService.userInfo.username === '' || storeService.userInfo.auth === '') {
        const res = await Api.refreshToken()
        if (res !== "success" && to.name !== "login") next({ name: 'login' })
    }

    if (['dataset', 'experiments', 'models', 'management'].includes(to.name ?? '')) {
        if (to.params.projectName) store.currentProject = to.params.projectName;
        next();
    }
    else next();

})

export default router
