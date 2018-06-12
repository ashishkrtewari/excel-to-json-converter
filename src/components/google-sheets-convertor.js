import axios from 'axios';
import processRows from './process-rows';

export const googleSheetsConvertor = (url, callback) => {
    var rows;
    if (url.indexOf('sheets.googleapis.com') > -1) {
        axios.get(url)
            .then(function (response) {
                if (response.data.values) {                    
                    rows = response.data.values;
                    var record = {},
                        tiles = [],
                        breaks = [],
                        lowerCaseHeaders = true;


                    rows.forEach(function (row, index) {
                        row.forEach(function (rowItem) {
                            if (rowItem.indexOf("_tile") > -1) {
                                tiles.push(index);
                            }
                            else if (rowItem.indexOf("_break") > -1) {
                                breaks.push(index);
                            }
                        })
                    })

                    record = processRows({tiles,rows,record,breaks,lowerCaseHeaders});
                    callback(JSON.stringify(record));
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

};