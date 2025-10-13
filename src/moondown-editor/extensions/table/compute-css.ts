// src/extensions/table/compute-css.ts
export default function computeCSS(edgeButtonSize: number): Element {
    const styleNode = document.createElement('style')
    styleNode.setAttribute('id', 'tableHelperCSS')
    styleNode.setAttribute('type', 'text/css')

    styleNode.textContent = `
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
    padding: 12px;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
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

  .table-helper-operate-button {
    z-index: 3;
  }

  .table-helper-operate-button {
    background-color: #fff;
    color: #4d5d75;
  }

  .table-helper-operate-button {
    opacity: 0.5;
    transition: 0.2s opacity ease;
    background-color: #eee;
    color: #333;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    position: absolute;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
  }

  .table-helper-operate-button.top,
  .table-helper-operate-button.bottom {
    width: ${edgeButtonSize * 1.2}px;
    height: ${edgeButtonSize * 0.6}px;
    border-radius: ${edgeButtonSize * 0.5}px;
  }

  .table-helper-operate-button.left,
  .table-helper-operate-button.right {
    width: ${edgeButtonSize * 0.6}px;
    height: ${edgeButtonSize * 1.2}px;
    border-radius: ${edgeButtonSize * 0.5}px;
  }

  .table-helper-operate-button:hover {
    opacity: 1;
  }
  
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
    
  .tippy-button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 2px;
    transition: background-color 0.3s;
  }
    
  .tippy-button:hover {
    background-color: #f0f0f0;
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