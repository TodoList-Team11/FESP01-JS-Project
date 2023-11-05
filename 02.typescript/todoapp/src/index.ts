import App from "./App";
const root = document.querySelector("#root");

(async () => {
  root!.appendChild(await App());
})();
