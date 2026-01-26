import { createContext } from "react";
import { KcContext } from "./KcContext";

export const KcContextEnv = createContext<KcContext | null>(null);