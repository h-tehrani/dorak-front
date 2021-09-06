<template>
  <v-container>
    <v-card color="rgba(239,98,201,0.62)">
      <v-card-title>
        Upload image take text!
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col></v-col>
          <v-col class="text-center">
            <v-file-input
                v-model="file"
                color="black"
                :rules="rules"
                accept="image/png, image/jpeg, image/bmp"
                placeholder="Pick an image"
                prepend-icon="mdi-camera"
                label="Image"
                @change="upload($event)"
            ></v-file-input>
            <v-btn class="white--text" color="teal lighten-1" @click="send">
              send
            </v-btn>
          </v-col>
          <v-col></v-col>
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
        <v-row
            v-if="loading"
        >
          <v-col class="text-center">
            <v-progress-circular
                indeterminate
                color="purple"
            ></v-progress-circular>
          </v-col>
        </v-row>
        <v-row v-if="tag">
          <v-col class="text-center">
            <v-card-subtitle>
              <p class="tag" style="color:black"> Tag name : {{ tag }} </p>
            </v-card-subtitle>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'UploadImage',

  data: () => ({
    uploadPercentage: 0,
    tag: null,
    file: null,
    loading: null,
    rules: [
      value => !value || value.size < 10000000 || 'Your image size should be less than 10 MB!',
    ],
  }),
  methods: {
    upload(event) {
      this.file = event
    },
    send() {
      this.loading = true
      let data = new FormData();
      data.append('file', this.file)
      window.axios.post('api/tag', data, {
        onUploadProgress: function (progressEvent) {
          this.uploadPercentage = parseInt(Math.round((progressEvent.loaded / progressEvent.total) * 100));
        }.bind(this)
      }).then((res) => {
        this.loading = false
        this.tag = res.data.data.describe
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
<style>
.tag {
  color: white;
  font-size: 20px;
}
</style>
