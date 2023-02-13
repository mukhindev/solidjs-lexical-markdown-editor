import { Component, onMount } from "solid-js";
import { $convertToMarkdownString } from "@lexical/markdown";

import { useLexicalEditor } from "../LexicalComposer";

import { MARKDOWN_TRANSFORMERS } from "./MarkdownTransformers";

export const MarkdownOutputPlugin: Component<{
  value: string;
  onChange: (markdown: string, isUpdated?: boolean) => void;
}> = (props) => {
  const editor = useLexicalEditor();

  onMount(() => {
    editor?.().registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS);

        props.onChange?.(markdown, props.value !== markdown);
      });
    });
  });

  return null;
};
