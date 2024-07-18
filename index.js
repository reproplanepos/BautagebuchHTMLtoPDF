var html_to_pdf = require('html-pdf-node');
var fs = require('fs');

let options = { format: 'A4' };
let file = [{ name: './example.pdf'}];

fs.readFile('./html/template_preview.html', function (err, html) {
    if (err) {
        throw err; 
    }       
    console.log(html);
    file[0].content = html;
});

html_to_pdf.generatePdfs(file, options).then(output => {
    // console.log("PDF Buffer:-", output); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]
    console.log("PDF Buffer:-", output[0].buffer); // PDF Buffer:- [{url: "https://example.com", name: "example.pdf", buffer: <PDF buffer>}]

    fs.writeFile(file[0].name, output[0].buffer, () => {
        console.log('PDF ' + file.name + ' created!');
    });
});