import {
  Component,
  JSX,
  Accessor,
  createContext,
  createSignal,
  onMount,
  useContext,
} from "solid-js";

import { createEditor, EditorConfig, LexicalEditor } from "lexical";
import { registerRichText } from "@lexical/rich-text";
import { mergeRegister } from "@lexical/utils";

import styles from "./LexicalComposer.module.scss";

export const LexicalEditorContext = createContext<Accessor<LexicalEditor>>();

export const LexicalComposer: Component<{
  initialConfig: EditorConfig;
  children: JSX.Element;
}> = (props) => {
  let rootElement: HTMLDivElement;
  const [editor] = createSignal(createEditor(props.initialConfig));

  onMount(() => {
    mergeRegister(registerRichText(editor()));
  });

  return (
    <LexicalEditorContext.Provider value={editor}>
      <div class={styles.LexicalComposer} ref={rootElement}>
        {props.children}
      </div>
    </LexicalEditorContext.Provider>
  );
};

export const useLexicalEditor = () => {
  return useContext(LexicalEditorContext);
};
