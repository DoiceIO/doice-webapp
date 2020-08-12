import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";

import "./assets/styles/index.css";

Vue.config.productionTip = false;

import Socket from "./Socket";

const socket = new Socket();
Vue.prototype.$socket = socket;

// Register global components
import DInput from "./components/globals/DInput";
import DButton from "./components/globals/DButton";
import DLoader from "./components/globals/DLoader";
import DContextMenu from "./components/globals/DContextMenu";
import DContextMenuItem from "./components/globals/DContextMenuItem";
import DCopy from "./components/globals/DCopy";
Vue.component("d-input", DInput);
Vue.component("d-btn", DButton);
Vue.component("d-loader", DLoader);
Vue.component("d-context-menu", DContextMenu);
Vue.component("d-context-menu-item", DContextMenuItem);
Vue.component("d-copy", DCopy);

// Register filters
const filters = {
  truncate: (str, length, ending = "...") => {
    if (!str) return;
    let substr = str.substr(0, length);
    if (substr.length < str.length) {
      substr += ending;
    }
    return substr;
  },

  formatDate(date) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    var d = new Date(date),
      month = "" + d.getMonth(),
      day = "" + d.getDate(),
      year = d.getFullYear();

    return `${months[month]} ${day}, ${year}`;
  },

  formatTime(time) {
    if (isNaN(time)) time = 0;
    return new Date(time * 1000).toISOString().substr(11, 8);
  }
};

for (const filter in filters) {
  Vue.filter(filter, filters[filter]);
}

socket.on("connect", () => {
  window.socket = socket.socket;

  new Vue({
    store: store({ socket }),
    router,
    render: h => h(App)
  }).$mount("#app");
});
