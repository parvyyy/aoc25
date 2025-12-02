import fs from 'node:fs/promises';

const getData = async () => {
    const data = fs.readFile('input.txt', {
        encoding: "utf8"
    })

    return data
}

const Part1 = (data: string) => {
    const ranges = data.split(",").map((range) => {
        const [start, end] = range.split("-")

        if (!start || !end) {
            return []
        }

        return [parseInt(start), parseInt(end)]
    })
    
    let total = 0
    for (const [start, end] of ranges) {
        if (!start || !end) {
            return null
        }

        for (let k = start; k <= end; k++) {
            const str_k = k.toString()
            const n = str_k.length

            // Cannot have a 2x repeating pattern
            // with an odd number of digits.
            if (n % 2 == 1) {
                continue
            }

            if (str_k.slice(0, n / 2) == str_k.slice(n / 2)) {
                total += k
            }
        }
    }

    return total
}

const Part2 = (data: string) => {
    const ranges = data.split(",").map((range) => {
        const [start, end] = range.split("-")

        if (!start || !end) {
            return []
        }

        return [parseInt(start), parseInt(end)]
    })
    
    let total = 0

    const gcd = (a: number, b: number) => {
        if (b === 0) {
            return a;
        }

        return gcd(b, a % b);
    }
    
    for (const [start, end] of ranges) {
        if (!start || !end) {
            return null
        }

        for (let k = start; k <= end; k++) {
            const str_k = k.toString()
            const n = str_k.length

            // Create a freq table, however the mappings
            // aren't too important.
            const counts = new Array(10).fill(0)

            for (const digit of str_k) {
                const d = parseInt(digit)
                counts[d] = counts[d] + 1
            }

            // Determine the greatest common denominator.
            const d = counts.reduce((acc, curr) => gcd(acc, curr), 0)

            // If the gcd is not greater than 2, there cannot be 
            // any repition.
            if (d <= 1) {
                continue
            }

            // Split the string into ``d`` parts, and confirm
            // they are all the same.
            const chunk_size = n / d
            const chunks = new Array(d)

            for (let i = 0, start = 0; i < d; i++, start += chunk_size) {
                chunks[i] = str_k.substring(start, start + chunk_size)
            }

            // Confirm that each chunk is the same.
            if (chunks.every(v => v === chunks[0])) {
                total += k;
            }
        }
    }
    return total
}

const data = await getData()

// ans1: 38437576669
const ans1 = Part1(data)
console.log(ans1)

// ans2: 49046150754
const ans2 = Part2(data)
console.log(ans2)