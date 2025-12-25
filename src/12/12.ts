import fs from "node:fs/promises"


const getData = async () => {
    const data = fs.readFile("input.txt", {
        encoding: "utf8"
    })

    return data
}

type RegionCriteria = {
    width: number,
    height: number,
    plots: number[]
}
const Part1 = (data: string) => {
    const parsed = data.split('\r\n\r\n')
    const presents = parsed
                        .slice(0, -1)               // Remove regions
                        .map(present => present
                                         .split('\r\n')
                                         .slice(1)       // Remove '0:'
                                         .join('')
                            )

    const regions = parsed
                        .slice(-1)[0]
                        ?.split('\r\n')
                        .map(l => {
                            const line = l.split(':')

                            const dimensions = line[0]
                                                ?.split('x')
                                                .map(n => Number(n))

                            const plots = line[1]
                                            ?.trim()
                                            .split(' ')
                                            .map(n => Number(n))
                            return {
                                width: dimensions![0],
                                height: dimensions![1],
                                plots
                            } as RegionCriteria                    
                        })

    const space = presents.map(v => v.split('#').length - 1)

    const determineOccupancy = (plots: number[], space: number[]) => {
        // Presents take at least 'k' tiles, where 'k' is the number
        // of spaces occupied by '#'.
        const getMinSpace = (idx: number) => space[idx]!

        // Presents take at most '9' tiles.
        const getMaxSpace = (_: number) => 9

        let minn = 0, maxx = 0
        for (let i = 0; i < plots.length; i++) {
            minn += plots[i]! * getMinSpace(i)
            maxx += plots[i]! * getMaxSpace(i)
        }

        return [minn, maxx]
    }

    let total = 0
    for (const region of regions!) {
        const [minn, maxx] = determineOccupancy(region.plots, space)

        // Naive sol -- assumes no packing & doesn't account for potential
        // dead space. 
        const fits = region.height * region.width >= maxx!
        total += (fits) ? 1 : 0
    }

    return total
}

const data = await getData()

// ans1: 
const ans1 = Part1(data)
console.log(ans1)

// const ans2 = Part2(data)
// console.log(ans2)