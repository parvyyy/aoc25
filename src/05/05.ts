import fs from 'node:fs/promises';


const getData = async () => {
    const data = fs.readFile('input.txt', {
        encoding: "utf8"
    })

    return data
}

// Reaches maximum size of a set, memory-limit exceeded.
const Part1Naive = (data: string) => {
    const [ranges, ingredients] = data.split('\n\n')

    if (!ranges || !ingredients) {
        return 0
    }

    const fresh = new Set<number>()
    for (const range of ranges.split('\n')) {
        const [start, end] = range.split('-').map(Number)

        if (!start || !end) {
            return 0
        }

        for (let i = start; i <= end; i++) {
            fresh.add(i)
        }
    }

    let total = 0
    for (const ingredient of ingredients.split('\n')) {
        if (fresh.has(Number(ingredient))) {
            total += 1
        }
    }

    return total
}

class RangeNode {
    start: number;
    end: number;

    left: RangeNode | null;
    right: RangeNode | null;


    constructor(start: number, end: number, left: RangeNode | null = null, right: RangeNode | null = null) {
        this.start = start
        this.end = end

        this.left = left
        this.right = right
    }
}

// Idea: Create a binary range-tree with the ranges.
const Part1 = (data: string) => {
    const [range_data, ingredients] = data.split('\n\n')

    if (!range_data || !ingredients) {
        return 0
    }

    const ranges = range_data.split('\n')

    let root = null

    // Helper function to display the tree
    const display = (root: RangeNode | null, level: number = 0) => {
        if (root === null) {
            return
        }

        // In order traversal.
        display(root.right, level + 1)
        console.log(`${'\t'.repeat(level)}${root.start} - ${root.end}`)
        display(root.left, level + 1)

    }

    // Inserts a given start-end range into the BST.
    const insert = (root: RangeNode | null, start: number, end: number) => {
        if (root === null) {
            return new RangeNode(start, end)
        }

        // If the 'root' node is a subset of the current, we can replace it.
        // Otherwise, we add as a left/right child.
        if (start < root.start && end > root.end) {
            root.start = start
            root.end = end
        } else if (start < root.start) {
            root.left = insert(root.left, start, end)
        } else if (end > root.end) {
            root.right = insert(root.right, start, end)
        }

        return root
    }

    // Populates BST
    for (const range of ranges) {
        const [start, end] = range.split('-').map(Number)

        if (!start || !end) {
            return 0
        }        
        
        root = insert(root, start, end)
    }

    let total = 0

    // Traverse through the BST, and see if the value falls in a range.
    const isIncluded = (root: RangeNode | null, v: number) => {
        if (root === null) {
            return false
        }

        if (root.start <= v && root.end >= v) {
            return true
        } else if (root.start > v) {
            return isIncluded(root.left, v)
        } else if (root.end < v) {
            return isIncluded(root.right, v)
        }
    }

    for (const ingredient of ingredients.split('\n').map(Number)) {
        if (isIncluded(root, ingredient)) {
            total += 1
        }
    }

    return total
}

const data = await getData()

// ans1: 868
const ans1 = Part1(data)
console.log(ans1)

// // ans2: 171039099596062
// const ans2 = Part2(data)
// console.log(ans2)