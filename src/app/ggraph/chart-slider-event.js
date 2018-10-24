
d3Modules.chartSliderEvent =
    {
        name: "chartSliderEvent",
        config: "",
        create: function (divId, container, chartConfiguration, data, eventBus) {
            //console.log("chartSliderEventModule - Create");
            return createchartSliderEventModule(divId, container, chartConfiguration, data, eventBus);
        }
    };

function createchartSliderEventModule(containerDiv, containerSvg, chartConfiguration, data, eventBus) {

    var moduleConfiguration = chartConfiguration.modules.chartSliderEvent.config;

    var events = chartConfiguration.modules.chartSliderEvent.events;
    var eventconfig = chartConfiguration.modules.chartSliderEvent.eventconfig;

    var config = initConfig(containerDiv, chartConfiguration.config, moduleConfiguration);
    var dataConfig = initConfig(containerDiv, chartConfiguration.dataConfig, moduleConfiguration);
    config.width = config.width - 60;
    var d3config = initD3Config(config, dataConfig, chartConfiguration.data);
    var container = new Conatiner();

    var colors = chartConfiguration.pilotMedia;

    var moduleContainer = containerSvg.append("g")
        .attr("height", config.height)
        .attr("width", config.width)
        .attr("transform", config.transform)
        .attr("id", "chartSliderSvg")

    var colorMap = function (pilotName) {
        var value;
        colors.forEach(function (element) {
            if (element.name == pilotName)
                value = element.color;
        });
        return value;
    }

    let domainX = d3.extent(chartConfiguration.data, d => d['lap']);
    let domainY = d3.extent(chartConfiguration.data, d => d['time']);

    let steps = [];
    for (let i = domainX[0]; i <= domainX[1]; i++) {
        steps.push(i);
    }

    let brushConfig = {
        min: domainX[0],
        max: domainX[1],
        width: config.width,
        height: config.height,
        steps: steps,
    }
    let lineChartConfig = {
        width: config.width,
        height: config.height,
        colorMap: colorMap,
        xAxisHeight: 0,
        x: d => d['lap'],
        y: d => d['time'],
        minX: domainX[0],
        maxX: domainX[1],
        minY: domainY[0],
        maxY: domainY[1],
        yAxis: null,
    };


    let lineChart = new MultipleLineChart(moduleContainer, lineChartConfig, data)

    let brush = new Brush(moduleContainer, brushConfig);
    brush.brushEnd = OnBrushEnd;

    function OnBrushEnd(min, max) {

        let event = new Event();
        event.name = EventTypes.horizontalzoom;
        event.value = { min: min, max: max };
        event.source = "chartSlider";
        eventBus.notify(event);

    }

    function HandleEvent(event) {
        if (event.name == EventTypes.resize) {
            resize();

        }
        else if (event.name == EventTypes.hover) {
            hover(event.value.key);
        }

        else if (event.name == EventTypes.unhover) {
            unHover(event.value.key);
        }

    }
    function hover(key) {
        lineChart.SetHover(key.name, 1);
    }

    function unHover(key) {
        lineChart.SetHover(key.name, 0);
    }
    function resize() {
    }

    eventBus.subscribe(HandleEvent);
    container.refresh = function (chartConfiguration) { }
    return container;
}
