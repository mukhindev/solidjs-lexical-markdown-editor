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

const INSERT_TABLE_COLUMN = createCommand("INSERT_TABLE_COLUMN");
const REMOVE_TABLE = createCommand("REMOVE_TABLE");

export const TablePlugin = () => {
  const getEditor = useLexicalEditor();
  let cellActionsElement: HTMLDivElement | undefined;

  const [getTableNode, setTableNode] = createSignal<TableNode | null>(null);

  const [getTableCellNode, setTableCellNode] =
    createSignal<TableCellNode | null>(null);

  onMount(() => {
    const editor = getEditor();

    if (editor) {
      editor.registerCommand(
        INSERT_TABLE_COLUMN,
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
        REMOVE_TABLE,
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

    if (editor && cellActionsElement) {
      const tableCellNode = getTableCellNode();

      if (tableCellNode) {
        const tableCellNodeKey = tableCellNode.getKey();

        const tableCellNodeElement = editor.getElementByKey(tableCellNodeKey);
        const tableCellRect = tableCellNodeElement?.getBoundingClientRect();

        if (tableCellRect) {
          cellActionsElement.style.opacity = "1";
          cellActionsElement.style.top = `${tableCellRect.top}px`;
          cellActionsElement.style.left = `${tableCellRect.right}px`;
        }
      } else {
        cellActionsElement.style.opacity = "0";
      }
    }
  });

  if (!getTableCellNode) {
    return null;
  }

  const insertTableColumn = () => {
    getEditor()?.dispatchCommand(INSERT_TABLE_COLUMN, undefined);
  };

  const deleteTable = () => {
    getEditor()?.dispatchCommand(REMOVE_TABLE, undefined);
  };

  return (
    <div class={styles.TablePlugin} ref={cellActionsElement}>
      TablePlugin
      <button onClick={insertTableColumn}>+</button>
      <button onClick={deleteTable}>x</button>
    </div>
  );
};
