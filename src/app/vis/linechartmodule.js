
d3Modules.lineChart =
    {
        name: "lineChart",
        create: function (divId, container, chartConfiguration, data, eventBus) {

            return createLineChartModule(divId, container, chartConfiguration, data, eventBus);
        }
    };

function LineTooltip(svg, scaleX, scaleY, xKey, yKey) {

    var data = []
    var focus = svg.append("g");
    svg.on("mousemove", mousemove)
    bisectX = d3.bisector(function (d) { return d[xKey]; }).left;
    focus.append("rect")
        .attr("width", "100%")
        .attr("height", 20)
        .attr("opacity", 0.3)
    var text = focus.append("g")
        .attr("transform", "translate(10,15)")
        .append("text")
        .attr("class", "axis-text")
        .attr("width", "100%")
        .attr("height", 30)
        .text("");

    var toolTipText = function (d) {

        var htmlString =
            " Pilot :" + d['pilot'] + " " +
            " Lap :" + d['lap'] + " " +
            " Time :" + toFormatedTime(d['time']) + " " +
            " Position :" + d['pilotPosition'] + " "
        return htmlString;
    }

    this.show = function (d) {
        focus.attr("opacity", 1)
        data = d;
    }

    this.hide = function (d) {
        focus.attr("opacity", 0)
    }

    function mousemove(d) {
        var x0 = scaleX.invert(d3.mouse(this)[0]),
            i = bisectX(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0[xKey] > d1[xKey] - x0 ? d1 : d0;
        var tooltipText = toolTipText(d);
        text.text(tooltipText);
        //  text.text(JSON.stringify(d).replace(/_/g, " ").replace(/}/g, '\t').replace('{', ' ').replace(/"/g, ' ').replace(",", " "));
    }
    function getPositon(d) {

    }
}
function createLineChartModule(containerDiv, containerSvg, chartConfiguration, data, eventBus) {


    var colors = chartConfiguration.pilotMedia;
    var config = initConfig(containerDiv, chartConfiguration.config, chartConfiguration.modules.lineChart.config);

    config.width = config.width - config.margin.left;
    config.height = config.height;

    var container = new Conatiner();
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
        mouseOver: mouseOver,
        mouseOut: mouseOut,
        yAxisWidth: 50,
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

    function mouseOut(key, value) {

        if (IsNull(key))
            return false;

    }

    function mouseOver(key, value) {

        if (IsNull(key))
            return false;

    }



    function HandleEvent(event) {
        if (event.name == EventTypes.resize) {
            // resize();
        }

        else if (event.name == EventTypes.hover) {
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

            let hoverRate = 0.5;

            if (typeof key == 'undefined')
                return false;
            if (typeof focus == 'undefined') {
                if (typeof pilotStates[key.name] != 'undefined') {
                    focus = pilotStates[key.name];
                }
            }
            if (focus == 1) {
                hoverRate = 0.5;
            }
            if (focus == 2) {
                hoverRate = 1;
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

    function resize() {
    }


    eventBus.subscribe(HandleEvent);


    container.refresh = function (chartConfiguration) {

    }

    return container;
}


