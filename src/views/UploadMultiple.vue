<template>
  <div>
    <!--    DIALOG WHEN WORK IS DONE   -->
    <div class="text-center">
      <v-dialog
          v-model="dialog"
          width="500"
      >
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            Response is ready now !
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="6">
              </v-col>
            </v-row>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="primary"
                text
                @click="dialog = false"
            >
              I got it
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <!--    ADD IMAGE TO IMAGGA    -->

    <div v-if="!inProgress">
      <v-row class="mt-4">
        <v-col cols="9"></v-col>
        <v-col>
          <v-btn color="green" @click="filesCount++" v-if="filesCount < 10" class="mx-1">
            <v-icon color="white">mdi-plus</v-icon>
          </v-btn>
          <v-btn color="red" @click="filesCount--" v-if="filesCount >= 2" class="mx-1">
            <v-icon color="white">mdi-close</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-card color="whitesmoke">
            <v-card-title>
              <v-row class="mb-16">
                <v-col class="text-center">
                  Upload images
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6" lg="4" class="text-center" v-for="(file,index) in filesCount" :key="file">
                  <v-file-input
                      color="black"
                      :prefix="index+1 + '-' + ' '"
                      accept="image/png, image/jpeg, image/bmp"
                      placeholder="Pick an image"
                      prepend-icon="mdi-camera"
                      label="Image"
                      @change="upload($event)"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

        </v-col>
      </v-row>
      <v-row v-if="uploadPercentage">
        <v-col>
          <v-progress-linear
              color="white"
              height="40"
              class="mt-2"
              :value="uploadPercentage"
          >{{ uploadPercentage }}%
          </v-progress-linear>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10"></v-col>
        <v-col>
          <v-btn x-large color="success" @click="send">Send</v-btn>
        </v-col>
      </v-row>
    </div>

    <!--    WORKING ON GET RESPONSE    -->

    <div v-else>
      <v-row class="mt-16">
        <v-col cols="5"></v-col>
        <v-col cols="2">
          <v-progress-circular
              :rotate="360"
              :size="250"
              :width="20"
              :value="current ? current * 100 / total : 0"
              color="teal"
          >
            {{ Math.floor(current ? current * 100 / total : 0) }} %
          </v-progress-circular>
        </v-col>
        <v-col cols="5"></v-col>
      </v-row>
      <v-row class="mt-8" v-if="responses.length">
        <v-col>
          <v-card
              elevation="24"
              max-width="444"
              class="mx-auto"
          >
            <v-system-bar lights-out></v-system-bar>
            <v-carousel
                :show-arrows="true"
                hide-delimiter-background
                delimiter-icon="mdi-minus"
                height="300"
            >
              <v-carousel-item
                  v-for="(item, i) in responses"
                  :key="i"
              >
                <v-sheet
                    height="100%"
                    tile
                >
                  <v-row
                      class="fill-height"
                  >
                    <div class="text-h2">
                      <img height="250px" width="450px" :src="baseURL+'/'+item.path" :alt="item.name">
                    </div>
                    <div class="ml-10 text-center">
                      <span style="font-size: 25px">
                        {{ item.name }}
                      </span>
                    </div>
                  </v-row>
                </v-sheet>
              </v-carousel-item>
            </v-carousel>
            <v-list two-line>
              <v-list-item>
                <v-list-item-avatar>
                  <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-if="user">{{ user.nickname }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5"></v-col>
        <v-col class="text-center">
          <v-btn color="red" @click="reset" class="mx-1">
            <v-icon color="white">RESET</v-icon>
          </v-btn>
        </v-col>
        <v-col cols="5"></v-col>
      </v-row>
    </div>
  </div>
</template>

<script>

export default {
  name: "UploadMultiple",

  data() {
    return {
      dialog: false,
      filesCount: 1,
      uploadPercentage: 0,
      snackbar: false,
      msg: null,
      files: [],
      inProgress: false,
      total: null,
      user: null,
      current: null,
      responses: [],
      baseURL: process.env.VUE_APP_BASE_URL
    }
  },
  mounted() {
    window.axios.get('api/status').then((res) => {
      if (res.data.data && res.data.data.all) {
        this.current = res.data.data.current
        this.total = res.data.data.all
        if (res.data.data.current === res.data.data.all) {
          window.axios.get('api/history').then((res) => {
            this.responses = res.data.data
          })
        }
        this.inProgress = true
      }
    })
  },
  created() {
    let SELF = this
    window.Echo.channel('update').listen('Update', function (e) {
      SELF.inProgress = true
      if (!SELF.total) {
        SELF.total = e.data.all
      }
      SELF.current++
      if (SELF.current === SELF.total) {
        window.axios.get('api/history').then((res) => {
          SELF.dialog = true
          SELF.responses = res.data.data
        })
      }
    })
  },

  methods: {
    reset() {
      window.axios.get('api/status/clear').then(() => {
        this.inProgress = false
      })
    },
    upload(event) {
      this.files.push(event)
    },
    send() {
      window.axios.get('api/me').then((res) => {
        this.user = res.data
      })
      this.inProgress = true
      let data = new FormData();
      let filesLength = this.files.length;
      for (let x = 0; x < filesLength; x++) {
        data.append('files[]', this.files[x])
      }

      window.axios.post('api/tag/multiple', data, {
        onUploadProgress: function (progressEvent) {
          this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        }.bind(this)
      }).then((res) => {
        this.snackbar = true
        this.msg = res.data.message
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>

</style>