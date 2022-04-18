//@ts-ignore
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import 'antd/dist/antd.css'
import App from "./App";
import './index.css'

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);