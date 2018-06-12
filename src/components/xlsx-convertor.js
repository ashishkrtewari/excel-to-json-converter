const createWriteStream = require("fs").createWriteStream;
const readFile = require('xlsx').readFile; 
const utils = require('xlsx').utils;
const csv_module = require('csv');
const processRows = require('./process-rows');

exports = module.exports = XLSX_json;

function XLSX_json(config, callback) {
  if (!config.input) {
    console.error("You miss a input file");
    process.exit(1);
  }

  var cv = new CV(config, callback);

}

function CV(config, callback) {
  var wb = this.load_xlsx(config.input)
  var ws = this.ws(config, wb);
  var csv = this.csv(ws)
  this.cvjson(csv, config.output, config.lowerCaseHeaders, callback)
}

CV.prototype.load_xlsx = function (input) {
  return readFile(input);
}

CV.prototype.ws = function (config, wb) {
  var target_sheet = config.sheet;

  if (target_sheet == null)
    target_sheet = wb.SheetNames[0];

  var ws = wb.Sheets[target_sheet];
  return ws;
}

CV.prototype.csv = function (ws) {
  var csv_file = utils.make_csv(ws);
  return csv_file;
}

CV.prototype.cvjson = function (csv, output, lowerCaseHeaders, callback) {
  var record = {}
  var tiles = [];
  var breaks = [];
  var rows = [];

  csv_module()
    .from.string(csv)
    .on('record', function (row, index) {
      rows.push(row);
      findInArray();
      function findInArray(array, term, pushArray) {
        for (var i = 0; i < row.length; i++) {
          if (row[i].indexOf("_tile") > -1) {
            tiles.push(index);
          }
          else if (row[i].indexOf("_break") > -1) {
            breaks.push(index);
          }
        }
      }
    })
    .on('end', function (count) {

      record = processRows({tiles,rows,record,breaks,lowerCaseHeaders});
      // when writing to a file, use the 'close' event
      // the 'end' event may fire before the file has been written
      if (output !== null) {
        var stream = createWriteStream(output, { flags: 'w' });
        stream.write(JSON.stringify(record));
        callback(null, record);
      } else {
        callback(null, record);
      }

    })
    .on('error', function (error) {
      console.error(error.message);
    });
}