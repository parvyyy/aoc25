import fs from 'node:fs/promises';

const getData = async () => {
    const data = fs.readFile('input.txt', {
        encoding: "utf8"
    })

    return data
}

const data = await getData()
console.log(data)