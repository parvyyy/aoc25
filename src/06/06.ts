import fs from "node:fs/promises"

const getData = async () => {
    const data = fs.readFile("input.txt", {
        encoding: "utf8"
    })

    return data
}

const Part1 = (data: string) => {
    const problems = data.split("\n")
                        .slice(0, -1)
                        .map(row => row.trim().split(/\s+/).map(Number))

    const operations = data.split("\n")
                           .slice(-1)
                           .map(op => op.trim().split(/\s+/))
                           .flat()

    let total = 0
    for (let i = 0; i < problems[0]?.length!; i++) {
        const operation = operations[i] ?? "+"
        let result = operation === "+" ? 0 : 1
        for (let j = 0; j < problems.length; j++) {
            switch (operation) {
                case "+":
                    result += problems[j]?.[i] ?? 0
                    break
                case "*":
                    result *= problems[j]?.[i] ?? 1
                    break
            }
        }

        total += result
    }

    return total
}

const Part2 = (data: string) => {
    const problems = data.split('\n')
    const n = problems.length
    const m = problems[0]?.length ?? 0

    const operations = data.split("\n")
                           .slice(-1)
                           .map(op => op.trim().split(/\s+/))
                           .flat()

    const problems_T: number[][] = Array.from({ length: operations.length}, () => [])
    let k = 0
    for (let i = 0; i < m; i++) {
        let num_str = ''

        // Go vertically through all rows to create `num_str`.
        // excluding the last as it contains the operation.
        for (let j = 0; j < n - 1; j++) {
            num_str += problems[j]![i]!
        }

        // All values in this row were spaces, hence this represents
        // the end of an problem (i.e. column break)
        if (num_str === " ".repeat(n - 1)) {
            k += 1
            continue
        }

        problems_T[k]?.push(Number(num_str))
    }

    let total = 0
    for (let i = 0; i < problems_T.length; i++) {
        const operation = operations[i]
        let res = (operation === "+") ? 0 : 1

        for (let j = 0; j < problems_T[i]!.length; j++) {
            switch (operation) {
                case "+":
                    res += problems_T[i]?.[j] || 0
                    break
                case "*":
                    res *= problems_T[i]?.[j] || 1
                    break
            }
        }

        total += res
    }

    return total


}
const data = await getData()

// ans1: 6891729672676
const ans1 = Part1(data)
console.log(ans1)

// ans2: 9770311947567
const ans2 = Part2(data)
console.log(ans2)
