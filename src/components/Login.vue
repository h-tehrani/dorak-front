<template>
  <v-container>
    <v-snackbar
        top
        v-model="snackbar"
    >
      {{ msg }}
      <template v-slot:action="{ attrs }">
        <v-btn
            color="red"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          X
        </v-btn>
      </template>
    </v-snackbar>

    <v-card>
      <v-card-title>
        Login to Your Account
      </v-card-title>

      <v-card-text>
        <v-form v-model="formValid">
          <p v-if="isAuthenticated">Hello {{ user.nickname }}!</p>
          <p v-else>You are not logged in</p>
          <v-row>
            <v-col>
              <v-text-field
                  label="nickname"
                  :rules="nicknameRules"
                  v-model="nickname"
                  color="purple"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                  label="Password"
                  type="password"
                  :rules="passwordRules"
                  v-model="password"
                  color="purple"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn
                  :disabled="!formValid"
                  color="purple"
                  rounded
                  width="100px"
                  height="60px"
                  elevation="12"
                  class="white--text"
                  @click="onLogin">
                Login
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
  name: 'Login',

  data() {
    return {
      nickname: '',
      nicknameRules: [
        v => !!v,
      ],
      password: '',
      passwordRules: [
        v => !!v,
      ],

      formValid: null,

      snackbar: false,
      msg: null,
    }
  },

  computed: {
    ...mapGetters({
      isAuthenticated: 'sanctum/isAuthenticated',
      user: 'sanctum/getUser',
    }),
  },

  methods: {
    ...mapActions({
      login: 'sanctum/login',
      logout: 'sanctum/logout',
    }),

    onLogin() {
      this.login({
        nickname: this.nickname,
        password: this.password
      })
          .then(() => {
            // now you are logged in
            // the XSRF-Token was fetched and stored
            // and also the session cookie stored
            // all further subsequent request are authenticated

            // with activated vuex feature the login action on success
            // dispatch automatically the fetchUser action and store
            // the authenticated user in the vuex store.
            // It also set the isAuthenticated state to true
            // so you can check anywhere in your application if the user is authenticated or not
          })
          .catch(error => {
            this.snackbar = true
            this.msg = error.response.data.message
            // whoops, something went wrong
          });
    },
  },
}
</script>

<style scoped>

</style>