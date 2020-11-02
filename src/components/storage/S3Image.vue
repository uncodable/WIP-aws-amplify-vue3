<template>
  <div>
    <img @click="blowUp(url)" class="amplify-image" :src="url" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AmplifyEventBus from "../../events/AmplifyEventBus";

export default defineComponent({
  name: "amplify-s3-image",
  props: ["imagePath", "s3ImageConfig"],
  data() {
    return {
      url: null,
      error: "",
      logger: {}
    };
  },
  computed: {
    options() {
      const defaults = {};
      return Object.assign(defaults, this.s3ImageConfig || {});
    }
  },
  mounted() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
    this.getImage();
  },
  methods: {
    getImage() {
      if (!this.imagePath) {
        return this.setError("Image path not provided.");
      }
      this.$Amplify.Storage.get(this.imagePath, this.options)
        .then(url => {
          this.url = url;
        })
        .catch(e => this.setError(e));
    },
    blowUp(url) {
      window.open(url);
    },
    setError: function(e) {
      this.error = this.$Amplify.I18n.get(e.message || e);
      this.logger.error(this.error);
    }
  }
});
</script>

<style scoped>
.amplify-image {
  width: 30%;
  margin: 0.2em;
  border-radius: 6px;
  border: 2px solid var(--color-white);
  cursor: pointer;
}
</style>
