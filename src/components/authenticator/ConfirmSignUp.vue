<template>
  <div
    v-bind:class="amplifyUI.formSection"
    v-bind:data-test="auth.confirmSignUp.section"
  >
    <div
      v-bind:class="amplifyUI.sectionHeader"
      v-bind:data-test="auth.confirmSignUp.headerSection"
    >
      {{ options.header }}
    </div>
    <div
      v-bind:class="amplifyUI.sectionBody"
      v-bind:data-test="auth.confirmSignUp.bodySection"
    >
      <div v-bind:class="amplifyUI.formField">
        <div v-bind:class="amplifyUI.inputLabel">
          {{ $Amplify.I18n.get(getUsernameLabel()) }} *
        </div>
        <input
          v-bind:class="amplifyUI.input"
          v-model="options.username"
          name="username"
          :placeholder="$Amplify.I18n.get(getUsernameLabel())"
          autofocus
          v-bind:data-test="auth.confirmSignUp.usernameInput"
        />
      </div>
      <div v-bind:class="amplifyUI.formField">
        <div v-bind:class="amplifyUI.inputLabel">
          {{ $Amplify.I18n.get("Confirmation Code") }} *
        </div>
        <input
          v-bind:class="amplifyUI.input"
          v-model="code"
          name="code"
          :placeholder="$Amplify.I18n.get('Confirmation Code')"
          v-bind:data-test="auth.confirmSignUp.confirmationCodeInput"
        />
        <div v-bind:class="amplifyUI.hint">
          {{ $Amplify.I18n.get("Lost your code? ") }}
          <a
            v-bind:class="amplifyUI.a"
            v-on:click="resend"
            v-bind:data-test="auth.confirmSignUp.resendCodeLink"
            >{{ $Amplify.I18n.get("Resend Code") }}</a
          >
        </div>
      </div>
    </div>
    <div v-bind:class="amplifyUI.sectionFooter">
      <span v-bind:class="amplifyUI.sectionFooterPrimaryContent">
        <button
          v-bind:class="amplifyUI.button"
          v-on:click="confirm"
          v-bind:data-test="auth.confirmSignUp.confirmButton"
        >
          {{ $Amplify.I18n.get("Confirm") }}
        </button>
      </span>
      <span v-bind:class="amplifyUI.sectionFooterSecondaryContent">
        {{ $Amplify.I18n.get("Have an account? ") }}
        <a
          v-bind:class="amplifyUI.a"
          v-on:click="signIn"
          v-bind:data-test="auth.confirmSignUp.backToSignInLink"
          >{{ $Amplify.I18n.get("Back to Sign In") }}</a
        >
      </span>
    </div>
    <div class="error" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as AmplifyUI from "@aws-amplify/ui";
import { labelMap } from "./common";
import { auth } from "../../assets/data-test-attributes";

export default defineComponent({
  name: "amplify-confirm-sign-up",
  props: ["confirmSignUpConfig", "usernameAttributes"],
  data() {
    return {
      code: "",
      error: "",
      logger: {},
      amplifyUI: AmplifyUI,
      auth
    };
  },
  computed: {
    options() {
      const defaults = {
        username: "",
        header: this.$Amplify.I18n.get("Confirm Sign Up")
      };
      return Object.assign(defaults, this.confirmSignUpConfig || {});
    }
  },
  mounted: function() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
    if (!this.options.username) {
      return this.setError("Valid username not received.");
    }
  },
  methods: {
    confirm() {
      this.$Amplify.Auth.confirmSignUp(this.options.username, this.code)
        .then(() => {
          this.logger.info("confirmSignUp success");
          this.$AmplifyEventBus.emit("authState", "signIn");
        })
        .catch(e => this.setError(e));
    },
    resend() {
      this.$Amplify.Auth.resendSignUp(this.options.username)
        .then(() => {
          this.logger.info("resendSignUp success");
        })
        .catch(e => this.setError(e));
    },
    signIn() {
      this.$AmplifyEventBus.emit("authState", "signIn");
    },
    setError(e) {
      this.error = this.$Amplify.I18n.get(e.message || e);
      this.logger.error(this.error);
    },
    getUsernameLabel() {
      return labelMap[this.usernameAttributes] || this.usernameAttributes;
    }
  }
});
</script>
