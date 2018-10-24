class d3Base {
    constructor(container, config, data) {

        this._defaultConfig;
        this.scaleX;
        this.container;
        this.scaleY;
        this.config;
        init(config, container, data);
    }

    initContainer(container) {
        if (typeof container === "string") { // if #divId , or  .divclass 
            this.container = d3.select(container).append("svg");
        }
        else { // else  assume container is appended g or svg
            this.container = container;
        }
    }

    init(config, container, data) {
        config = MergeTo(this._defaultConfig, config);
        let width = _calculateValue(container.node().getBoundingClientRect().width, config.width);
        let height = _calculateValue(container.node().getBoundingClientRect().height, config.height);

        config.domainX = config.domainX || d3.extent(data, config.x);
        config.domainY = config.domainY || d3.extent(data, config.y);

        this.scaleX = config.scaleX || d3.scale.linear()
            .range([0, width])
            .domain([config.domainX]);

        this.scaleX = config.scaleY || d3.scale.linear()
            .range([config.height, 0])
            .domain([config.domainY].reverse());

    }
    _calculateValue(gValue, configValue) {
        let calculatedValue = null;
        if (typeof configValue != 'undefined') {
            if (configValue % 1 === 0) { // if number
                calculatedValue = configValue;
            }
            else if (!isNaN(parseFloat(configValue))) { // if "100%" like
                calculatedValue = parseInt(gValue) * parseFloat(configValue) / 100;
            }
            else if (!isNaN(parseInt(configValue))) { // if number string 
                calculatedValue = parseInt(configValue);
            }
            else {
                calculatedValue = parseInt(gValue); // default size 
            }
        }
        return calculatedValue;
    }
}