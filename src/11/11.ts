import fs from "node:fs/promises"
import Queue from "yocto-queue"

const getData = async () => {
    const data = fs.readFile("input.txt", {
        encoding: "utf8"
    })

    return data
}

const Part1 = (data: string) => {
    const parsed = data.split('\n').map((l): [string, string[]] => {
        const links = l.split(':')
        const vertex = links[0]!
        const neighbours = links[1]?.trim().split(/\s+/) ?? []

        return [vertex, neighbours]
    })

    const vertices: string[] = parsed.map(e => e[0])
    const neighbours: string[][] = parsed.map(([, n]) => n)
    const n = vertices.length

    const vertexToIndex = new Map<string, number>();
    vertices.forEach((v, i) => vertexToIndex.set(v, i))

    // Add `out`
    vertexToIndex.set('out', n)

    const getVertexIndex = (v: string) => vertexToIndex.get(v)!

    // Create the complete graph.
    const g: number[][] = Array.from({ length: n }, () => [])

    neighbours.forEach((ns, i) => {
        ns.forEach((n, _) => g[i]?.push(getVertexIndex(n)))
    })

    // BFS to create sub-graph, based on `visited`.
    const src = getVertexIndex('you'), dest = getVertexIndex('out')

    const q = new Queue<number>();
    const visited = new Array(n + 1).fill(false)

    q.enqueue(src)
    visited[src] = true


    while (q.size > 0) {
        const curr = q.dequeue()!

        if (curr === dest) {
            continue
        }

        for (const neighbour of g[curr]!) {
            if (visited[neighbour]) {
                continue
            }

            visited[neighbour] = true
            q.enqueue(neighbour)
        }
    }

    const isUnreachable = (v: number) => !visited[v]


    // Create a Topological Sort Ordering
    q.clear()

    const in_degree = Array(n + 1).fill(0)

    for (let i = 0; i < n; i++) {
        if (isUnreachable(i)) continue

        for (const neighbour of g[i]!) {
            in_degree[neighbour] += 1
        }
    }

    for (let i = 0; i < n; i++) {
        if (isUnreachable(i)) continue

        if (in_degree[i] === 0) {
            q.enqueue(i)
        }
    }

    // Contains the topological sort ordering.
    const ordering = []
    while (q.size > 0) {
        const curr = q.dequeue()!

        if (curr === n) {
            break
        }

        ordering.push(curr)

        for (const neighbour of g[curr]!) {
            in_degree[neighbour] -= 1

            if (in_degree[neighbour] == 0) {
                q.enqueue(neighbour)
            }
        }
    }

    // Compute the number of paths, starting from the `src`.
    const NumPathsVertex = new Map<number, number>()
    NumPathsVertex.set(src, 1)

    for (const v of ordering) {
        for (const neighbour of g[v]!) {
            const summ = (NumPathsVertex.get(neighbour) ?? 0) + NumPathsVertex.get(v)!
            NumPathsVertex.set(neighbour, summ)
        }
    }

    return NumPathsVertex.get(dest) ?? -1
}

const createVertexToIndex = (vertices: string[]) => {
    const vertexToIndex = new Map<string, number>();
    vertices.forEach((v, i) => vertexToIndex.set(v, i))

    return vertexToIndex
}

const getSubgraph = (g: number[][], src: number, dest: number) => {
    const q = new Queue<number>();
    const n = g.length

    const visited = new Array(n + 1).fill(false)

    q.enqueue(src)
    visited[src] = true


    while (q.size > 0) {
        const curr = q.dequeue()!

        if (curr === dest) {
            continue
        }

        for (const neighbour of g[curr]!) {
            if (visited[neighbour]) {
                continue
            }

            visited[neighbour] = true
            q.enqueue(neighbour)
        }
    }

    const isUnreachable = (v: number) => !visited[v]

    return g.map((ns, i) => {
        if (isUnreachable(i)) return []

        return ns
    })
}

const getTopologicalSort = (g: number[][]) => {
    const n = g.length

    const q = new Queue<number>()
    const in_degree = Array(n + 1).fill(0)

    for (let i = 0; i < n; i++) {
        for (const neighbour of g[i]!) {
            in_degree[neighbour] += 1
        }
    }

    for (let i = 0; i < n; i++) {
        const out_degree = g[i]!.length
        if (in_degree[i] === 0 && out_degree !== 0) {
            q.enqueue(i)
        }
    }

    const ordering = []
    while (q.size > 0) {
        const curr = q.dequeue()!

        if (curr === n) {
            break
        }

        ordering.push(curr)

        for (const neighbour of g[curr]!) {
            in_degree[neighbour] -= 1

            if (in_degree[neighbour] == 0) {
                q.enqueue(neighbour)
            }
        }
    }

    return ordering
}

const getNumPathsVertices = (g: number[][], ordering: number[], src: number) => {
    const idx = ordering.indexOf(src)
    const order = ordering.slice(idx)

    // Compute the number of paths, starting from the `src`.
    const NumPathsVertex = new Map<number, number>()
    NumPathsVertex.set(src, 1)

    for (const v of order) {
        for (const neighbour of g[v]!) {
            const summ = (NumPathsVertex.get(neighbour) ?? 0) + NumPathsVertex.get(v)!
            NumPathsVertex.set(neighbour, summ)
        }
    }

    return NumPathsVertex
}

const Part2 = (data: string) => {
    const parsed = data.split('\n').map((l): [string, string[]] => {
        const links = l.split(':')
        const vertex = links[0]!
        const neighbours = links[1]?.trim().split(/\s+/) ?? []

        return [vertex, neighbours]
    })

    const vertices: string[] = parsed.map(e => e[0])
    const neighbours: string[][] = parsed.map(([, n]) => n)
    const n = vertices.length

    const vertexToIndex = createVertexToIndex(vertices)
    vertexToIndex.set('out', n)

    const getVertexIndex = (v: string) => vertexToIndex.get(v)!

    // Create the complete graph.
    const g: number[][] = Array.from({ length: n }, () => [])

    neighbours.forEach((ns, i) => {
        ns.forEach((n, _) => g[i]?.push(getVertexIndex(n)))
    })

    const src = getVertexIndex('svr'), dest = getVertexIndex('out')
    const fft = getVertexIndex('fft'), dac = getVertexIndex('dac')

    const gSvrToOut = getSubgraph(g, src, dest)
    const gFFTToOut = getSubgraph(g, fft, dest)
    const gDACToOut = getSubgraph(g, dac, dest)

    const ordering = getTopologicalSort(gSvrToOut)

    const npathSvrToOut = getNumPathsVertices(gSvrToOut, ordering, src)
    const npathFFTToOut = getNumPathsVertices(gFFTToOut, ordering, fft)
    const npathDACToOut = getNumPathsVertices(gDACToOut, ordering, dac)

    // Multiply the number of paths to get to each, but notice that they
    // are generated from different graphs.
    const nSvrToFFT = npathSvrToOut.get(fft)!
    const nFFTToDAC = npathFFTToOut.get(dac)!
    const nDACToOut = npathDACToOut.get(dest)!

    return nSvrToFFT * nFFTToDAC * nDACToOut;
}


const data = await getData()

// ans1: 539
const ans1 = Part1(data)
console.log(ans1)

// ans2: 413167078187872
const ans2 = Part2(data)
console.log(ans2)