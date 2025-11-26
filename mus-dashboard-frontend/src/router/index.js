// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

import Dashboard from '../pages/Dashboard.vue'

// Product module
import ProductList from '../pages/ProductList.vue'
import ProductAdd from '../pages/ProductAdd.vue'
import ProductEdit from '../pages/ProductEdit.vue'

// Order module
import OrderList from '../pages/OrderList.vue'
import OrderAdd from '../pages/OrderAdd.vue'
import OrderDetail from '../pages/OrderDetail.vue'

// Customer module
import CustomerList from '../pages/CustomerList.vue'
import CustomerAdd from '../pages/CustomerAdd.vue'
import CustomerEdit from '../pages/CustomerEdit.vue'

// Other pages
import Analytics from '../pages/Analytics.vue'
import Settings from '../pages/Settings.vue'

// Auth
import Login from '../pages/auth/Login.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },

  { path: '/dashboard', name: 'Dashboard', component: Dashboard },

  // Product
  { path: '/products', name: 'ProductList', component: ProductList },
  { path: '/products/add', name: 'ProductAdd', component: ProductAdd },
  { path: '/products/edit/:id', name: 'ProductEdit', component: ProductEdit, props: true },

  // Order
  { path: '/orders', name: 'OrderList', component: OrderList },
  { path: '/orders/add', name: 'OrderAdd', component: OrderAdd },
  { path: '/orders/:id', name: 'OrderDetail', component: OrderDetail, props: true },

  // Customer
  { path: '/customers', name: 'CustomerList', component: CustomerList },
  { path: '/customers/add', name: 'CustomerAdd', component: CustomerAdd },
  { path: '/customers/edit/:id', name: 'CustomerEdit', component: CustomerEdit, props: true },

  // Other pages
  { path: '/analytics', name: 'Analytics', component: Analytics },
  { path: '/settings', name: 'Settings', component: Settings },

  // Auth
  { path: '/login', name: 'Login', component: Login },
]

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
