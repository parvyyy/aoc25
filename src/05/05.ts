import fs from 'node:fs/promises';


const getData = async () => {
    const data = fs.readFile('input.txt', {
        encoding: "utf8"
    })

    return data
}

// Reaches maximum size of a set, memory-limit exceeded.
const Part1Naive = (data: string) => {
    const [ranges, ingredients] = data.split('\n\n')

    if (!ranges || !ingredients) {
        return 0
    }

    const fresh = new Set<number>()
    for (const range of ranges.split('\n')) {
        const [start, end] = range.split('-').map(Number)

        if (!start || !end) {
            return 0
        }

        for (let i = start; i <= end; i++) {
            fresh.add(i)
        }
    }

    let total = 0
    for (const ingredient of ingredients.split('\n')) {
        if (fresh.has(Number(ingredient))) {
            total += 1
        }
    }

    return total
}

const data = await getData()

// ans1: 17196
const ans1 = Part1(data)
console.log(ans1)

// // ans2: 171039099596062
// const ans2 = Part2(data)
// console.log(ans2)