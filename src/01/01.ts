import fs from 'node:fs/promises';

const getData = async () => {
    const data = fs.readFile('input.txt', {
        encoding: "utf8"
    })

    return data
}

const Part1 = (data: string) => {
    const rotations = data.split('\n');

    let dial_delta = 50
    let count = 0
    for (const rotation of rotations) {
        const dir = rotation[0]
        const amnt = parseInt(rotation.slice(1))

        switch (dir) {
            case "L":
                dial_delta -= amnt
                break
            case "R":
                dial_delta += amnt
                break
            
            // Nonsensical value.
            default:
                console.log(`ERROR Invalid dir: ${dir}`)
                return -1
        }

        count += Number(dial_delta % 100 == 0)
    }

    return count
}

const Part2 = (data: string) => {
    const rotations = data.split('\n');

    // Total number of values in one rotation (0 .. N-1)
    const N = 100

    let dial_delta = 50
    let count = 0
    for (const rotation of rotations) {
        const dir = rotation[0]
        const amnt = parseInt(rotation.slice(1))

        const complete_rotations = Math.floor(amnt / N)
        const rem_amnt = amnt % N

        const init_zero = dial_delta == 0
        
        switch (dir) {
            case "L":
                dial_delta -= rem_amnt
                break
            case "R":
                dial_delta += rem_amnt
                break
            
            // Nonsensical value.
            default:
                console.log(`ERROR Invalid dir: ${dir}`)
                return -1
        }

        count += complete_rotations
        if (dial_delta <= 0 || dial_delta >= N) {
            // Excludes edge-case where the dial initially points
            // to zero, which will NOT trigger a click.
            if (!init_zero) {
                count += 1
            }
        }

        // Ensures that ``dial_delta`` is bounded by [0, N]
        // rather than [-N, N]
        dial_delta = ((dial_delta % N) + N) % N
    }

    return count
}

const data = await getData()

// ans1: 1165
const ans1 = Part1(data)
console.log(ans1)

// ans2: 6496
const ans2 = Part2(data)
console.log(ans2)