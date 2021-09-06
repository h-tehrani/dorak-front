<template>
  <div>
    <v-app-bar
        color="purple darken-3"
        dark
        max-height="64px"
    >
      <v-spacer></v-spacer>

      <v-tabs show-arrows color="white" optional>
        <v-tab class="navTab text-capitalize" to="/history">
          History
        </v-tab>
        <v-tab class="navTab text-capitalize" to="/upload-image">
          Upload Image
        </v-tab>
        <v-tab class="navTab text-capitalize" to="/upload-image/multiple">
          Upload Multiple Images
        </v-tab>

        <v-spacer></v-spacer>
      </v-tabs>

    </v-app-bar>
    <div v-if="total" class="progressBar">
      TOTAL : {{ total }}
      |
      CURRENT : {{ current }}
    </div>
    <v-progress-linear
        v-if="total"
        height="13px"
        color="success"
        :value="current ? current * 100 / total : 0"
    ></v-progress-linear>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data() {
    return {
      total: null,
      current: null,
    }
  },
  created() {
    let SELF = this
    window.Echo.channel('update').listen('Update', function (e) {
      if (!SELF.total) {
        SELF.total = e.data.all
      }
      SELF.current++
      if (SELF.current === SELF.total) {
        SELF.current = null
        SELF.total = null
      }
    })
  },
}
</script>

<style scoped>
.progressBar{
  height: 50px;
  background-color: #e86464
}
.navTab {
  font-size: 20px;
}
</style>