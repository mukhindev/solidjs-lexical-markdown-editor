import { createEffect, createSignal, onMount } from "solid-js";
import { $getSelection, COMMAND_PRIORITY_EDITOR, createCommand } from "lexical";

import {
  $getElementGridForTableNode,
  $getTableCellNodeFromLexicalNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $insertTableColumn,
  TableCellNode,
  TableNode,
} from "@lexical/table";

import { useLexicalEditor } from "../LexicalComposer";

import styles from "./TablePlugin.module.scss";

const I_C = createCommand("I_C");

const D_T = createCommand("D_T");

export const TablePlugin = () => {
  const getEditor = useLexicalEditor();
  let cellButtonElement: HTMLDivElement;

  const [getTableNode, setTableNode] = createSignal<TableNode | null>(null);

  const [getTableCellNode, setTableCellNode] =
    createSignal<TableCellNode | null>(null);

  onMount(() => {
    const editor = getEditor();

    if (editor) {
      editor.registerCommand(
        I_C,
        () => {
          const tableNode = getTableNode();

          if (tableNode) {
            const grid = $getElementGridForTableNode(editor, tableNode);

            $insertTableColumn(tableNode, 2, true, 1, grid);
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      editor.registerCommand(
        D_T,
        () => {
          const tableNode = getTableNode();

          if (tableNode) {
            tableNode.remove();
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      );

      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const selection = $getSelection();

          if (selection) {
            const [node] = selection.getNodes();

            try {
              setTableNode($getTableNodeFromLexicalNodeOrThrow(node));
            } catch (error) {
              setTableNode(null);
            }

            setTableCellNode($getTableCellNodeFromLexicalNode(node));
          }
        });
      });
    }
  });

  createEffect(() => {
    const editor = getEditor();

    if (editor) {
      console.log(getTableNode());

      const tableCellNode = getTableCellNode();

      if (tableCellNode) {
        const tableCellNodeKey = tableCellNode.getKey();

        const tableCellNodeElement = editor.getElementByKey(tableCellNodeKey);
        const tableCellRect = tableCellNodeElement?.getBoundingClientRect();

        if (tableCellRect) {
          cellButtonElement.style.opacity = "1";
          cellButtonElement.style.top = `${tableCellRect.top}px`;
          cellButtonElement.style.left = `${tableCellRect.right}px`;
        }
      } else {
        cellButtonElement.style.opacity = "0";
      }
    }
  });

  if (!getTableCellNode) {
    return null;
  }

  const insertTableColumn = () => {
    getEditor()?.dispatchCommand(I_C, undefined);
  };

  const deleteTable = () => {
    getEditor()?.dispatchCommand(D_T, undefined);
  };

  return (
    <div class={styles.TablePlugin} ref={cellButtonElement}>
      TablePlugin
      <button onClick={insertTableColumn}>+</button>
      <button onClick={deleteTable}>x</button>
    </div>
  );
};
