import { Component, onMount } from "solid-js";

import { useLexicalEditor } from "./LexicalComposer";

export const LexicalEditableContent: Component = () => {
  let ref: HTMLDivElement;
  let isEditable = true;

  const editor = useLexicalEditor();

  onMount(() => {
    editor?.().setRootElement(ref);
  });

  return <div contentEditable={isEditable} ref={ref} />;
};
