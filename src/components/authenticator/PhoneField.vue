<template>
  <div>
    <div v-if="isPhoneNumberRequired" v-bind:class="amplifyUI.inputLabel">
      {{ $Amplify.I18n.get("Phone number") }} *
    </div>
    <div v-if="!isPhoneNumberRequired" v-bind:class="amplifyUI.inputLabel">
      {{ $Amplify.I18n.get("Phone number") }}
    </div>
    <div v-bind:class="amplifyUI.selectInput">
      <select
        v-model="countryCode"
        v-on:change="emitPhoneNumberChanged"
        data-test="dial-code-select"
      >
        <option
          v-for="_country in countries"
          v-bind:key="_country.label"
          v-bind:value="_country.value"
          v-bind:data-test="auth.genericAttrs.dialCodeSelect"
          >{{ _country.label }}</option
        >
      </select>
      <input
        type="tel"
        v-model="local_phone_number"
        v-bind:class="[amplifyUI.input, isInvalid ? 'invalid' : '']"
        :placeholder="$Amplify.I18n.get(getPlaceholder)"
        autofocus
        v-on:keyup="emitPhoneNumberChanged"
        v-on:input="local_phone_number = $event.target.value"
        v-bind:data-test="auth.genericAttrs.phoneNumberInput"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import * as AmplifyUI from "@aws-amplify/ui";
import countries from "../../assets/countries";
import { auth } from "../../assets/data-test-attributes";

export default defineComponent({
  name: "amplify-phone-field",
  props: ["required", "invalid", "placeholder", "defaultCountryCode"],
  data() {
    return {
      countryCode: this.defaultCountryCode || "1",
      local_phone_number: "",
      countries,
      amplifyUI: AmplifyUI,
      auth
    };
  },
  computed: {
    isPhoneNumberRequired() {
      return this.required;
    },
    isInvalid() {
      return !!this.invalid;
    },
    getPlaceholder() {
      return this.placeholder || "Enter your phone number";
    }
  },
  methods: {
    emitPhoneNumberChanged() {
      this.$emit("phone-number-changed", {
        countryCode: this.countryCode,
        local_phone_number: this.local_phone_number
      });
    }
  }
});
</script>
