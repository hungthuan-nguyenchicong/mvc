/// <reference lib="dom" />
import "./styles.css";
//import { createRoot } from "react-dom/client";
import { App } from "./app.tsx";

// document.addEventListener("DOMContentLoaded", () => {
//   //const root = createRoot(document.getElementById("root"));
//   //root.render(<App />);
//   const targetElement = document.getElementById("root"); // how do i fix this error
// const root = ReactDOM.createRoot(targetElement!);
// root.render(
//   <React.StrictMode>
//       <App />
//   </React.StrictMode>
// );
// });

import * as ReactDOM from 'react-dom/client';
//import { Component } from "./Component"
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);