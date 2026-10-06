"use client";

import dynamic from "next/dynamic";

export { type BlockEditorHandle } from "./BlockEditor";
export default dynamic(() => import("./BlockEditor"), { ssr: false });
