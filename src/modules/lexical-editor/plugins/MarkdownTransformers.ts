import { LexicalNode, $createTextNode, $createParagraphNode } from "lexical";

import {
  TRANSFORMERS,
  TextMatchTransformer,
  ElementTransformer,
} from "@lexical/markdown";

import {
  TableNode,
  $createTableNode,
  $createTableRowNode,
  $createTableCellNode,
  $isTableNode,
  $isTableRowNode,
  $isTableCellNode,
  TableCellHeaderStates,
} from "@lexical/table";

export const TABLE_ROW_REGEXP = /^\|.*\|$/;
const tableData: string[][] = [];

let prevTableNode: TableNode;
let currentTableNode: TableNode;

export const TABLE_TRANSFORMER: ElementTransformer = {
  dependencies: [TableNode],
  export: (node, exportChildren) => {
    if (!$isTableNode(node)) {
      return null;
    }

    const output = [];

    for (const row of node.getChildren()) {
      const rowOutput = [];
      let isHeader = false;

      if ($isTableRowNode(row)) {
        for (const cell of row.getChildren()) {
          if ($isTableCellNode(cell)) {
            isHeader = cell.hasHeader();
            rowOutput.push(exportChildren(cell));
          }
        }
      }

      output.push(`| ${rowOutput.join(" | ")} |`);

      if (isHeader) {
        const headerDivider = Array.from({
          length: row.getChildren().length,
        }).fill("---");

        output.push(`| ${headerDivider.join(" | ")} |`);
      }
    }

    return output.join("\n");
  },
  regExp: TABLE_ROW_REGEXP,
  replace: (node, _, match) => {
    /*
      | шапка 1 | шапка 2 | шапка 3 |
      |---------|---------|---------|
      | а       | б       | в       |
      | г       | д       | е       |

      | шапка 4 | шапка 5 | шапка 6 |
      |---------|---------|---------|
      | ё       | ж       | и       |
      | к       | л       | м       |
    */

    const [row] = match;

    const rowData = row
      .split("|")
      .slice(1, -1)
      .map((el) => el.trim());

    tableData.push(rowData);

    if (row.includes("---")) {
      // Удаляем последнюю строку у предыдущей таблицы, если туда попала шапка следующей
      if (prevTableNode) {
        const prevTableNodeChildren = prevTableNode.getChildren();
        const prevTableLastRow = prevTableNodeChildren.at(-1);
        prevTableLastRow?.remove();
      }

      // Создание ноды таблицы
      currentTableNode = $createTableNode();
      currentTableNode.setIndent(2);

      const headerData = tableData.at(-2);

      if (headerData) {
        const header = createTableRowFromData(headerData, true);
        currentTableNode.append(header);
        node.replace(currentTableNode);
      }
    } else {
      if (currentTableNode) {
        const row = createTableRowFromData(rowData);
        currentTableNode.append(row);
      }
    }

    prevTableNode = currentTableNode;

    // Удаляем оригинальные текстовые ноды
    node.remove();
  },
  type: "element",
};

const createTableRowFromData = (rowData: string[], isHeader = false) => {
  const row = $createTableRowNode();

  for (const cellData of rowData) {
    const headerState = isHeader
      ? TableCellHeaderStates.ROW
      : TableCellHeaderStates.NO_STATUS;

    const cell = $createTableCellNode(headerState);
    const paragraph = $createParagraphNode();
    const text = $createTextNode(cellData);

    paragraph.append(text);
    cell.append(paragraph);
    row.append(cell);
  }

  return row;
};

export const MARKDOWN_TRANSFORMERS = [TABLE_TRANSFORMER, ...TRANSFORMERS];
