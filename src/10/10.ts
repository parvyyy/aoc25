import fs from "node:fs/promises"

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
        const steps = configurePart2(machine)
        console.log(`Steps: ${steps}`)

        total += steps
    }

    return total
}

const data = await getData()

// ans1: 
const ans1 = Part1(data)
console.log(ans1)

// const ans2 = Part2(data)
// console.log(ans2)