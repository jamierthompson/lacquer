"use client";
/**
 * One status per thread, held in React state. Components receive the status
 * as a prop and render from it; nothing reads message text (LQ-MACHINE-01).
 * The reducer is the module's table lookup, so React holds the status and
 * nothing else beside it (LQ-MACHINE-05).
 */
import { useReducer } from "react";

import { initial, type Status, transition } from "./message-state-machine";

export function useMessageMachine(start: Status = initial) {
  return useReducer(transition, start);
}
