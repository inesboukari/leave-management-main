const express = require('express');
const router = express.Router();
const pdfMake = require('pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = vfsFonts.pdfMake.vfs;

router.post('/pdf', (req, res, next) => {
    const fname = req.body.fname;
    const lname = req.body.lname;

    var documentDefinition = {
        content: [
            `First paragraph for ${fname} ${lname}`,
            'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
        ]
    };

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data) => {
        res.writeHead(200, {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment;filename="filename.pdf"',
        });
        const download = Buffer.from(data, 'base64');
        res.end(download);
    });
});

module.exports = router;
