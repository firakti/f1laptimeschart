
var ddlog = []
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

var data = [];
for (var i = 0; i < 150; i++) {
    data.push({
        x: Math.sin(i / 45),
        y: i
    });
}
function ColorScale(data, colors, key) {

    var getValue = function (d) {
        return (typeof key != 'undefined') ? d[key] : d
    };
    var dataRange = d3.extent(data, getValue);
    var scaleCount = (colors.length - 1);
    var colorScaleRange = (dataRange[1] - dataRange[0]) / scaleCount;
    var scales = [];

    for (var i = 0; i < scaleCount; i++) {
        var a = d3.scale.linear().range([colors[i], colors[i + 1]]).domain([i * colorScaleRange, (i + 1) * colorScaleRange])
        scales.push(a);
    }

    var scale = function (d) {
        var scaleIndex = Math.floor((getValue(d) - dataRange[0]) / colorScaleRange);
        if (scaleIndex >= scales.length) {
            scaleIndex = scales.length - 1;
        }
        var scalefunction = scales[scaleIndex];
        console.log(scaleIndex);
        return colors[scaleIndex];
        return (scalefunction(getValue(d)));
    }

    return scale;
}




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

function initD3Config(config, dataConfig, data) {
    var d3Config = {};

    var sample = data[0][dataConfig.x]
    var extent = d3.extent(data, function (d) { return d[dataConfig.x] });

    if (sample instanceof Date) {
        d3Config.x = d3.time.scale()
            .range([0, config.width])
            .domain(d3.extent(data, function (d) { return d[dataConfig.x] }));
    }
    else if (!(IsNull(dataConfig.timeFormat)) && dataConfig.timeFormat != '') {
        parseTime = d3.time.format(dataConfig.timeFormat).parse;
        d3Config.x = d3.time.scale()
            .range([0, config.width])
            .domain(d3.extent(data, function (d) { return parseTime(d[dataConfig.x]) }));
    }
    else {
        d3Config.x = d3.scale.linear()
            .range([0, config.width])
            .domain(d3.extent(data, function (d) { return d[dataConfig.x] }));
    }

    d3Config.y = d3.scale.linear()
        .range([config.height, 0]);

    if (typeof dataConfig.yMin != 'undefined' && dataConfig.yMax != 'undefined') {
        d3Config.y.domain([dataConfig.yMin, dataConfig.yMax]);
    }
    else {
        d3Config.y.domain(d3.extent(data, function (d) { return d[dataConfig.y]; }));
    }
    d3Config.d = d3.svg.line()
        .x(function (d) {
            return d3Config.x((IsNull(dataConfig.timeFormat) || dataConfig.timeFormat == '') ? d[dataConfig.x] : parseTime(d[dataConfig.x]));
        })
        .y(function (d) { return d3Config.y(d[dataConfig.y]); });

    return d3Config;
}
