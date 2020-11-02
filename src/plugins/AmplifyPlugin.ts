import { App } from "vue";
import mitt from 'mitt';

const requiredModules = ["Auth", "I18n", "Logger"];
const requiredComponent = require.context(
  "@/components",
  true,
  /[A-Z]\w+\.(vue)$/
);

export default {
  install(app: App, AmplifyModules: any) {
    const missingModules = [];
    requiredModules.forEach(r => {
      if (!Object.keys(AmplifyModules).includes(r)) {
        missingModules.push(r);
      }
    });
    if (missingModules.length > 0) {
      return new Error(
        `AmplifyPlugin installation method did not receive required modules: ${missingModules.join(
          ", "
        )}.`
      );
    }

    requiredComponent.keys().forEach(c => {
      console.log(requiredComponent(c).default.name);
      app.component(requiredComponent(c).default.name, requiredComponent(c).default || requiredComponent(c));
    });

    const AmplifyEventBus = mitt();
    app.config.globalProperties.$AmplifyEventBus = AmplifyEventBus;
    app.config.globalProperties.$Amplify = AmplifyModules;
  }
};
