// src/extensions/table/calculate-col-sizes.ts
export default function calculateColSizes (ast: string[][]): number[] {
    const sizes = []
    for (let col = 0; col < ast[0].length; col++) {
        let colSize = 0
        for (let row = 0; row < ast.length; row++) {
            const cell = ast[row][col]
            let cellLength = cell.length
            if (cell.includes('\n')) {
                // Multi-line cell -> take the longest of the containing rows
                cellLength = Math.max(...cell.split('\n').map(x => x.length))
            }

            if (cellLength > colSize) {
                colSize = cellLength
            }
        }
        sizes.push(colSize)
    }
    return sizes
}