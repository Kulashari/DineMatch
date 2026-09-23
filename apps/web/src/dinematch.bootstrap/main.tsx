import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DineMatchApp } from "../dinematch.ui/app/DineMatchApp";
import "../dinematch.ui/styles/global.css";
import { createDependencies } from "./createDependencies";

const dependencies = createDependencies();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DineMatchApp {...dependencies} />
  </StrictMode>,
);
