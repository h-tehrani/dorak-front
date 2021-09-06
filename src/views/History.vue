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

    <v-row class="mt-4" v-if="tags.length">
      <v-col cols="12" md="6" lg="4" v-for="(tag, index) in tags" :key="index">
        <v-card>
          <v-row>
            <v-col class="text-center">
              <img width="200px" height="220px" :src="baseurl + '/' + tag.path">
            </v-col>
          </v-row>

          <v-card-title>{{ tag.name }}</v-card-title>

          <v-card-subtitle>Created At: {{ tag.created_at.substr(0, 10) }}</v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
    <v-row v-if="tags.length">
      <v-col class="text-center">
        <v-btn color="red" @click="dialog = !dialog">Clear History</v-btn>
        <v-dialog
            v-model="dialog"
            width="500"
        >
          <v-card>
            <v-card-title>
              <p>Are you sure about clearing history?</p>
            </v-card-title>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="primary"
                  text
                  @click="clearHistory"
              >
                Yes
              </v-btn>
              <v-btn
                  text
                  @click="dialog = ! dialog"
              >
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="3"></v-col>
      <v-col>
        <v-card>
          <v-card-title>
            You have not any uploaded image
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "History",

  data() {
    return {
      tags: {},
      baseurl: process.env.VUE_APP_BASE_URL,
      dialog: false,
      snackbar: false,
      msg: null,
    }
  },

  methods: {
    loadData() {
      window.axios.get('api/history/last')
          .then((res) => {
            this.tags = res.data.data
          }).catch((err) => {
        this.snackbar = true
        this.msg = err.response.data.message
      })
    },

    clearHistory() {
      window.axios.get('api/history/clear')
          .then((res) => {
            this.snackbar = true
            this.msg = res.data.message
            this.tags = {}
          }).catch((err) => {
        this.snackbar = false
        this.msg = err.response.data.message
      })
    }
  },

  mounted() {
    this.loadData()
  }
}
</script>

<style scoped>

</style>