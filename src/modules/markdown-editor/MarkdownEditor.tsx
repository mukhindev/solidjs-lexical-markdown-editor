import { Component, createEffect, createSignal } from "solid-js";

import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";

import {
  LexicalComposer,
  LexicalEditableContent,
  MarkdownPlugin,
  TablePlugin,
} from "../lexical-editor";

import { markdownEditorTheme } from "./MarkdownEditorTheme";

const editorConfig = {
  namespace: "MarkdownEditor",
  theme: markdownEditorTheme,
  onError: console.log,
  nodes: [TableNode, TableRowNode, TableCellNode],
};

export const MarkdownEditor: Component = () => {
  const [getMarkdown, setMarkdown] = createSignal(`
Таблица 1:

| шапка 1 | шапка 2 | шапка 3 |
|---------|---------|---------|
| а       | б       | в       |
| г       | д       | е       |

Таблица 2:

| шапка 4 | шапка 5 | шапка 6 |
|---------|---------|---------|
| ё       | ж       | и       |
  `);

  createEffect(() => {
    console.log(getMarkdown());
  });

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <LexicalEditableContent />
      <MarkdownPlugin value={getMarkdown()} onChange={setMarkdown} />
      <TablePlugin />
    </LexicalComposer>
  );
};
