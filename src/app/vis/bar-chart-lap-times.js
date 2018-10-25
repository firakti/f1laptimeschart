
d3Modules.lapTimeBarChart =
    {
        name: 'lapTimeBarChart',
        config: "",
        properties: [],
        defaultsProperties: [{ 'width': '100%' }],
        create: function (divId, container, chartConfiguration, data, eventBus) {
            return createLapTimeBarChart(divId, container, chartConfiguration, data, eventBus);
        }
    };

function createLapTimeBarChart(containerDiv, containerSvg, chartConfiguration, data, eventBus) {


    var config = initConfig(containerDiv, chartConfiguration.config, chartConfiguration.modules.lapTimeBarChart.config);
    var laps = chartConfiguration.modules.lapTimeBarChart.selectedLaps;


    var colors = chartConfiguration.pilotMedia;


    var colorMap = function (pilotName) {
        var value;
        colors.forEach(function (element) {
            if (element.name == pilotName)
                value = element.color;
        });
        return value;
    }

    var container = new Conatiner();

    var fastColor = '#66F567';
    var slowColor = '#FFE953'

    var upDifLimit = 2000;
    var labelWidth = 50;
    var totalInfoWidth = 50;
    var labelWidth = 50;

    var max = d3.extent(laps, function (d) { return d['total'] });

    var scaleX = d3.scale.linear()
        .range([0, config.width - (labelWidth + totalInfoWidth)])
        .domain([0, max[1]]);

    let scaleY = d3.scale.linear()
        .range([0, config.height ])
        .domain([0, upDifLimit]);
        
    var moduleContainer = containerSvg.append("g")
        .attr("height", (config.height) * laps.length)
        .attr("width", config.width);

    var index = 0;
    let chartData = [];
    let allLaps = [];
    config.height = config.height-2;
    laps.forEach(function (element) {
        var data = { key: element.name, values: element.laps }
        chartData.push(data);
        allLaps = allLaps.concat(element.laps);
        var name = element.name;

        var lapsContainer = moduleContainer.append("g")
            .attr("transform", "translate(" + (labelWidth) + "," + ((config.height+2) * index) + ")")
            .attr("width", config.width - (labelWidth + totalInfoWidth))
            ;

        var chartLabels = moduleContainer.append('g')
            .attr("transform", "translate(" + (0) + "," + ((config.height + 2) * index ) + ")")
            .attr("width", config.width)
            ;


        chartLabels.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .style("fill", function (d) { return colorMap(name) })
            .attr("width", labelWidth)
            .attr("height", config.height)
            .attr("opacity", 0.9)


        chartLabels.append("text")
            .attr("x", 5)
            .attr("y", config.height / 2)
            .attr("class", "pilot-names")
            .attr("text-anchor", "start")
            .attr("fill", "#fff")
            .text(function (d, i) { return name.substring(0, 3) })
            ;
        chartLabels.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("transform", "translate(" + (config.width - totalInfoWidth) + "," + 0 + ")")
            .attr("width", totalInfoWidth)
            .attr("height", config.height)
            .attr("opacity", 0.9)

        chartLabels.append("text")
            .attr("x", totalInfoWidth / 2)
            .attr("y", config.height / 2)
            .attr("class", "brush-value")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (config.width - totalInfoWidth) + "," + 0 + ")")
            .style("fill", function (d) { return (element.totaldif <= 0) ? fastColor : slowColor })
            .text(function (d, i) { return element.totaldif })



        var bars = lapsContainer.append("g")


        bars.selectAll("rect").data(element.laps).enter().append("rect")
            .attr("x", function (d, i) {
                return (scaleX(d.start));
            })
            .attr("y", function (d, i) {
                if (d.dif >= 0)
                    return 0
                else {
                    let dif = Math.abs(d.dif)

                    if (dif > upDifLimit) {
                        dif = upDifLimit;
                    }
                    let start = scaleY(dif);
                    return config.height- start;
                }

            })

            .attr("width", function (d, i) { return scaleX(d.time)})
            .attr("height", function (d, i) {
                let dif = Math.abs(d.dif)

                if (dif > upDifLimit) {
                    dif = upDifLimit;
                }
                return scaleY(dif);
            })

            .style("fill", function (d) { return (d.dif <= 0) ? fastColor : slowColor });

        var minTextWidth = 60;

        var info = bars.selectAll(".bar-info").data(element.laps).enter().append("g").attr("class",".bar-info");
        info.append("text").attr("text-anchor", "middle")
            .attr("transform", function (d, i) {
                let x = scaleX(d.start) + scaleX(d.time) / 2;
                let y = 10;
                return "translate(" + x + "," + y + ")";
            })
            .attr("width", function (d, i) { return scaleX(d.time) * 0.97 })
            .attr("height", config.height)
            .attr("font-size", "10px")
            .text(function (d, i) {
                return Math.floor(d.lap);
 
            })
            ;
        info.append("text").attr("text-anchor", "middle")
            .attr("transform",function(d,i) {
               let  x = scaleX(d.start) + scaleX(d.time)/2;
               let y = config.height/2;
                return "translate(" + x + "," + y + ") rotate(-90)";
            })
            .attr("width", function (d, i) { return scaleX(d.time) * 0.97 })
            .attr("height", config.height)
            .attr("font-size", "10px")
            .text(function (d, i) {
                return Math.floor(d.dif);
            })
            ;
        index += 1;
    });
}

