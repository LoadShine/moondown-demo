// src/moondown/extensions/table/build-pipe.ts
import calculateColSizes from './calculate-col-sizes.ts'
import type { ColAlignment } from './types.ts'

export default function buildPipeTable (ast: string[][], colAlignment: ColAlignment[]): string {
    if (ast.length < 2) {
        throw new Error('Cannot build pipe table: Must have at least two rows.')
    }

    // First, calculate the column sizes
    const colSizes = calculateColSizes(ast)

    // Then, build the table in a quick MapReduce fashion
    const rows = ast.map(row => {
        const rowContents = row.map((col, idx) => {
            if (colAlignment[idx] === 'right') {
                return col.padStart(colSizes[idx], ' ')
            } else {
                return col.padEnd(colSizes[idx], ' ')
            }
        }).join(' | ')
        return `| ${rowContents} |`
    })

    // Finally, insert the required header row at index 2
    const headerRowContents = colSizes.map((size, idx) => {
        if (colAlignment[idx] === 'left') {
            return '-'.repeat(size + 2)
        } else if (colAlignment[idx] === 'center') {
            return ':' + '-'.repeat(size) + ':'
        } else {
            return '-'.repeat(size + 1) + ':'
        }
    }).join('|')

    const headerRow = `|${headerRowContents}|`
    rows.splice(1, 0, headerRow)

    return rows.join('\n')
}