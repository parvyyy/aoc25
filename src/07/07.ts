import fs from "node:fs/promises"

const getData = async () => {
    const data = fs.readFile("input.txt", {
        encoding: "utf8"
    })

    return data
}

const Part1 = (data: string) => {
    const levels = data.split('\n').map(l => l.split(''))

    const initial_beam = levels[0]?.indexOf("S")
    const beams = new Set<number>()

    if (initial_beam === undefined) {
        return 0
    }

    beams.add(initial_beam)

    let total = 0

    // Progress down the level, checking if a beam intersects.
    // If it does, edit ``beams`` to split.
    for (let level = 1; level < levels[0]?.length!; level++) {
        const split_beams = []
        for (const beam of beams) {
            // We cannot immediately add, as adding a beam to the
            // right will cause additional counting.
            if (levels[level]![beam] === "^") {
                split_beams.push(beam)
                total += 1
            }
        }

        for (const beam of split_beams) {
            beams.delete(beam)
            beams.add(beam - 1)
            beams.add(beam + 1)
        }
    }

    return total
}

const Part2 = (data: string) => {
    const levels = data.split('\n').map(l => l.split(''))

    const initial_beam = levels[0]?.indexOf("S")

    // Maps the index to the existing amount of paths
    // to reach that index.
    const beams = new Map<number, number>()

    if (initial_beam === undefined) {
        return 0
    }

    beams.set(initial_beam, 1)

    for (let level = 1; level < levels[0]?.length!; level++) {
        const split_beams: number[] = []
        for (const beam_pos of beams.keys()) {
            // We break identification & updating into two sections
            // to prevent concurrent modification.
            if (levels[level]![beam_pos] === "^") {
                split_beams.push(beam_pos)
            }
        }

        for (const beam of split_beams) {
            // The amount of paths is the sum of the current paths to that column
            // plus the additional paths added via the split.
            beams.set(beam - 1, (beams.get(beam - 1) || 0) + (beams.get(beam) || 0))
            beams.set(beam + 1, (beams.get(beam + 1) || 0) + (beams.get(beam) || 0))

            beams.set(beam, 0)
        }
    }

    // Sum the count of the possible paths to every column.
    let total = beams.values().reduce((s, v) => s + v, 0)

    return total
}

const data = await getData()

// ans1: 1585
const ans1 = Part1(data)
console.log(ans1)

// // ans2: 9770311947567
const ans2 = Part2(data)
console.log(ans2)

