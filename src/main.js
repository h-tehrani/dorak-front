import Vue from 'vue'
import './plugins/axios'
import VueSanctum from 'vue-sanctum';
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'
import Echo from "laravel-echo";

Vue.config.productionTip = false

window.Pusher = require('pusher-js');
window.Echo = new Echo({
    authorizer: (channel) => {
        return {
            authorize: (socketId, callback) => {
                window.axios.post('/api/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                },)
                    .then(response => {
                        callback(false, response.data);
                    })
                    .catch(error => {
                        callback(true, error);
                    });
            }
        };
    },
    broadcaster: 'pusher',
    key: 'myKey',
    cluster: 'mt1',
    wsHost: process.env.VUE_APP_BASE_IP,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    encrypted: true,
});

Vue.use(VueSanctum, {
    axios: window.axios,
    routes: {
        csrf: '/sanctum/csrf-cookie',
        login: '/api/token',
        me: '/api/me',
        logout: '/api/logout',
    },
    store
});
new Vue({
    router,
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app')
