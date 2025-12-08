import fs from "node:fs/promises"

const getData = async () => {
    const data = fs.readFile("input.txt", {
        encoding: "utf8"
    })

    return data
}

type Vec3 = [number, number, number]

const Part1 = (data: string) => {
    const boxes = data.split('\n').map(s => s.split(',').map(Number))
    const n = boxes.length

    const n_connections = 1000

    const distances: Vec3[] = []

    const find_dist = (p1: Vec3, p2: Vec3): number => {
        return Math.sqrt(
            (p1[0] - p2[0]) ** 2 +
            (p1[1] - p2[1]) ** 2 +
            (p1[2] - p2[2]) ** 2
        );
    };

    for (let v = 0; v < n; v++) {
        for (let u = v + 1; u < n; u++) {
            const d = find_dist(boxes[v] as Vec3, boxes[u] as Vec3)
            distances.push([v, u, d] as Vec3)
        }
    }

    distances.sort((a: Vec3, b: Vec3) => a[2] - b[2])

    const g: number[][] = Array.from({ length: n }, () => [])
    let visited: boolean[] = Array(n).fill(false)

    for (const [u, v, _] of distances.slice(0, n_connections)) {
        g[u]?.push(v)
        g[v]?.push(u)
    }

    const dfs = (curr: number): number => {
        if (visited[curr]) {
            return 0
        }

        visited[curr] = true


        let size = 1;
        for (const neighbour of g[curr]!) {
            if (visited[neighbour]) {
                continue
            }

            size += dfs(neighbour)
        }

        return size
    }

    let num_connected = []
    for (let i = 0; i < n; i++) {
        if (visited[i]) {
            continue
        }

        num_connected.push(dfs(i))
    }

    const total = num_connected.sort((a, b) => b - a)
                               .slice(0, 3)
                               .reduce((prod, v) => prod * v)

    return total
}

const data = await getData()

// ans1: 67488
const ans1 = Part1(data)
console.log(ans1)
