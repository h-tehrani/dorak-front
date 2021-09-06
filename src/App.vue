<template>
  <v-app>
    <v-main>
      <v-row v-if="!isLoaded" class="mt-12 pt-12">
        <v-col class="text-center mt-12 pt-12">
          <v-progress-circular
              :size="200"
              :width="7"
              color="purple"
              indeterminate
          ></v-progress-circular>
        </v-col>
      </v-row>
      <div v-else>
        <navbar></navbar>
        <div v-if="isAuthenticated">
          <router-view/>
        </div>
        <div v-else>
          <login></login>
        </div>
      </div>
    </v-main>
  </v-app>
</template>
<script>

import Login from "./components/Login";
import {mapGetters, mapActions} from 'vuex';
import Navbar from "./components/Navbar";

export default {
  name: 'App',
  components: {Navbar, Login},
  data: () => ({
    isLoaded: false,
    authenticated: false
  }),
  created() {
    this.tryAutoLogin().then(() => {
      window.Echo.channel(`message.${this.user.id}`).listen('Message', function (e) {
        if (!('Notification' in window)) {
          alert('Web Notification is not supported');
          return;
        }
        Notification.requestPermission(() => {
          let notification = new Notification(e.data.title, {
            body: e.data.body, // content for the alert
            icon: "https://pusher.com/static_logos/320x320.png" // optional image url
          });
          notification.onclick = () => {
            window.open(window.location.href);
          };
        });
      })
    })
    var SELF = this
    setInterval(function () {
      SELF.isLoaded = true;
    }, 1000);
  },
  methods: {
    ...mapActions({
      tryAutoLogin: 'sanctum/tryAutoLogin',
    }),
  },
  computed: {
    ...mapGetters({
      isAuthenticated: 'sanctum/isAuthenticated',
      user: 'sanctum/getUser',
    }),
  },
};
</script>
