<template>
  <div>
    <div class="amplify-album">
      <div class="amplify-album-container">
        <amplify-s3-image
          class="amplify-image-container"
          v-for="item in items"
          v-bind:key="item.key"
          :imagePath="item.path"
          :s3ImageConfig="s3AlbumConfig"
        ></amplify-s3-image>
      </div>
    </div>
    <div class="error" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AmplifyEventBus from "../../events/AmplifyEventBus";

export default defineComponent({
  name: "amplify-s3-album",
  props: ["s3AlbumConfig", "path"],
  data() {
    return {
      logger: {},
      error: "",
      items: []
    };
  },
  computed: {
    options() {
      const defaults = {};
      return Object.assign(defaults, this.s3AlbumConfig || {});
    }
  },
  mounted() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
    this.getImages();
    AmplifyEventBus.$on("fileUpload", img => {
      this.pushImage(img);
    });
  },
  methods: {
    getImages() {
      if (!this.path) {
        this.setError("Album path not provided");
        return;
      }
      const that = this;
      this.$Amplify.Storage.list(this.path, this.options)
        .then(res => {
          that.items = res.map(item => {
            return { path: item.key };
          });
        })
        .catch(e => this.setError(e));
    },
    pushImage(img) {
      if (!img) {
        this.setError("Image path not provided");
        return;
      }
      this.items.push({ key: 123, path: img });
    },
    setError: function(e) {
      this.error = this.$Amplify.I18n.get(e.message || e);
      this.logger.error(this.error);
    }
  }
});
</script>

<style scoped>
.amplify-album {
  width: var(--component-width-desktop);
  margin: 1em auto;
  border-radius: 6px;
  background-color: var(--color-white);
  box-shadow: var(--box-shadow);
}
.amplify-album-container {
  width: 400px;
  margin: 0 auto;
  padding: 1em;
}
.amplify-image-container {
  display: inline;
}
</style>
