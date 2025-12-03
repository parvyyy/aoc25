import fs from 'node:fs/promises';

const getData = async () => {
    const data = fs.readFile('input.txt', {
        encoding: "utf8"
    })

    return data
}

const Part1 = (data: string) => {
    const banks = data.split('\n')

    let total = 0
    for (const bank of banks) {
        const batteries = bank.split('').map(Number)
        const n = batteries.length

        // Finds the highest leading digit (exc. last digit)
        const leading = Math.max(...batteries.slice(0, n - 1))

        // Find the highest trailing digit AFTER the leading.
        const lead_idx = batteries.indexOf(leading)
        const trailing = Math.max(...batteries.slice(lead_idx + 1, n))

        const joltage = leading * 10 + trailing

        total += joltage
    }

    return total
}

const Part2 = (data: string) => {
    const banks = data.split('\n')

    let total = 0
    for (const bank of banks) {
        const batteries = bank.split('').map(Number)
        const n = batteries.length

        const digits: number[] = []

        let start_idx = -1
        for (let i = 0; i < 12; i++) {
            // The current digit must be the max from this, ensuring that
            // I) It is after the prior digit
            // II) It allows all remaining digits to fit.
            const batteries_subset = batteries.slice(start_idx + 1, n + (i + 1 - 12))

            const nth = Math.max(...batteries_subset)
            const nth_idx = batteries_subset.indexOf(nth)

            digits.push(nth)

            // We increment as `nth_idx` is local to the subset. This allows
            // it to reference the index in the original `batteries`.
            start_idx += nth_idx + 1
        }

        let joltage = 0
        for (let i = 0; i < 12; i++) {
            const digit = digits[i]!
            joltage += (digit * 10 ** (11 - i))
        }

        total += joltage
    }

    return total
}

const data = await getData()

// ans1: 17196
const ans1 = Part1(data)
console.log(ans1)

// ans2: 171039099596062
const ans2 = Part2(data)
console.log(ans2)