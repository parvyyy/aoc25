import fs from 'node:fs/promises';

const getData = async () => {
    const data = fs.readFile('input.txt', {
        encoding: "utf8"
    })

    return data
}

const Part1 = (data: string) => {
    const [time, distance] = data.split('\n')

    if (!time || !distance) {
        return null
    }

    const dist_re = distance?.match(/Distance:\s*(.*)/)
    const time_re = time?.match(/Time:\s*(.*)/)

    if (!dist_re || !time_re) {
        return null
    }

    const distances = dist_re[1]?.trim().split(/\s+/).map(s => parseInt(s)) ?? []
    const times = time_re[1]?.trim().split(/\s+/).map(s => parseInt(s)) ?? []

    const permutations = Array(distances.length)

    for (const [i, time] of times.entries()) {
        // Determine the minimum `k` such that `k` * `n-k`
        // surpasses the necessary distance.


        for (let k = 0; k < time; k++) {
            const dist = distances[i] ?? 0

            // All values between `k` and `n-k` are valid due
            // to symmetry.
            if (k * (time - k) > dist) {
                permutations[i] = (time + 1 - (2 * k))
                break
            }
        }
    }

    const prod = permutations.reduce((acc, curr) => acc * curr, 1)
    return prod
}

// Suprisingly, a more simple version of Part 1, only handling one distance
// and corresponding time.
const Part2 = (data: string) => {
    const [time, distance] = data.split('\n')

    if (!time || !distance) {
        return null
    }

    const dist_re = distance?.match(/Distance:\s*(.*)/)
    const time_re = time?.match(/Time:\s*(.*)/)

    if (!dist_re || !time_re) {
        return null
    }

    const dist = parseInt(dist_re[1]?.replaceAll(' ', '') ?? '')
    const t = parseInt(time_re[1]?.replaceAll(' ', '') ?? '')

    for (let k = 0; k < t; k++) {
        // All values between `k` and `n-k` are valid due
        // to symmetry.
        if (k * (t - k) > dist) {
            return (t + 1 - (2 * k))
        }
    }
}

const data = await getData()

// ans1: 303600
const ans1 = Part1(data)
console.log(ans1)

// ans2: 23654842
const ans2 = Part2(data)
console.log(ans2)