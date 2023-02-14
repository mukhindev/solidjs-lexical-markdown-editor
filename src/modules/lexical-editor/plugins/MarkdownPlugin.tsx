import { Component, onMount } from "solid-js";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from "@lexical/markdown";

import { useLexicalEditor } from "../LexicalComposer";

import { MARKDOWN_TRANSFORMERS } from "./MarkdownTransformers";

export const MarkdownPlugin: Component<{
  value: string;
  onChange: (markdown: string, isUpdated?: boolean) => void;
}> = (props) => {
  const getEditor = useLexicalEditor();

  onMount(() => {
    getEditor()?.update(() => {
      $convertFromMarkdownString(props.value, MARKDOWN_TRANSFORMERS);
    });

    getEditor()?.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(MARKDOWN_TRANSFORMERS);

        props.onChange?.(markdown, props.value !== markdown);
      });
    });
  });

  return null;
};
