var html_to_pdf = require("html-pdf-node");
var express = require("express");
var app = express();
var schedule = require("node-schedule");
var path = require("path");
var fs = require("fs");

//joining path of directory
var htmlDirectoryPath = path.join(__dirname, "html");
var pdfDirectoryPath = path.join(__dirname, "pdf");
//passsing directoryPath and callback function

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

var job = schedule.scheduleJob("*/15 * * * * *", function (fireDate) {
  console.log(
    "This job was supposed to run at " +
      fireDate +
      ", but actually ran at " +
      new Date()
  );

  fs.readdir(htmlDirectoryPath, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    files.forEach(function (file) {
      if (file != ".gitkeep") {
        let htmlfileObj = [{ name: file }];
        // let htmlfileObj = {name: file};
        console.log(file);
        var htmlfile = path.join(htmlDirectoryPath, file);
        var filename = file.split(".")[0];
        htmlfileObj[0].pdffile = path.join(pdfDirectoryPath, filename + ".pdf");
        // createPdf(htmlfile,pdffile);

        let options = { format: "A4" };
        // let file = [{ name: './example.pdf'}];

        htmlfileObj[0].content = fs.readFileSync(htmlfile, {
          encoding: "latin1",
          flag: "r",
        });

        html_to_pdf.generatePdfs(htmlfileObj, options).then((output) => {
          // console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
          // console.log("PDF Buffer:-", output[0].buffer); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]

          fs.writeFile(htmlfileObj[0].pdffile, output[0].buffer, () => {
            console.log("PDF " + htmlfileObj[0].pdffile + " created!");

            fs.rename(
              htmlfile,
              path.join(__dirname, "oldHTML", file),
              function (err) {
                if (err) throw err;
                // console.log('Successfully renamed - AKA moved!');
              }
            );
          });
          // fs.writeFile(output, pdfBytes, () => {
          //     console.log('PDF ' + output + ' created!');
          // });
        });
      }
    });
  });
});

app.get("/", function (req, res) {
  res.send("Bautagebuch PDF-Creator is UP!");
});

app.listen(3000);
