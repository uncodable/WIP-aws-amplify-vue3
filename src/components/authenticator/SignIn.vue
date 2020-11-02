<template>
  <div
    v-bind:class="amplifyUI.formSection"
    v-bind:data-test="auth.signIn.section"
  >
    <div
      v-bind:class="amplifyUI.sectionHeader"
      v-bind:data-test="auth.signIn.headerSection"
    >
      {{ options.header }}
    </div>
    <div
      v-bind:class="amplifyUI.sectionBody"
      v-bind:data-test="auth.signIn.bodySection"
    >
      <amplify-username-field
        v-bind:usernameAttributes="usernameAttributes"
        v-on:username-field-changed="usernameFieldChanged"
      >
      </amplify-username-field>
      <div v-bind:class="amplifyUI.formField">
        <div v-bind:class="amplifyUI.inputLabel">
          {{ $Amplify.I18n.get("Password") }} *
        </div>
        <input
          v-bind:class="amplifyUI.input"
          v-model="password"
          type="password"
          :placeholder="$Amplify.I18n.get('Enter your password')"
          v-on:keyup.enter="signIn"
          v-bind:data-test="auth.signIn.passwordInput"
        />
        <div v-bind:class="amplifyUI.hint">
          {{ $Amplify.I18n.get("Forgot your password? ") }}
          <a
            v-bind:class="amplifyUI.a"
            v-on:click="forgot"
            v-bind:data-test="auth.signIn.forgotPasswordLink"
            >{{ $Amplify.I18n.get("Reset password") }}</a
          >
        </div>
      </div>
    </div>
    <div
      v-bind:class="amplifyUI.sectionFooter"
      v-bind:data-test="auth.signIn.footerSection"
    >
      <span v-bind:class="amplifyUI.sectionFooterPrimaryContent">
        <button
          v-bind:class="amplifyUI.button"
          v-on:click="signIn"
          v-bind:data-test="auth.signIn.signInButton"
        >
          {{ $Amplify.I18n.get("Sign In") }}
        </button>
      </span>
      <span
        v-bind:class="amplifyUI.sectionFooterSecondaryContent"
        v-if="options.isSignUpDisplayed"
      >
        {{ $Amplify.I18n.get("No account? ") }}
        <a
          v-bind:class="amplifyUI.a"
          v-on:click="signUp"
          v-bind:data-test="auth.signIn.createAccountLink"
          >{{ $Amplify.I18n.get("Create account") }}</a
        >
      </span>
    </div>
    <div class="error" v-if="error" v-bind:data-test="auth.signIn.signInError">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import Auth from '@aws-amplify/auth';
import * as AmplifyUI from "@aws-amplify/ui";
import UsernameField from "./UsernameField";
import { auth } from "../../assets/data-test-attributes";

export default defineComponent({
  name: "amplify-sign-in",
  components: {
    "amplify-username-field": UsernameField
  },
  props: ["signInConfig", "usernameAttributes"],
  data() {
    return {
      password: "",
      error: "",
      amplifyUI: AmplifyUI,
      auth,
      logger: {},
      signInUsername: "",
      labelMap: {
        email: "Email",
        phone_number: "Phone Number",
        username: "Username"
      }
    };
  },
  computed: {
    options() {
      const defaults = {
        header: this.$Amplify.I18n.get("Sign in to your account"),
        username: "",
        isSignUpDisplayed: true
      };
      return Object.assign(defaults, this.signInConfig || {});
    }
  },
  mounted() {
    this.logger = new this.$Amplify.Logger(this.$options.name);
  },
  methods: {
    signIn: function(event) {
      this.$Amplify.Auth.signIn(this.signInUsername, this.password)
        .then(data => {
          this.logger.info("sign in success");
          if (
            data.challengeName === "SMS_MFA" ||
            data.challengeName === "SOFTWARE_TOKEN_MFA"
          ) {
            this.AmplifyEventBus.emit("localUser", data);
            return this.AmplifyEventBus.emit("authState", "confirmSignIn");
          } else if (data.challengeName === "NEW_PASSWORD_REQUIRED") {
            this.AmplifyEventBus.emit("localUser", data);
            return this.AmplifyEventBus.emit("authState", "requireNewPassword");
          } else if (data.challengeName === "MFA_SETUP") {
            this.AmplifyEventBus.emit("localUser", data);
            return this.AmplifyEventBus.emit("authState", "setMfa");
          } else if (
            data.challengeName === "CUSTOM_CHALLENGE" &&
            data.challengeParam &&
            data.challengeParam.trigger === "true"
          ) {
            this.AmplifyEventBus.emit("localUser", data);
            return this.AmplifyEventBus.emit("authState", "customConfirmSignIn");
          } else {
            return this.AmplifyEventBus.emit("authState", "signedIn");
          }
        })
        .catch(e => {
          if (e.code && e.code === "UserNotConfirmedException") {
            this.AmplifyEventBus.emit("localUser", {
              username: this.signInUsername
            });
            this.AmplifyEventBus.emit("authState", "confirmSignUp");
          } else {
            this.setError(e);
          }
        });
    },
    forgot: function() {
      this.AmplifyEventBus.emit("authState", "forgotPassword");
    },
    signUp: function() {
      this.AmplifyEventBus.emit("authState", "signUp");
    },
    setError: function(e) {
      this.error = this.$Amplify.I18n.get(e.message || e);
      this.logger.error(this.error);
    },
    usernameFieldChanged: function(data) {
      const { usernameField, username, email, phoneNumber } = data;
      switch (usernameField) {
        case "username":
          this.signInUsername = username;
          break;
        case "email":
          this.signInUsername = email;
          break;
        case "phone_number":
          this.signInUsername = phoneNumber;
          break;
        default:
          break;
      }
    }
  }
});
</script>
