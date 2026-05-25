import "bootstrap/dist/css/bootstrap-grid.min.css";
import "./styles/layout.css";
import "./app.css";
import App from "./App.svelte";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
