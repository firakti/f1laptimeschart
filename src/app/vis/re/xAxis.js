class xAxis {
    constructor(container, config, data) {

        let defaultConfig = {
            tickCount: 10,
            width: 100,
            height: 100,
            scaleX: null,
            x: d => d.x,
            minX: null,
            maxX: null,
            format: d => d,
        };

        this.config = MergeTo(defaultConfig, config);

        if (this.config.scaleX == null) {
            this.config.scaleX = d3.scale.linear()
                .range([0, this.config.width])
                .domain([this.config.minX, this.config.maxX]);
        }

        this.xAxis = d3.svg.axis()
            .scale(this.config.scaleX)
            .orient("bottom")
            .ticks(this.config.tickCount)
            .tickFormat(this.config.format);


        this.xAxisContainer = container
            .attr("class", "x axis axis-text")
            .call(this.xAxis);
    }

    Resize(width, height) {
    }

    Zoom(minX, maxX) {
        this.config.scaleX.domain([minX, maxX]);
        this.xAxisContainer.call(this.xAxis);
        this.xAxisContainer.select(".x-axis").call(this.xAxis)
    }
}