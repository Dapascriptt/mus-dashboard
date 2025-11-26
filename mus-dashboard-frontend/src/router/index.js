// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

// 🔥 AGGRESSIVE LAZY LOADING — SEMUA HALAMAN DINAMIS

// Dashboard
const Dashboard     = () => import('../pages/Dashboard.vue')

// PRODUCT MODULE
const ProductList   = () => import('../pages/ProductList.vue')
const ProductAdd    = () => import('../pages/ProductAdd.vue')
const ProductEdit   = () => import('../pages/ProductEdit.vue')

// ORDER MODULE
const OrderList     = () => import('../pages/OrderList.vue')
const OrderAdd      = () => import('../pages/OrderAdd.vue')
const OrderDetail   = () => import('../pages/OrderDetail.vue')

// CUSTOMER MODULE
const CustomerList  = () => import('../pages/CustomerList.vue')
const CustomerAdd   = () => import('../pages/CustomerAdd.vue')
const CustomerEdit  = () => import('../pages/CustomerEdit.vue')

// OTHER PAGES
const Analytics     = () => import('../pages/Analytics.vue')
const Settings      = () => import('../pages/Settings.vue')

// AUTH
const Login         = () => import('../pages/auth/Login.vue')

// ========================================================

const routes = [
  { path: '/', redirect: '/dashboard' },

  { path: '/dashboard',          name: 'Dashboard',      component: Dashboard },

  // Product
  { path: '/products',           name: 'ProductList',    component: ProductList },
  { path: '/products/add',       name: 'ProductAdd',     component: ProductAdd },
  { path: '/products/edit/:id',  name: 'ProductEdit',    component: ProductEdit, props: true },

  // Order
  { path: '/orders',             name: 'OrderList',      component: OrderList },
  { path: '/orders/add',         name: 'OrderAdd',       component: OrderAdd },
  { path: '/orders/:id',         name: 'OrderDetail',    component: OrderDetail, props: true },

  // Customer
  { path: '/customers',          name: 'CustomerList',   component: CustomerList },
  { path: '/customers/add',      name: 'CustomerAdd',    component: CustomerAdd },
  { path: '/customers/edit/:id', name: 'CustomerEdit',   component: CustomerEdit, props: true },

  // Other pages
  { path: '/analytics',          name: 'Analytics',      component: Analytics },
  { path: '/settings',           name: 'Settings',       component: Settings },

  // Auth
  { path: '/login',              name: 'Login',          component: Login },
]

// ========================================================

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const publicRoutes = ['Login']

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated && !publicRoutes.includes(to.name)) {
    return next({ name: 'Login' })
  }

  if (authStore.isAuthenticated && to.name === 'Login') {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router
