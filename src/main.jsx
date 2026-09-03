import ReactDOM from "react-dom/client";
import "./styles/theme.css";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode намеренно отключён: даёт двойной вызов эффектов и ломает Tiptap useEditor
  <App />
);
