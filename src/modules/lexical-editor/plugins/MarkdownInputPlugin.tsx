import { Component, onMount } from "solid-js";
import { $convertFromMarkdownString } from "@lexical/markdown";

import { useLexicalEditor } from "../LexicalComposer";

import { MARKDOWN_TRANSFORMERS } from "./MarkdownTransformers";

export const MarkdownInputPlugin: Component<{
  value: string;
}> = (props) => {
  const editor = useLexicalEditor();

  onMount(() => {
    editor?.().update(() => {
      $convertFromMarkdownString(props.value, MARKDOWN_TRANSFORMERS);
    });
  });

  return null;
};
