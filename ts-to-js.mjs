import dir from "node-dir"
import fs from "fs"
import path from "path"

const run = async () => {
    dir.readFiles(
        import.meta.dirname,
        { excludeDir: ["node_modules"], match: /.tsx?$/ },
        (err, content, filename, next) => {
            if (err) throw err

            const response = fetch("http://127.0.0.1:3000/api/typescript-to-javascript", {
                method: "POST",

                body: content
            }).then(response =>
                response.text().then(value => {
                    fs.writeFile(filename, value, err => {
                        if (err) console.error(err)
                    })
                    const newFilename = path.format({ ...path.parse(filename), base: "", ext: ".js" })
                    fs.rename(filename, newFilename, () => {
                        console.log(`\n${filename} converted into ${newFilename}\n`)
                    })
                })
            )

            next()
        },
        (err, files) => {
            if (err) throw err
        }
    )
}

run().then(r => r)
