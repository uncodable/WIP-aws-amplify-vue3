# AWS Amplify Package - aws-amplify-vue3

## Setup

In your Vue app, install the following:

```

```

Then, alter main.js:

```
import Amplify, * as AmplifyModules from 'aws-amplify';
import { AmplifyPlugin } from 'aws-amplify-vue';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

createApp(App)
  .use(AmplifyPlugin, AmplifyModules)
  .mount("#app");

```
