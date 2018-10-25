d3Modules.verticalChartSlider = {
    name: 'verticalChartSlider',
    create: function (divId, container, chartConfiguration, data, eventBus) {
        return createVerticalChartSlider(divId, container, chartConfiguration, data, eventBus);
    }
};

function createVerticalChartSlider(containerDiv, containerSvg, chartConfiguration, data, eventBus) {


    var moduleConfiguration = chartConfiguration.modules.verticalChartSlider.config;
    var config = initConfig(containerDiv, chartConfiguration.config, moduleConfiguration);

    var container = new VisualizationModule();

    var moduleContainer = containerSvg.append("g")
        .attr("height", config.height)
        .attr("width", config.width)
        .attr("transform", config.transform)

    let domainY = d3.extent(chartConfiguration.data, d => d['time']);

    let brushConfig = {
        orientation: 'Y',
        min: domainY[0],
        max: domainY[1],
        width: config.width,
        height: config.height,
        handle: {
            type: ValueBrushHandle,
            config: {
                format: toFormatedTime,
                width: config.width,
                height: 20,
            }
        }
    }

    let brush = new Brush(moduleContainer, brushConfig);
    brush.brushEnd = OnBrushEnd;

    function OnBrushEnd(min, max) {

        let event = new Event();
        event.name = EventTypes.verticalzoom;
        event.value = {
            min: min,
            max: max
        };
        event.source = "chartSlider";
        eventBus.notify(event);

    }

    container.refresh = function (chartConfiguration) {}
    return container;
}