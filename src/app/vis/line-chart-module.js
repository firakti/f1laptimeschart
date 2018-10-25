
d3Modules.lineChart =
    {
        name: "lineChart",
        create: function (divId, container, chartConfiguration, data, eventBus) {

            return createLineChartModule(divId, container, chartConfiguration, data, eventBus);
        }
    };

function createLineChartModule(containerDiv, containerSvg, chartConfiguration, data, eventBus) {


    var colors = chartConfiguration.pilotMedia;
    var config = initConfig(containerDiv, chartConfiguration.config, chartConfiguration.modules.lineChart.config);

    config.width = config.width - config.margin.left;
    config.height = config.height;

    var container = new VisualizationModule();
    let pilotStates = {};
    var colorMap = function (pilotName) {
        var value;
        colors.forEach(function (element) {
            if (element.name == pilotName)
                value = element.color;
        });
        return value;
    }

    var moduleContainer = containerSvg
        .append("g")
        .attr("width", config.width)
        .attr("height", config.height)
        .attr("transform", "translate(" + (config.margin.left) + "," + config.margin.top + ")")


    let domainX = d3.extent(chartConfiguration.data, d => d['lap']);
    let domainY = d3.extent(chartConfiguration.data, d => d['time']);

    let lineChartConfig = {
        width: config.width,
        height: config.height,
        colorMap: colorMap,
        yAxisWidth: 50,
        opacity:0.2,
        xAxisHeight: 40,
        x: d => d['lap'],
        y: d => d['time'],
        minX: domainX[0],
        maxX: domainX[1],
        minY: domainY[0],
        maxY: domainY[1],
        yAxis: {
            config: {
                format: toFormatedTime
            }
        }
    };

    let lineChart = new MultipleLineChart(moduleContainer, lineChartConfig, data)

    function HandleEvent(event) {
        
        if (event.name == EventTypes.hover) {
            hover(event.value.key);
        }
        else if (event.name == EventTypes.unhover) {
            unHover(event.value.key);
        }

        else if (event.name == EventTypes.click) {
            var pilot = event.value.key;
            var focus = event.value.focus;
            onClickHandler(pilot, focus);
        }

        else if (event.name == EventTypes.horizontalzoom) {
            var min = event.value.min;
            var max = event.value.max;
            zoomHorizontal(max, min);
        }
        else if (event.name == EventTypes.verticalzoom) {
            var min = event.value.min;
            var max = event.value.max;
            zoomVertical(max, min);
        }
        function onClickHandler(pilot, focus) {

            pilotStates[pilot.name] = focus;

            if (focus == 0) {
                unHover(pilot.name);
            }
            else if (focus == 1) {
                hover(pilot.name, focus);
            }
            else if (focus == 2) {
                hover(pilot.name, focus);
            }

        }

        function hover(key, focus) {

            let hoverRate = 1;

            if (typeof key === 'undefined')
                return false;
            if (typeof focus === 'undefined') {
                if (typeof pilotStates[key.name] != 'undefined') {
                    focus = pilotStates[key.name];
                }
            }
            lineChart.SetHover(key.name, hoverRate);
        }

        function unHover(key) {

            if (typeof pilotStates[key.name] != 'undefined') {
                if (pilotStates[key.name] != 0)
                    return;
            }
            lineChart.SetHover(key.name, 0);
        }

        function zoomVertical(max, min) {
            if (!IsNull(min) && !IsNull(max)) {
                lineChart.ZoomVertical(min, max);
            }
        }

        function zoomHorizontal(max, min) {
            if (!IsNull(min) && !IsNull(max)) {

                lineChart.ZoomHorizontal(min, max);

            }
        }

    }

    eventBus.subscribe(HandleEvent);

    return container;
}


