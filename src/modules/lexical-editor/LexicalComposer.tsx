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

export const LexicalEditorContext = createContext<
  Accessor<LexicalEditor | undefined>
>(() => undefined);

export const LexicalComposer: Component<{
  initialConfig: EditorConfig;
  children: JSX.Element;
}> = (props) => {
  const [getEditor] = createSignal(createEditor(props.initialConfig));

  onMount(() => {
    mergeRegister(registerRichText(getEditor()));
  });

  return (
    <LexicalEditorContext.Provider value={getEditor}>
      <div class={styles.LexicalComposer}>{props.children}</div>
    </LexicalEditorContext.Provider>
  );
};

export const useLexicalEditor = () => {
  return useContext(LexicalEditorContext);
};
