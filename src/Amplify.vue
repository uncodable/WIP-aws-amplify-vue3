<template>
  <div></div>
</template>

<script lang="ts">
import AmplifyPlugin from "./plugins/AmplifyPlugin";
import AmplifyEventBus from "./events/AmplifyEventBus";

export default {
  name: "Amplify",
  AmplifyPlugin,
  AmplifyEventBus
};
</script>

<style src="@aws-amplify/ui/dist/style.css"></style>
<style>
.invalid {
  border-color: red;
}
</style>
