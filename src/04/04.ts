import fs from 'node:fs/promises';

const getData = async () => {
    const data = fs.readFile('small_input.txt', {
        encoding: "utf8"
    })

    return data
}

const Part1 = (data: string) => {
    const board = data.split('\n').map(s => s.split(''))
    const n = board.length, m = board[0]?.length!

    // Checks 8-adjacent cells
    const getNumSurrounding = (i: number, j: number) => {
        const isValidCell = (i: number, j: number) => {
            return (0 <= i && i < n) && (0 <= j && j < m)
        }

        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

        let count = 0
        for (const [dx, dy] of dirs) {
            if (dx === undefined || dy === undefined) {
                continue
            }

            const x = i + dx
            const y = j + dy

            if (!isValidCell(x, y)) {
                continue
            }

            const cell = board[x]![y]!

            if (cell === "@") {
                count += 1
            }
        }

        return count
    }

    let total = 0
    for (const [i, row] of board.entries()) {
        for (const [j, cell] of row.entries()) {
            if (cell == ".") {
                continue
            }

            const surrounding = getNumSurrounding(i, j)

            if (surrounding < 4) {
                total += 1
            }
        }
    }

    return total
}

const Part2 = (data: string) => {
    const board = data.split('\n').map(s => s.split(''))
    const n = board.length, m = board[0]?.length!

    // Checks 8-adjacent cells
    const getNumSurrounding = (i: number, j: number) => {
        const isValidCell = (i: number, j: number) => {
            return (0 <= i && i < n) && (0 <= j && j < m)
        }

        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]

        let count = 0
        for (const [dx, dy] of dirs) {
            if (dx === undefined || dy === undefined) {
                continue
            }

            const x = i + dx
            const y = j + dy

            if (!isValidCell(x, y)) {
                continue
            }

            const cell = board[x]![y]!

            if (cell === "@") {
                count += 1
            }
        }

        return count
    }

    let total = 0
    let runPrune = true

    // Re-run removal, until an iteration where none have been removed.
    // This signifies that the maximum possible has been removed.
    while (runPrune) {
        // Assume that no further pruning is required.
        runPrune = false
        for (const [i, row] of board.entries()) {
            for (const [j, cell] of row.entries()) {
                if (cell == ".") {
                    continue
                }

                const surrounding = getNumSurrounding(i, j)

                if (surrounding < 4) {
                    total += 1

                    // Optimistically remove
                    board[i]![j] = "."

                    // Another run is required, as the removal may have
                    // opened up more possibilities.
                    runPrune = true
                }
            }
        }
    }

    return total
}

const data = await getData()

// ans1: 1393
const ans1 = Part1(data)
console.log(ans1)

// ans2: 8643
const ans2 = Part2(data)
console.log(ans2)