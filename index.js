var html_to_pdf = require("html-pdf-node");
var express = require("express");
var app = express();
var schedule = require("node-schedule");
var path = require("path");
var fs = require("fs");
// var { PDFDocument } = require("pdf-lib");
// var util = require('util');
// var JsBarcode = require('jsbarcode');
// var { Canvas } = require('canvas');

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

// console.log("Start Modul");

var job = schedule.scheduleJob("*/15 * * * * *", function (fireDate) {
  console.log(
    "This job was supposed to run at " +
      fireDate +
      ", but actually ran at " +
      new Date()
  );

  // console.log('The answer to life, the universe, and everything!');

  fs.readdir(htmlDirectoryPath, function (err, files) {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }
    files.forEach(function (file) {
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
    });
  });
});

// async function createPdf(htmlfile, pdffile) {
//   try {
//     // let options = { format: 'A4' };
//     // // let file = [{ name: './example.pdf'}];
//     // let htmldata = fs.readFileSync(htmlfile,{ encoding: "latin1", flag: "r" });
//     // // fs.readFile(htmlfile, function (err, html) {
//     // //     if (err) {
//     // //         throw err;
//     // //     }
//     // //     console.log(html);
//     // //     file[0].content = html;
//     // // });
//     // html_to_pdf.generatePdfs(htmldata, options).then(output => {
//     //     // console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
//     //     // console.log("PDF Buffer:-", output[0].buffer); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
//     //     fs.writeFile(file[0].name, output[0].buffer, () => {
//     //         console.log('PDF ' + pdffile + ' created!');
//     //     });
//     //        // fs.writeFile(output, pdfBytes, () => {
//     // //     console.log('PDF ' + output + ' created!');
//     // // });
//     // });
//     // var jsondata = fs.readFileSync(jsonfilepath,{ encoding: "latin1", flag: "r" });
//     // var data = JSON.parse(jsondata);
//     // // console.log("data:",data);
//     // //console.log("data.LSNR:",data.LSNR);
//     // var bc = generateBarcode(data.LSNR);
//     // // console.log(bc);
//     // var readFile = util.promisify(fs.readFile);
//     // function getStuff() {
//     //     return readFile(formular);
//     // }
//     // var file = await getStuff();
//     // var pdfDoc = await PDFDocument.load(file);
//     // var form = pdfDoc.getForm();
//     // const barcodeImage = await pdfDoc.embedPng(bc);
//     // // const fields = form.getFields()
//     // // fields.forEach(field => {
//     // //   const type = field.constructor.name
//     // //   const name = field.getName()
//     // //   console.log(`${type}: ${name}`)
//     // // })
//     // const characterImageField = form.getButton('bc');
//     // characterImageField.setImage(barcodeImage);
//     // let i = 1;
//     // Object.entries(data.posList).forEach((entry) => {
//     //     const [key, value] = entry;
//     //     if (typeof value == 'object') {
//     //         Object.entries(value).forEach((entry) => {
//     //             const [key, value] = entry;
//     //             if (typeof value == 'object') {} else {
//     //                 // console.log(`${key}: ${value}`);
//     //                 tempField = form.getTextField(`${key}` + "_" + ('0' + i).slice(-2));
//     //                 tempField.setText(`${value}`);
//     //             }
//     //         });
//     //         i++;
//     //     }
//     // });
//     // Object.entries(data).forEach((entry) => {
//     //     const [key, value] = entry;
//     //     if (typeof value == 'object') {} else {
//     //         if(key != "LSNR"){
//     //             tempField = form.getTextField(`${key}`);
//     //             tempField.setText(`${value}`);
//     //         }
//     //     }
//     // });
//     // var pdfBytes = await pdfDoc.save({
//     //     updateFieldAppearances: true
//     // });
//     // // console.log("output:", output);
//     // fs.writeFile(output, pdfBytes, () => {
//     //     console.log('PDF ' + output + ' created!');
//     // });
//     // var fileName = path.basename(jsonfilepath);
//     // fs.rename(jsonfilepath, path.join(__dirname, 'Docs', 'app', 'oldJSON', fileName), function(err) {
//     //     if (err) throw err;
//     //     // console.log('Successfully renamed - AKA moved!');
//     // });
//   } catch (err) {
//     console.log(err);
//   }
// }

app.get("/", function (req, res) {
  res.send("Bautagebuch PDF-Creator is UP!");
});

app.listen(3000);
