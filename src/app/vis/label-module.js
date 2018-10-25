
d3Modules.label =
    {
        name: "label",
        create: function (divId, container, chartConfiguration, data, eventBus) {
            return createLabelModule(divId, container, chartConfiguration, data, eventBus);
        }
    };



function createLabelModule(containerDiv, containerSvg, chartConfiguration, data, eventBus) {

    var config = initConfig(containerDiv, chartConfiguration.config, chartConfiguration.modules.label.config);
    var container = new VisualizationModule();

    var pilots = chartConfiguration.pilots;
    var colors = chartConfiguration.pilotMedia;


    var getPilotColors = function (pilotName) {
        var value;
        colors.forEach(function (element) {
            if (element.name == pilotName)
                value = element.color;
        });
        return value;
    }

    let labelContainer = containerSvg.append("g").attr("width", config.width).attr("height", config.height);

    let labelConfig = {
        width: config.width,
        height: config.height,
        colorMap: getPilotColors,
        value: d => d.name,
        format: d => d.name.substring(0, 3)
    };

    let label = new Label(labelContainer, labelConfig, pilots)
    label.ItemHover = onItemHovered;
    label.ItemUnHover = onItemUnHovered;
    label.ItemSelected = onItemSelected

    function onItemUnHovered(d) {

        var event = new Event();
        event.name = EventTypes.unhover;
        event.value = { key: d };
        eventBus.notify(event);

    }

    function onItemHovered(d) {

        var event = new Event();
        event.name = EventTypes.hover;
        event.value = { key: d };
        eventBus.notify(event);

    }
    function onItemSelected(selected, allStatus) {

        var event = new Event();
        event.name = EventTypes.click;
        event.value = { key: selected, selectedItems: allStatus };
        eventBus.notify(event);

    }


    return container;
}
