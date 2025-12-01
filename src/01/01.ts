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

const data = await getData()

// ans1: 1165
const ans1 = Part1(data)
console.log(ans1)