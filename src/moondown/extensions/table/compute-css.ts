// src/moondown/extensions/table/compute-css.ts
/**
 * Generates CSS styles for table helper interface
 *
 * Creates a comprehensive stylesheet that includes:
 * - Table styling with borders, shadows, and rounded corners
 * - Cell styling with focus states and minimum dimensions
 * - Operation button styling with hover effects
 * - Tippy.js menu integration
 * - Theme support for both light and dark modes
 *
 * @param edgeButtonSize - Base size for table operation buttons (affects button dimensions and border radius)
 * @returns Style element containing all table helper CSS rules
 */
export default function computeCSS(edgeButtonSize: number): Element {
    const styleNode = document.createElement('style')
    styleNode.setAttribute('id', 'tableHelperCSS')
    styleNode.setAttribute('type', 'text/css')

    styleNode.textContent = `
  /* --- Light Mode Table Styles --- */
  table.table-helper {
    width: 100%;
    display: inline-table;
    border: 1px solid #e0e0e0;
    padding: 0px;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  table.table-helper tr:first-child {
    font-weight: bold;
    background-color: #f0f0f0;
    color: #333;
  }
  table.table-helper tr:first-child td {
    border-right: 1px solid #e0e0e0;
  }
  table.table-helper td {
    padding: 8px;
    border: 1px solid #e0e0e0;
    min-width: 150px;
    caret-color: rgb(0, 0, 0);
    height: ${edgeButtonSize * 1.5}px;
    position: relative;
  }
  table.table-helper td:focus {
    background-color: #e6f7ff;
    outline: none;
  }
  
  /* Formatting styles for table content */
  table.table-helper td em {
    font-style: italic;
  }
  table.table-helper td strong {
    font-weight: bold;
  }
  table.table-helper td code {
    background-color: #f5f5f5;
    padding: 2px 4px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 0.9em;
  }
  table.table-helper td del {
    text-decoration: line-through;
  }
  table.table-helper td mark {
    background-color: #ffeb3b;
    padding: 2px 0;
  }
  table.table-helper td u {
    text-decoration: underline;
  }
  
  .table-helper-operate-button {
    background-color: #fff;
    color: #4d5d75;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  /* --- Dark Mode Table Styles --- */
  .dark table.table-helper {
    border-color: #4a5568;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
  }
  .dark table.table-helper tr:first-child {
    background-color: #2d3748;
    color: #e2e8f0;
  }
  .dark table.table-helper tr:first-child td {
    border-right-color: #4a5568;
  }
  .dark table.table-helper td {
    border-color: #4a5568;
    caret-color: #e2e8f0;
  }
  .dark table.table-helper td:focus {
    background-color: #4a5568;
  }
  
  /* Dark mode formatting styles */
  .dark table.table-helper td code {
    background-color: #1a202c;
    color: #e2e8f0;
  }
  .dark table.table-helper td mark {
    background-color: #975a16;
    color: #fef3c7;
  }
  
  .dark .table-helper-operate-button {
    background-color: #2d3748;
    color: #e2e8f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  /* --- Tippy.js Menu Styles --- */
  .tippy-box[data-theme~='custom'] {
    background-color: white;
    color: black;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .tippy-box[data-theme~='custom'][data-placement^='bottom'] > .tippy-arrow::before {
    border-bottom-color: white;
  }
  .tippy-box[data-theme~='custom'] .tippy-content {
    padding: 4px;
  }
  .tippy-button:hover {
    background-color: #f0f0f0;
  }
  
  /* Dark Mode Tippy.js */
  .dark .tippy-box[data-theme~='custom'] {
    background-color: #2d3748;
    color: #e2e8f0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  .dark .tippy-box[data-theme~='custom'][data-placement^='bottom'] > .tippy-arrow::before {
    border-bottom-color: #2d3748;
  }
   .dark .tippy-box[data-theme~='custom'][data-placement^='right'] > .tippy-arrow::before {
    border-right-color: #2d3748;
  }
  .dark .tippy-button:hover {
    background-color: #4a5568;
  }

  /* --- Common, Unchanged Styles --- */
  table.table-helper tr:first-child td {
    padding: 12px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .table-helper-operate-button {
    z-index: 3;
    opacity: 0.5;
    transition: 0.2s opacity ease;
    text-align: center;
    cursor: pointer;
    position: absolute;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .table-helper-operate-button:hover {
    opacity: 1;
  }
  .table-helper-operate-button.top, .table-helper-operate-button.bottom {
    width: ${edgeButtonSize * 1.2}px;
    height: ${edgeButtonSize * 0.6}px;
    border-radius: ${edgeButtonSize * 0.5}px;
  }
  .table-helper-operate-button.left, .table-helper-operate-button.right {
    width: ${edgeButtonSize * 0.6}px;
    height: ${edgeButtonSize * 1.2}px;
    border-radius: ${edgeButtonSize * 0.5}px;
  }
  .tippy-button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 2px;
    transition: background-color 0.3s;
  }
  .tippy-button i {
    display: block;
    width: 16px;
    height: 16px;
  }
  .alignment-options {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  `

    return styleNode
}