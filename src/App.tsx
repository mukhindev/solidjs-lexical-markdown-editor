import type { Component } from "solid-js";

import styles from "./App.module.scss";
import { MarkdownEditor } from "./modules/markdown-editor";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <MarkdownEditor />
    </div>
  );
};

export default App;
