import fs from "node:fs/promises"
import { Matrix } from 'ml-matrix'

const getData = async () => {
    const data = fs.readFile("input.txt", {
        encoding: "utf8"
    })

    return data
}

type Machine = {
    n: number,              // The number of bits.
    light: number,          // The number representation.
    toggles: number[][]     // The toggles.
    joltage: number[]
}

const Part1 = (data: string) => {
    const to_light = (light: string) => {
        light = light
                    .replaceAll('.', '0')
                    .replaceAll('#', '1')
        
        return [parseInt(light, 2), light.length]
    }

    const machines = data.split('\n').map(l => {
        const parts = l.split(" ")
        const n = parts.length

        const [light, n_bits] = to_light(parts[0]?.slice(1, -1)!)
        const joltage = parts[n - 1]?.slice(1, -1).split(',').map(n => Number(n))!
        const toggles = parts.slice(1, -1).map(t => {
            return t.slice(1, -1).split(",").map(n => Number(n))
        })

        return {
            n: n_bits,
            light,
            toggles,
            joltage
        } as Machine
    })

    // DP
    const configure = (machine: Machine) => {
        // Map's a given sequence to the min. num
        // of steps req. from the original.
        const dp = new Map<number, number>()
        dp.set(machine.light, 0)

        const toggles = machine.toggles.map(toggle => {
            let toggle_num = 0
            for (const v of toggle) {
                toggle_num |= (1 << (machine.n - 1 - v))
            }

            return toggle_num
        })
        
        // NOTE: You cannot solve this with recursion, as that is
        //       a DFS. Instead, you want to consider this to be a BFS
        //       where each vertex is the bitmask of the lights, each edge
        //       is the application of the toggle, with a cost of 1.

        let q = [machine.light]
        while (q.length > 0) {
            const curr = q.shift()!
            const curr_steps = dp.get(curr)!

            if (curr === 0) {
                return curr_steps
            }

            for (const toggle of toggles) {
                const next = curr ^ toggle;

                if (!dp.has(next)) {
                    dp.set(next, curr_steps + 1)
                    q.push(next)
                }
            }
        }

        return -1000


        // OLD Sol, attempting to use a DFS.
        const recurse = (parent: number) => {
            if (dp.get(0) && dp.get(0)! < dp.get(parent)!) {
                return
            }

            for (const toggle of toggles) {
                const res = parent ^ toggle

                dp.set(res, Math.min(dp.get(res) ?? Number.POSITIVE_INFINITY, 
                                     dp.get(parent)! + 1))
                
                if (res === 0) {
                    console.log(`${toggle}`)
                    return
                }

                recurse(res)
            }

            return
        }
    }

    const configurePart2 = (machine: Machine) => {
        // An array is not valid as a `key` as it is
        // compared by reference not value.
        const dp = new Map<string, number>()

        const src = machine.joltage.join(',')
        const n = machine.joltage.length

        const sol = Array(n).fill(0).join(',')

        dp.set(src, 0)

        let q = [src]
        while (q.length > 0) {
            const curr = q.shift()!
            const curr_steps = dp.get(curr)!

            if (curr === sol) {
                return curr_steps
            }

            for (const toggle of machine.toggles) {
                const updated = curr.split(',').map(Number)
                let is_valid = true

                toggle.forEach(v => {
                    const u = updated[v]! - 1

                    if (u < 0) {
                        is_valid = false
                    }

                    updated[v] = u
                })

                const updated_str = updated.join(',')
                if (!dp.has(updated_str) && is_valid) {
                    dp.set(updated_str, curr_steps + 1)
                    q.push(updated_str)
                }
            }
        }

        return -1
    }

    let total = 0
    for (const machine of machines) {
        const steps = configure(machine)

        total += steps
    }

    return total
}

const Part2 = (data: string) => {
    /*
        As per, https://www.reddit.com/r/adventofcode/comments/1pl8nsa/2025_day_10_part_2_is_this_even_possible_without/
        i.e. (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
        Let x_i denote the number of clicks for the ith button.

        {3} = x_4 + x_5
        {5} = x_1 + x_5
        {4} = x_2 + x_3 + x_4
        {7} = x_0 + x_1 + x_3

        Then, we perform Gaussian Elimination (https://en.wikipedia.org/wiki/Gaussian_elimination) to retrieve 

        x_0 = 2 - x_3 + x_5
        x_1 = 5 - x_5
        x_2 = 1 - x_3 + x_5
        x_4 = 3 - x_5

        with two free variables x_3, x_5 which can be computed through brute force -- likely low.
    */

    // TODO: Research https://www.npmjs.com/package/na-gaussian-elimination

    const augmented = new Matrix([
        [0, 0, 0, 0, 1, 1, 3],
        [0, 1, 0, 0, 0, 1, 5],
        [0, 0, 1, 1, 1, 0, 4],
        [1, 1, 0, 1, 0, 0, 7],
    ]);

    console.log(augmented.reducedEchelonForm())

    /*
    Matrix {
            x0       x1       x2       x3       x4      x5        B
        [
            1        0        0        1        0       -1        2      
            0        1        0        0        0        1        5      
            0        0        1        1        0       -1        1      
            0        0        0        0        1        1        3      
        ]
        rows: 4
        columns: 7
    }

    The free variables (x_3 & x_5) are the cols. in which there is no leading 0.
    All rows can be written in equations in terms of these!

    */

}




const data = await getData()

// ans1: 
const ans1 = Part1(data)
console.log(ans1)

const ans2 = Part2(data)
console.log(ans2)