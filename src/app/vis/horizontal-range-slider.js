
d3Modules.horizontalChartSlider =
    {
        name: 'verticalChartSlider',
        config: "",
        properties: [],
        defaultsProperties: [],
        create: function (divId, container, chartConfiguration, data, eventBus) {
            return createHorizontalChartSlider(divId, container, chartConfiguration, data, eventBus);
        }
    };

function createHorizontalChartSlider(containerDiv, containerSvg, chartConfiguration, data, eventBus) {

    var itemId;
    var properties = chartConfiguration.modules.horizontalChartSlider.data;
    var pilots = chartConfiguration.pilots;
    var pilotColors = chartConfiguration.pilotMedia;
    var images = chartConfiguration.pilotImages;

    var textColor = "#fff";
    var brushColor = "#5A5A5A";


    var getPilotColors = function (pilotName) {
        var value;
        pilotColors.forEach(function (element) {
            if (element.name == pilotName)
                value = element.color;
        });
        return value;
    }

    var min = chartConfiguration.modules.horizontalChartSlider.dataConfig.min;

    var max = chartConfiguration.modules.horizontalChartSlider.dataConfig.max;

    var best = chartConfiguration.modules.horizontalChartSlider.dataConfig.best;

    var worst = chartConfiguration.modules.horizontalChartSlider.dataConfig.worst;


    var colorMap = ['#a50026', '#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850', '#006837'];
    colorMap = colorMap.reverse();

    var colorScale = colorScale3([best, worst], colorMap, [1, 2, 3, 5, 3, 3, 1, 1, 1]);
    function getColor(time) {
        return colorScale.scale(time);
    }

    var moduleConfiguration = chartConfiguration.modules.horizontalChartSlider.config;

    var config = initConfig(containerDiv, chartConfiguration.config, moduleConfiguration);
    var dataConfig = initConfig(containerDiv, chartConfiguration.dataConfig, moduleConfiguration);
    config.width = config.width - 60;
    config.height = config.height - 30
    var container = new VisualizationModule();
    var index = 0;
    var labelWidth = 50;
    let seperation = 4;
    var lapViewWidth = Math.floor((config.width - labelWidth) / (max - min));
    var moduleContainer = containerSvg.append("g")
        .attr("height", (config.height + 30) * properties.length)
        .attr("width", config.width);




    properties.forEach(function (element) {


        let itemId = element.id;
        let name = element.name;
        let laps = element.laps;
        let start = element.start;
        let end = element.end;



        let gLabel = moduleContainer.append('g')
            .attr("transform", "translate(" + (0) + "," + (config.height * index + seperation) + ")")
            .attr("width", labelWidth);

        let gHeatMap = moduleContainer.append('g')
            .attr("transform", "translate(" + (labelWidth) + "," + (config.height * index + seperation) + ")")
            .attr("width", config.width - labelWidth);

        gLabel.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .style("fill", function (d) { return getPilotColors(name) })
            .attr("width", labelWidth)
            .attr("height", config.height)
            .attr("opacity", 0.9)

        gLabel.append("text")
            .attr("x", 5)
            .attr("y", 20)
            .attr("class", "pilot-names")
            .attr("text-anchor", "start")
            .attr("fill", textColor)
            .text(function (d, i) { return name.substring(0, 3) })


        let heatMapConfig =
        {
            id: itemId,
            colorScale: getColor,
            width: (lapViewWidth * laps.length),
            height: config.height,
            x: d => d.lap,
            y: d => d.time,
        }

        let heatMap = new HeatMap(gHeatMap, heatMapConfig, laps);


        let domainX = d3.extent(laps, d => d.lap);
        let steps = laps.map(a => a.lap);
        let brushConfig = {
            id: "",
            steps: steps,
            orientation: 'X',
            min: domainX[0] ,
            max: domainX[1] ,
            width: (lapViewWidth * (laps.length-1)),
            height: config.height,
            handle:
            {
                type: ValueBrushHandle,
                config:
                {
                    width: lapViewWidth,
                    height: config.height,
                }
            }
        }

        let brush = new Brush(gHeatMap, brushConfig);
        brush.brushEnd = OnBrushEnd;

        function OnBrushEnd(min, max) {

            let event = new Event(EventTypes.horizontalzoom, { 'min': min, 'max': max, 'pilot': name, 'id': itemId }, 'chartSlider');
            eventBus.notify(event);

        }

        index += 1;
    });

    return container;
}

