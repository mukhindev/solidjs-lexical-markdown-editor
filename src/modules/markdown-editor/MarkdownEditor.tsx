import { Component, createEffect, createSignal } from "solid-js";

import {
  LexicalComposer,
  LexicalEditableContent,
  MarkdownInputPlugin,
  MarkdownOutputPlugin,
} from "../lexical-editor";

import { markdownEditorTheme } from "./MarkdownEditorTheme";

const editorConfig = {
  namespace: "MarkdownEditor",
  theme: markdownEditorTheme,
  onError: console.log,
  nodes: [],
};

export const MarkdownEditor: Component = () => {
  const [markdown, setMarkdown] = createSignal("");

  createEffect(() => {
    console.log(markdown());
  });

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <LexicalEditableContent />
      <MarkdownInputPlugin value={markdown()} />
      <MarkdownOutputPlugin value={markdown()} onChange={setMarkdown} />
    </LexicalComposer>
  );
};
