import express from 'express';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import open from 'open';
import config from '../webpack.config.dev';
import webpack from 'webpack';
import convertor from './convertor';
import { unlink } from "fs";

const port = process.env.PORT || 3000;
const app = express();
const compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));
var storage = multer.diskStorage({ //multers disk storage settings
    destination: (req, file, cb) => {
        cb(null, (path.join(__dirname, '../uploads')))
    },
    filename: (req, file, cb) => {
        var datetimestamp = Date.now();
        cb(null, `${file.fieldname}-${datetimestamp}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`);
    }
});
var upload = multer({ //multer settings
    storage: storage,
    fileFilter: (req, file, callback) => { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');
/** API path that will upload the files */
app.post('/upload', (req, res) => {
    var exceltojson;
    upload(req, res, (err) => {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
        }
        /** Check the extension of the incoming file and 
         *  use the appropriate module
         */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = convertor;
        }
        try {
            convertor({
                input: req.file.path,
                output: null, //since we don't need output.json
                lowerCaseHeaders: true
            }, (err, result) => {
                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: null });
                }
                res.json({data: result });
                unlink(req.file.path, (err) => {
                    if (err) throw err;
                  });
            });
        } catch (e) {
            res.json({ error_code: 1, err_desc: "Corupted excel file" });
        }
    })
});
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/index.html'));
});

app.listen(port, () => {
    console.log(`running on ${port} ...`);
});