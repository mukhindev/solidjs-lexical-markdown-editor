import { Component, onMount } from "solid-js";

import { useLexicalEditor } from "./LexicalComposer";

export const LexicalEditableContent: Component = () => {
  let rootElement: HTMLDivElement | undefined;
  let isEditable = true;

  const getEditor = useLexicalEditor();

  onMount(() => {
    getEditor()?.setRootElement(rootElement!);
  });

  return <div contentEditable={isEditable} ref={rootElement} />;
};
