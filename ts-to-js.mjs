import dir from "node-dir"
import fs from "fs"
import { exec } from "child_process"

const __dirname = import.meta.dirname;

async function run() {

  dir.readFiles(__dirname, {
    excludeDir: ['node_modules'],
    match: /.tsx?$/,
    }, function(err, content, filename, next) {
        if (err) throw err;

        const response = fetch('http://127.0.0.1:3000/api/typescript-to-javascript', {
          method: "POST",
          body: content,
        }).then((response) => {
          response.text().then((value) => {

            fs.writeFile(filename, value, err => {
              if (err) {
                console.error(err);
              }
            });

          })
        })

        next();
    },

    function(err, files){
        if (err) throw err;
        console.log('finished reading files:');
    });

  exec("find ./ -depth -name \"*.ts\" -o -name \"*.tsx\" -exec sh -c 'mv \"$1\" \"${1%.ts}.js\"' _ {} \\;", (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });


}
run();
