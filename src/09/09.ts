import fs from "node:fs/promises"

const getData = async () => {
    const data = fs.readFile("input.txt", {
        encoding: "utf8"
    })

    return data
}

type Vec2 = [number, number]

const Part1 = (data: string) => {
    const points = data.split('\n').map(l => l.split(',').map(Number) as Vec2)

    const area = (v1: Vec2, v2: Vec2) => {
        return (Math.abs(v2[0] - v1[0]) + 1) * (Math.abs(v2[1] - v1[1]) + 1) 
    }

    let maxx_area = 0
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            maxx_area = Math.max(maxx_area, area(points[i]!, points[j]!))
        }
    }

    return maxx_area
}

const Part2 = (data: string) => {
    const points = data.split('\n').map(l => l.split(',').map(Number) as Vec2)
    const n = points.length
    
    const grid: string[][] = Array.from({ length: n + 1 }, () => Array(n + 1).fill("."))

    const XCoordinateCompression = new Map<number, number>()
    const XPoints = points
                        .map(p => p[0])
                        .sort((a, b) => a - b)
    XPoints.forEach((v, i) => XCoordinateCompression.set(v, i))

    const YCoordinateCompression = new Map<number, number>()
    const YPoints = points
                        .map(p => p[1])
                        .sort((a, b) => a - b)
    YPoints.forEach((v, i) => YCoordinateCompression.set(v, i))

    const CompressedPoints = points.map((p) => {
        return [
            XCoordinateCompression.get(p[0]),
            YCoordinateCompression.get(p[1]),
        ] as Vec2
    })
    
    // Add first value to complete the cycle.
    const src = points[0]!
    CompressedPoints.push([
        XCoordinateCompression.get(src[0]),
        YCoordinateCompression.get(src[1])
    ] as Vec2)

    const FillGrid = () => {
        // Join the outline.
        for (let i = 0; i < CompressedPoints.length - 1; i++) {
            const [c1, r1] = CompressedPoints[i]!, [c2, r2] = CompressedPoints[i + 1]!

            // Note: Either c1 is eq. to c2 OR r1 is eq. to r2.
            for (let j = Math.min(c1, c2); j <= Math.max(c1, c2); j++) {
                grid[r1]![j] = "X"
            }

            for (let j = Math.min(r1, r2); j <= Math.max(r1, r2); j++) {
                grid[j]![c1] = "X"
            }
        }

        // Fills the inner region, using the idea that a node is
        // INSIDE if its crosses a boundary (i.e. `X`) an odd number of
        // times.
        for (let i = 0; i < n; i++) {
            let parity = grid[i]![0] == "X" ? true : false
            for (let j = 1; j < n; j++) {
                const curr = grid[i]![j], prev = grid[i]![j - 1]

                if (curr === "X" && prev !== "X") {
                    parity = !parity
                }

                if (parity) {
                    grid[i]![j] = "X"
                }
            }
        }

        // THIS fixed the answer from 2977920000 to 1516172795
        // Unsure of why, but must relate to the isFilledArea logic.
        for (let i = 0; i < CompressedPoints.length; i++) {
            const [c1, r1] = CompressedPoints[i]!
            grid[r1]![c1] = "#"
        }
    }

    FillGrid()

    // Finds the area using the UNcompressed coordinates.
    const area = (v1: Vec2, v2: Vec2) => {
        const v1_u = [XPoints[v1[0]], YPoints[v1[1]]] as Vec2
        const v2_u = [XPoints[v2[0]], YPoints[v2[1]]] as Vec2

        return (Math.abs(v2_u[0] - v1_u[0]) + 1) * (Math.abs(v2_u[1] - v1_u[1]) + 1)
    }

    const isFilledArea = ([c1, r1]: Vec2, [c2, r2]: Vec2) => {
        const cMin = Math.min(c1, c2)
        const cMax = Math.max(c1, c2)
        const rMin = Math.min(r1, r2)
        const rMax = Math.max(r1, r2)

        for (let r = rMin + 1; r <= rMax - 1; r++) {
            for (let c = cMin + 1; c <= cMax - 1; c++) {
                if (grid[r]![c] !== "X") return false
            }
        }
        
        return true
    }

    let maxx_area = 0
    for (let i = 0; i < CompressedPoints.length; i++) {
        for (let j = i + 1; j < CompressedPoints.length; j++) {
            // Determine if the area is valid.
            const p1 = CompressedPoints[i]!, p2 = CompressedPoints[j]!

            if (isFilledArea(p1, p2)) {
                const currArea = area(p1, p2)
                maxx_area = Math.max(maxx_area, currArea)
            }
        }
    }

    return maxx_area
}



const Part2Naive = (data: string) => {
    const points = data.split('\n').map(l => l.split(',').map(Number) as Vec2)
    const n = points.reduce((s, c) => Math.max(s, c[1]), 0) // rows
    const m = points.reduce((s, c) => Math.max(s, c[0]), 0) // cols

    const grid: string[][] = Array.from({ length: n + 1 }, () => Array(m).fill("."))

    // To connect the end to the start, we add the original points
    // to complete the loop.
    points.push(points[0]!)

    // Create the outline
    for (let i = 0; i < points.length - 1; i++) {
        const [c1, r1] = points[i]!, [c2, r2] = points[i + 1]!

        // Note: Either c1 is eq. to c2 OR r1 is eq. to r2.
        for (let j = Math.min(c1, c2); j <= Math.max(c1, c2); j++) {
            grid[r1]![j] = "X"
        }

        for (let j = Math.min(r1, r2); j <= Math.max(r1, r2); j++) {
            grid[j]![c1] = "X"
        }
    }

    // Fills the inner region, using the idea that a node is
    // INSIDE if its crosses a boundary (i.e. `X`) an odd number of
    // times.
    for (let i = 0; i < n; i++) {

        let segment_parity = grid[i]![0] == "X" ? 1 : 0
        for (let j = 1; j < m; j++) {
            if (grid[i]![j] === "X") {
                if (grid[i]![j - 1] !== "X") {
                    segment_parity += 1
                }

                continue
            }

            if (segment_parity % 2 == 1) {
                grid[i]![j] = "X"
            }
        }
    }
 
    const area = (v1: Vec2, v2: Vec2) => {
        return (Math.abs(v2[0] - v1[0]) + 1) * (Math.abs(v2[1] - v1[1]) + 1) 
    }

    const isFilledArea = (v1: Vec2, v2: Vec2) => {
        // If an unbroken rect. between v1 and v2 exists
        // the entire area must be filled.
        const [c1, r1] = v1, [c2, r2] = v2

        for (let j = Math.min(c1, c2); j <= Math.max(c1, c2); j++) {
            if (grid[r1]![j] !== "X" || grid[r2]![j] !== "X") {
                return false
            }
        }

        for (let j = Math.min(r1, r2); j <= Math.max(r1, r2); j++) {
            if (grid[j]![c1] !== "X" || grid[j]![c2] !== "X") {
                return false
            }
        }

        return true;
    }

    let maxx_area = 0
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            // Determine if the area is valid.
            const p1 = points[i]!, p2 = points[j]!

            if (isFilledArea(p1, p2)) {
                maxx_area = Math.max(maxx_area, area(p1, p2))
            }
        }
    }

    return maxx_area
}

const data = await getData()

// ans1: 4790063600
const ans1 = Part1(data)
console.log(ans1)

// ans2: 1516172795
const ans2 = Part2(data)
console.log(ans2)