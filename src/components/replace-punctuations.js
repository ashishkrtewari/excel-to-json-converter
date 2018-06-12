const replacePunctuations = (old) => {
    var fresh = old;
    var puncSet = [["’", "&rsquo;"], ["'", "&apos;"], ["®", "<sup>®</sup>"], ["™", "<sup>™</sup>"], ["“", "&ldquo;"], ["”", "&rdquo;"], ["„", "&bdquo;"]];
    for (var item in puncSet) {
        var term = '/' + puncSet[item][0] + '/g';
        fresh = fresh.replace(eval(term), puncSet[item][1]);
    }
    return JSON.parse(fresh);
}

module.exports = {
    replacePunctuations
}