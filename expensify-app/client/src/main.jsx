import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./store/store";
import App from "./App";
import AppRouter from "./routers/AppRouter";
import "normalize.css/normalize.css";
import "./styles/styles.scss";
import "react-datepicker/dist/react-datepicker.css";

const root = createRoot(document.getElementById("app"));
root.render(
  <Provider store={store}>
    <BrowserRouter
      basename="/projects/expensify-app"
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App>
        <AppRouter />
      </App>
    </BrowserRouter>
  </Provider>
);
