var editableProperties = [];

function Conatiner() {

    this.hover;
    this.unhover;
    this.mouseOutHandlers = [];
    this.mouseOverHandlers = [];
    this.resize;
    this.refresh;
    this.appendData;
    this.handleEvent;
}

function Visulazation() {
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

function COLORS_GOOGLE(n) {
    var colores_g = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00", "#b82e2e", "#316395", "#994499", "#22aa99", "#aaaa11", "#6633cc", "#e67300", "#8b0707", "#651067", "#329262", "#5574a6", "#3b3eac"];
    return colores_g[n % colores_g.length];
}
function ColorHelper() {

    var index = 0;
    function Next() {
        return COLORS_GOOGLE(index++);
    }
    Keys = [];

    this.Get = function (key, IsHovered) {
        var IsActive = true;
        if (typeof IsHovered != 'undefined') {
            IsActive = IsHovered;
        }
        if (IsActive == false) {
            return "#AFB3B4";
        }
        if (typeof key != 'undefined') {
            if (typeof Keys[key] != 'undefined') {
                return Keys[key];
            }
            else {
                var color = Next();
                Keys[key] = color;
                return Keys[key];
            }
        }
        else {
            return Next();
        }
    };
}

d3.selection.prototype.moveToFront = function () {
    return this.each(function () {

        //    d3.select(LogContainer).text( this.__data__.key+"  "+d3.select(LogContainer).text()  );

        this.parentNode.parentNode.appendChild(this.parentNode);
    });
};

d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this.parentNode, firstChild);
        }
    });
};


d3.selection.prototype.moveToFront2 = function () {
    return this.each(function () {

        //    d3.select(LogContainer).text( this.__data__.key+"  "+d3.select(LogContainer).text()  );

        this.parentNode.appendChild(this);
    });
};

d3.selection.prototype.moveToBack2 = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.insertBefore(this, firstChild);
        }
    });
};

var d3Modules = {};
var colorHelper = new ColorHelper;

function Create(containerDivId, chartConfiguration) {

    var modules = [];
    $(containerDivId).empty();
    var mainSvg = d3.select(containerDivId).append("svg");
    setConfig(mainSvg, chartConfiguration.config);

    var pData = [];
    if ((typeof chartConfiguration.dataConfig != 'undefined') && (typeof chartConfiguration.data != 'undefined'))
        pData = initDataConfig(chartConfiguration.dataConfig, chartConfiguration.data)


    // mainSvg.append("rect")
    //         .attr("width", "100%")
    //         .attr("height", "100%")
    //         .attr("fill", "yellow");


    var eventBus = new EventBus();

    // append modules
    for (var config in chartConfiguration.modules) {
        if (chartConfiguration.modules.hasOwnProperty(config)) {
            if (d3Modules.hasOwnProperty(config)) {
                //console.log(d3Modules[config].name);
                modules[config] = d3Modules[config].create(containerDivId, mainSvg, chartConfiguration, pData, eventBus);
            }
        }
    }

    $(window).resize(function () {
        mainSvg.attr("width", getWidth(containerDivId, "100%"))
        var event = new Event();
        event.name = EventTypes.resize;
        event.value = "asdf";
        event.source = "resize-handler";

        eventBus.notify(event);
    });


    var container = new Visulazation();
    container.refresh = function refresh(chartConfiguration) {
        mainSvg.selectAll("*").remove();
        setConfig(mainSvg, chartConfiguration.config);

        var pData = [];
        if ((typeof chartConfiguration.dataConfig != 'undefined') && (typeof chartConfiguration.data != 'undefined'))
            pData = initDataConfig(chartConfiguration.dataConfig, chartConfiguration.data)


        for (var config in chartConfiguration.modules) {
            if (chartConfiguration.modules.hasOwnProperty(config)) {
                if (d3Modules.hasOwnProperty(config)) {
                    //console.log(d3Modules[config].name);
                    modules[config] = d3Modules[config].create(containerDivId, mainSvg, chartConfiguration, pData, eventBus);
                }
            }
        }
    }
    container.eventBus = eventBus
    return container;

}
