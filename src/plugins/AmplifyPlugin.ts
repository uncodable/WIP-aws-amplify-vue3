import { App } from "vue";

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
      app.component(requiredComponent(c).default.name, requiredComponent(c));
    });

    app.config.globalProperties.$Amplify = AmplifyModules;
  }
};
