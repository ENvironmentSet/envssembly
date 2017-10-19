/**
 * Created by environmentset on 17. 10. 19.
 */
var VM = require("./lib/Runner.js");
var fs = require("fs");

let files = JSON.parse(fs.readFileSync("config.conf",'utf8'));

for (let file in files.execute) {
    VM(files.execute[file]);
}
