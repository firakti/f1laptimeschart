function VisualizationModule() {
    this.eventBus;
    this.hover;
    this.unhover;
    this.mouseOutHandlers = [];
    this.mouseOverHandlers = [];
    this.resize;
    this.refresh;
    this.appendData;
    this.handleEvent;
}

d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};

d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.insertBefore(this, firstChild);
        }
    });
};

var d3Modules = {};

function Create(containerDivId, chartConfiguration) {

    var modules = [];
    $(containerDivId).empty();
    var mainSvg = d3.select(containerDivId).append("svg");
    mainSvg.attr(chartConfiguration.config);

    var pData = [];
    if ((typeof chartConfiguration.dataConfig != 'undefined') && (typeof chartConfiguration.data != 'undefined')) {
        pData = initDataConfig(chartConfiguration.dataConfig, chartConfiguration.data);
    }
    var eventBus = new EventBus();

    // append modules
    for (var config in chartConfiguration.modules) {
        if (chartConfiguration.modules.hasOwnProperty(config)) {
            if (d3Modules.hasOwnProperty(config)) {
                modules[config] = d3Modules[config].create(containerDivId, mainSvg, chartConfiguration, pData, eventBus);
            }
        }
    }

    $(window).resize(function () {
        mainSvg.attr("width", getAbsoluteValue(containerDivId, "100%"))
        var event = new Event();
        event.name = EventTypes.resize;
        event.value = "asdf";
        event.source = "resize-handler";

        eventBus.notify(event);
    });


    var container = new VisualizationModule();
    container.refresh = function refresh(chartConfiguration) {
        mainSvg.selectAll("*").remove();
        mainSvg.attr(chartConfiguration.config);

        var pData = [];
        if ((typeof chartConfiguration.dataConfig != 'undefined') && (typeof chartConfiguration.data != 'undefined'))
            pData = initDataConfig(chartConfiguration.dataConfig, chartConfiguration.data)


        for (var config in chartConfiguration.modules) {
            if (chartConfiguration.modules.hasOwnProperty(config)) {
                if (d3Modules.hasOwnProperty(config)) {
                    modules[config] = d3Modules[config].create(containerDivId, mainSvg, chartConfiguration, pData, eventBus);
                }
            }
        }
    }
    container.eventBus = eventBus
    return container;

}
