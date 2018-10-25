function initConfig(container, parentConfig, moduleConfig) {
    var config = MergeTo(parentConfig, moduleConfig);
    config.width = getAbsoluteValue(container, config.width)

    if (!IsNull(config.margin)) {
        var translateX = 0;
        var translateY = 0;
        var totalX = 0;
        var totalY = 0;

        if (!IsNull(config.margin.top)) {
            translateY = config.margin.top;
            totalY += config.margin.top;
        }
        if (!IsNull(config.margin.bottom)) {
            totalY += config.margin.bottom;
        }
        if (!IsNull(config.margin.left)) {
            translateX = config.margin.left;
            totalX += config.margin.left;
        }
        if (!IsNull(config.margin.right)) {
            totalX += config.margin.right;
        }

        if (typeof moduleConfig.width == 'undefined') {
            if (!isNaN(parseFloat(parentConfig.width))) {
                config.width = config.width - totalX;
            }
        }
    }
    config.transform = "translate(" + translateX + "," + translateY + ")";

    return config;
}


function colorScale3(data, colors, colorWeights, valueF) {

    let valueFunction = valueF || (d => d);
    var weights = colorWeights || {}

    var dataRange = d3.extent(data, valueFunction);
    var totalWeight = 0;
    var scaleCount = colors.length - 1;

    var scales = {}

    for (let i = 0; i < scaleCount; i++) {
        weights[i] = weights[i] || 1;
        totalWeight += weights[i];
    }


    var colorScaleRange = (dataRange[1] - dataRange[0]) / totalWeight;

    var scaleRanges = {}

    for (let i = 0; i < scaleCount; i++) {
        let start;
        let end;
        if (i === 0) {
            start = dataRange[0];
        }
        else {
            start = scaleRanges[i - 1].end;
        }
        end = start + weights[i] * colorScaleRange
        scaleRanges[i] = {
            start: start,
            end: end,
        }
    }

    for (let i = 0; i < scaleCount; i++) {
        var scale = d3.scale
            .linear()
            .range([colors[i], colors[i + 1]])
            .domain([scaleRanges[i].start, scaleRanges[i].end]);
        scales[i] = scale;
    }

    var scale = function (d) {

        if (d < scaleRanges[0].start)
            d = scaleRanges[0].start;

        if (d > scaleRanges[scaleCount - 1].end)
            d = scaleRanges[scaleCount - 1].end;

        for (let i = 0; i < scaleCount; i++) {
            if (d >= scaleRanges[i].start && d <= scaleRanges[i].end) {
                scaleIndex = i;
                break;
            }
        }

        return scales[scaleIndex](valueFunction(d));
    };

    return {
        scale: scale
    };
}

function colorScale2(data, colors, valueFunction) {
    if (!valueFunction)
        valueFunction = function (d) {
            return d;
        };

    var dataRange = d3.extent(data, valueFunction);
    var scaleCount = colors.length - 1;
    var colorScaleRange = (dataRange[1] - dataRange[0]) / scaleCount;
    var scales = [];

    for (var i = 0; i < scaleCount; i++) {
        var a = d3.scale
            .linear()
            .range([colors[i], colors[i + 1]])
            .domain([dataRange[0] + i * colorScaleRange, dataRange[0] + (i + 1) * colorScaleRange]);
        scales.push(a);
    }

    var scale = function (d) {
        if (d > dataRange[1]) d = dataRange[1];
        var scaleIndex = Math.floor((valueFunction(d) - dataRange[0]) / colorScaleRange);
        if (scaleIndex >= scales.length) {
            scaleIndex = scales.length - 1;
        }
        var scalefunction = scales[scaleIndex];
        let a = valueFunction(d);
        let b = scalefunction(valueFunction(d));
        return scalefunction(valueFunction(d));
    };

    return {
        scale: scale
    };
}

// this method will changed 
function initDataConfig(dataConfig, data) {
    var ChartData;
    if (typeof dataConfig.groupkey != 'undefined') {
        ChartData = d3.nest().key(function (d) { return d[dataConfig.groupkey]; }).entries(data);
    }
    else {
        ChartData = { key: dataConfig.Name, values: data };
    }
    return ChartData;
}

// function initScales(data, x, y, width, height, timeFormat) {

//     if (x(data[0]) instanceof Date) {
//         scaleX = d3.time.scale()
//             .range([0, width])
//             .domain(d3.extent(data, x));
//     }
//     else if (!IsNull(timeFormat)) {
//         let parseTime = d3.time.format(timeFormat).parse;
//         scaleX = d3.time.scale()
//             .range([0, width])
//             .domain(d3.extent(data, function (d) { return parseTime(x(d)) }));
//     }
//     else {
//         scaleX = d3.scale.linear()
//             .range([0, width])
//             .domain(d3.extent(data, function (d) { return x(d) }));
//     }

//     scaleY = d3.scale.linear()
//         .range([height, 0]);

//     if (typeof dataConfig.yMin != 'undefined' && dataConfig.yMax != 'undefined') {
//         scaleY.domain([dataConfig.yMin, dataConfig.yMax]);
//     }
//     else {
//         scaleY.domain(d3.extent(data, function (d) { return y(d); }));
//     }
//     d3Config.d = d3.svg.line()
//         .x(function (d) {
//             return scaleX((IsNull(dataConfig.timeFormat) || dataConfig.timeFormat == '') ? x(d) : parseTime(x(d)));
//         })
//         .y(function (d) { return scaleY(y(d)); });

//     return { scaleX: screenX, scaleY: scaleY };
// }
