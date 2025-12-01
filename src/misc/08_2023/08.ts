import fs from 'node:fs/promises';

const getData = async () => {
    const data = fs.readFile('input.txt', {
        encoding: "utf-8"
    })

    return data
}

type DesertNode = {
    left: string;
    right: string;
}

const Part1 = (data: string) => {
    const [instructions, _, ...neighbours] = data.split('\n')

    if (!instructions) {
        return null
    }

    // Create the data-structure based on the connections between nodes.
    const mappings = new Map<string, DesertNode>()
    
    const re = /([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/;
    for (const neighbour of neighbours) {
        const items = neighbour.match(re);

        if (!items) {
            return null;
        }

        // Destructure
        const [, src, left, right] = items;
        
        if (!src || !left || !right) {
            return null;
        }

        mappings.set(src, {
            left,
            right
        })
    }

    let count = 0
    let curr = "AAA"
    while (true) {
        for (const instruction of instructions) {
            if (curr === "ZZZ") {
                return count
            }

            const res = mappings.get(curr)
            if (!res) {
                return null
            }

            switch (instruction) {
                case "L":
                    curr = res.left
                    break
                case "R":
                    curr = res.right
                    break
                default:
                    console.log(`ERROR: Inappropriate instruction: ${instruction}`)
            }

            count += 1
        }
    }

    // Unreachable, assumes that a path is guarenteed with enough iterations.
    return 0
}

// Time Limit Exceeded
// Progresses every state sequentially, checking if they are ALL within an
// `end` position.
const Part2Naive = (data: string) => {
    const [instructions, _, ...neighbours] = data.split('\n')

    if (!instructions) {
        return null
    }

    // All nodes ending in 'A'
    const currs = []

    // Create the data-structure based on the connections between nodes.
    const mappings = new Map<string, DesertNode>()
    
    const re = /([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/;
    for (const neighbour of neighbours) {
        const items = neighbour.match(re);

        if (!items) {
            return null;
        }

        // Destructure
        const [, src, left, right] = items;
        
        if (!src || !left || !right) {
            return null;
        }

        if (src.endsWith("A")) {
            currs.push(src)
        }

        mappings.set(src, {
            left,
            right
        })
    }

    let count = 0
    while (true) {
        for (const instruction of instructions) {
            // Determine if reached nodes ending with 'Z'.
            let end = true
            for (const c of currs) {
                if (!c.endsWith("Z")) {
                    end = false
                }
            }

            if (end) {
                return count
            }


            for (const [i, curr] of currs.entries()) {
                const res = mappings.get(curr)
                if (!res) {
                    return null
                }

                switch (instruction) {
                    case "L":
                        currs[i] = res.left
                        break
                    case "R":
                        currs[i] = res.right
                        break
                    default:
                        console.log(`ERROR: Inappropriate instruction: ${instruction}`)
                }
            }

            count += 1
        }
    }
}

// Determines the total number of steps to reach each `end` position
// for each starting node, and then determines their LCM.
const Part2 = (data: string) => {
    const [instructions, _, ...neighbours] = data.split('\n')

    if (!instructions) {
        return null
    }

    // All nodes ending in 'A'
    const srcs = []

    // Create the data-structure based on the connections between nodes.
    const mappings = new Map<string, DesertNode>()
    
    const re = /([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/;
    for (const neighbour of neighbours) {
        const items = neighbour.match(re);

        if (!items) {
            return null;
        }

        // Destructure
        const [, src, left, right] = items;
        
        if (!src || !left || !right) {
            return null;
        }

        if (src.endsWith("A")) {
            srcs.push(src)
        }

        mappings.set(src, {
            left,
            right
        })
    }

    let curr_counts = new Array(srcs.length)
    for (const [i, src] of srcs.entries()) {
        let count = 0

        if (!src) {
            return null
        }
        
        let curr = src
        let isEndFound = false
        while (!isEndFound) {
            for (const instruction of instructions) {
                if (curr?.endsWith("Z")) {
                    curr_counts[i] = count

                    isEndFound = true
                    break
                }

                const res = mappings.get(curr)
                if (!res) {
                    return null
                }

                switch (instruction) {
                    case "L":
                        curr = res.left
                        break
                    case "R":
                        curr = res.right
                        break
                    default:
                        console.log(`ERROR: Inappropriate instruction: ${instruction}`)
                }

                count += 1
            }
        }
    }


    // While this works, it assumes that each start corresponds to
    // a SINGULAR `end`, and that each of these are disjoint from one another.
    // This is not a guarentee from the problem, and without it, determining the
    // point of overlap would be much much more tricky.

    // E.g. If the pattern was not 0,3,6,... but rather 1,4,7,... then finding the LCM
    // would not work.

    // More here: https://www.reddit.com/r/adventofcode/comments/18dg1hw/2023_day_8_part_2_about_the_correctness_of_a/

    // Determine LCM of ``curr_counts``.
    const gcd = (a: number, b: number) => {
        if (b === 0) {
            return a;
        }

        return gcd(b, a % b);
    }

    const lcm = (a: number, b: number) => {
        if (a === 0 || b === 0) {
            return 0;
        }

        return Math.abs(a * b) / gcd(a, b);
    }

    let curr_lcm = 1
    for (const count of curr_counts) {
        curr_lcm = lcm(curr_lcm, count)
    }

    return curr_lcm
}

const data = await getData()

// ans1: 12169
const ans1 = Part1(data)
console.log(ans1)

// ans2: 12,030,780,859,469
const ans2 = Part2(data)
console.log(ans2)