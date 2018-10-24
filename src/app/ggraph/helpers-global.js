function  IsNull(ob) {
    if ("undefined" == typeof ob) {
        return true;
    }
    return false;
}


var toFormatedTime = function (miliseconds) {
    var minute = Math.floor(miliseconds / (1000 * 60));
    var second = Math.floor((miliseconds - minute * (1000 * 60)) / 1000);
    var milisecond = Math.floor(miliseconds) % 1000;
    return minute + ":" + second + "." + milisecond;
}

function getWidth(container, w) {
    var item = d3.select(container);
    var width;
    if (typeof w != 'undefined') {
        if (w % 1 === 0) {
            width = w;
        }
        else if (!isNaN(parseFloat(w))) {
            width = parseInt(d3.select(container).style("width")) * parseFloat(w) / 100;
        }
        else if (!isNaN(parseInt(w))) {
            width = parseInt(w);
        }
        else {
            width = parseInt(d3.select(container).style("width"));
        }
    }
    return width;
}