<template>
  <div v-bind:data-test="auth.signOut.section">
    <div v-bind:class="amplifyUI.formField">
      <div v-bind:class="amplifyUI.inputLabel">{{ options.msg }}</div>
      <button
        v-bind:class="amplifyUI.button"
        v-on:click="signOut"
        v-bind:data-test="auth.signOut.button"
      >
        {{ options.signOutButton }}
      </button>
    </div>
    <div class="error" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as AmplifyUI from "@aws-amplify/ui";
import { existsSync } from "fs";
import { auth } from "../../assets/data-test-attributes";

export default defineComponent({
  name: "amplify-sign-out",
  props: ["signOutConfig"],
  data() {
    return {
      error: "",
      show: false,
      amplifyUI: AmplifyUI,
      auth,
      logger: {}
    };
  },
  computed: {
    options() {
      const defaults = {
        msg: null,
        signOutButton: this.$Amplify.I18n.get("Sign Out")
      };
      return Object.assign(defaults, this.signOutConfig || {});
    }
  },
  async mounted() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
  },
  methods: {
    signOut: function(event) {
      this.$Amplify.Auth.signOut()
        .then(() => {
          this.logger.info("signout success");
          return this.AmplifyEventBus.emit("authState", "signedOut");
        })
        .catch(e => this.setError(e));
    },
    setError: function(e) {
      this.error = this.$Amplify.I18n.get(e.message || e);
      this.logger.error(this.error);
    }
  }
});
</script>
