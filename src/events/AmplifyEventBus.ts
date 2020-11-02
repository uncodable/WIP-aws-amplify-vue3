class AmplifyEventBus {
  events: any;
  constructor() {
    this.events = {};
  }

  on(eventName: string | number, fn: any) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  off(eventName: string | number, fn: any) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }

  trigger(eventName: string | number, data: any) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
}

export default new AmplifyEventBus();
