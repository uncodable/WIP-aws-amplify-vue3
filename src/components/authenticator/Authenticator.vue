<template>
  <div>
    <amplify-sign-in
      v-if="displayMap.showSignIn"
      v-bind:signInConfig="options.signInConfig"
      v-bind:usernameAttributes="options.usernameAttributes"
    ></amplify-sign-in>
    <amplify-sign-up
      v-if="displayMap.showSignUp"
      v-bind:signUpConfig="options.signUpConfig"
      v-bind:usernameAttributes="options.usernameAttributes"
    ></amplify-sign-up>
    <amplify-confirm-sign-up
      v-if="displayMap.showConfirmSignUp"
      v-bind:confirmSignUpConfig="options.confirmSignUpConfig"
      v-bind:usernameAttributes="options.usernameAttributes"
    ></amplify-confirm-sign-up>
    <amplify-confirm-sign-in
      v-if="displayMap.showConfirmSignIn"
      v-bind:confirmSignInConfig="options.confirmSignInConfig"
    ></amplify-confirm-sign-in>
    <amplify-forgot-password
      v-if="displayMap.showForgotPassword"
      v-bind:forgotPasswordConfig="options.forgotPasswordConfig"
      v-bind:usernameAttributes="options.usernameAttributes"
    ></amplify-forgot-password>
    <amplify-require-new-password
      v-if="displayMap.requireNewPassword"
      v-bind:requireNewPasswordConfig="options.requireNewPasswordConfig"
    ></amplify-require-new-password>
    <amplify-set-mfa
      v-if="displayMap.showMfa"
      v-bind:mfaConfig="options.mfaConfig"
    ></amplify-set-mfa>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GetUser from "../../services/getUser";

export default defineComponent({
  name: "amplify-authenticator",
  props: ["authConfig"],
  data() {
    return {
      user: {
        username: null
      },
      displayMap: {},
      error: "",
      logger: {}
    };
  },
  computed: {
    options() {
      const defaults = {
        signInConfig: {},
        signUpConfig: {},
        confirmSignUpConfig: {},
        confirmSignInConfig: {},
        forgotPasswordConfig: {},
        mfaConfig: {},
        requireNewPasswordConfig: {},
        usernameAttributes: "username"
      };
      return Object.assign(defaults, this.authConfig || {});
    }
  },
  async mounted() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
    this.$AmplifyEventBus.on("localUser", user => {
      this.user = user;
      this.options.signInConfig.username = this.user.username;
      this.options.confirmSignInConfig.user = this.user;
      this.options.confirmSignUpConfig.username = this.user.username;
      this.options.requireNewPasswordConfig.user = this.user;
    });
    this.$AmplifyEventBus.on("authState", data => {
      this.displayMap = this.updateDisplayMap(data);
    });
    GetUser(this.$Amplify)
      .then(val => {
        if (val instanceof Error) {
          return (this.displayMap = this.updateDisplayMap("signedOut"));
        }
        this.user = val;
        return (this.displayMap = this.updateDisplayMap("signedIn"));
      })
      .catch(e => this.setError(e));
  },
  methods: {
    updateDisplayMap: state => {
      return {
        showSignIn: state === "signedOut" || state === "signIn",
        showSignUp: state === "signUp",
        showConfirmSignUp: state === "confirmSignUp",
        showConfirmSignIn: state === "confirmSignIn",
        showForgotPassword: state === "forgotPassword",
        showSignOut: state === "signedIn",
        showMfa: state === "setMfa",
        requireNewPassword: state === "requireNewPassword"
      };
    },
    setError: function(e) {
      this.error = this.$Amplify.I18n.get(e.message || e);
      this.logger.error(this.error);
    }
  }
});
</script>
