const { replacePunctuations } = require('./replace-punctuations');
const processRows = ({tiles,breaks,rows,lowerCaseHeaders = true, record}) => {

    for (var tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
        var currentTile = tiles[tileIndex],
            nextTile = tiles[tileIndex + 1] || rows.length,
            currentTileValue = rows[currentTile][1].toLowerCase();
        record[currentTileValue] = {};
        var breakObj = (function () {
            var obj = {};
            for (var i = 0; i < breaks.length; i++) {
                if (breaks[i] > tiles[tileIndex]) {
                    obj.min = i;
                    break;
                }
            }
            for (var j = breaks.length; j > 0; j--) {
                if (breaks[j] < tiles[tileIndex + 1]) {
                    obj.max = j;
                    break;
                }
            }
            obj.max = obj.max || breaks.length - 1;
            return obj;
        })();
        for (var breakIndex = breakObj.min; breakIndex <= breakObj.max; breakIndex++) {
            var currentBreak = breaks[breakIndex],
                nextBreak = breaks[breakIndex + 1] < nextTile ? breaks[breakIndex + 1] : nextTile,
                breakValue = rows[currentBreak][1].toLowerCase(),
                keys = [];

            if (breakValue !== 'transdata') {
                (function () {
                    var header = rows[currentBreak + 1];
                    var row = rows[currentBreak + 2];
                    record[currentTileValue][breakValue] = {};
                    header.forEach(function (column, index) {
                        var foundCounter = 0;
                        var key = lowerCaseHeaders ? column.trim().toLowerCase() : column.trim();
                        if (key) {
                            for (var j = 0; j < keys.length; j++) {
                                if (keys[j].indexOf(key) > -1) {
                                    foundCounter++;
                                }
                            }
                            key += foundCounter + 1;
                            keys.push(key);
                        }
                        key && (record[currentTileValue][breakValue][key] = row[index].trim());
                    })
                })();
            }
            else {
                (function () {
                    record[currentTileValue][breakValue] = {};
                    for (var i = currentBreak + 2; i < nextBreak; i++) {
                        var header = rows[currentBreak + 1].slice(1);
                        var row = rows[i].slice(1);
                        var copyId = row[0].toLowerCase();
                        var foundCounter = 0;

                        for (var j = 0; j < keys.length; j++) {
                            if (keys[j].indexOf(copyId) > -1) {
                                foundCounter++;
                            }
                        }
                        copyId += foundCounter + 1;
                        keys.push(copyId);
                        record[currentTileValue][breakValue][copyId] = {};
                        header.forEach(function (column, index) {
                            if (index) {
                                var key = lowerCaseHeaders ? column.trim().toLowerCase() : column.trim();
                                key && (record[currentTileValue][breakValue][copyId][key] = row[index].trim());
                            }
                        })
                    }
                })();
            }
        }
    }

    record = replacePunctuations(JSON.stringify(record));

    return record;

};

module.exports = processRows;