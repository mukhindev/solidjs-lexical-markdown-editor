import { Component, onMount } from "solid-js";

import { useLexicalEditor } from "./LexicalComposer";

export const LexicalEditableContent: Component = () => {
  let ref: HTMLDivElement;
  let isEditable = true;

  const getEditor = useLexicalEditor();

  onMount(() => {
    getEditor()?.setRootElement(ref);
  });

  return <div contentEditable={isEditable} ref={ref} />;
};
