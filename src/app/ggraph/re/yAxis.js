class yAxis {
    constructor(container, config, data) {

        let defaultConfig = {
            width: 100,
            height: 100,
            scaleY: null,
            y: d => d.y,
            minY: null,
            maxY: null,
            format: d => d,
            tickCount: 10,
        };

        this.config = MergeTo(defaultConfig, config);

        if (this.config.scaleY == null) {
            this.config.scaleY = d3.scale.linear()
                .range([0, this.config.width])
                .domain([this.config.minY, this.config.maxY]);
        }

        this.yAxis = d3.svg.axis()
            .scale(this.config.scaleY)
            .orient("left")
            .ticks(this.config.tickCount)
            .tickFormat(this.config.format);

        this.yAxisContainer = container
            .attr("class", "y axis axis-text")
            .call(this.yAxis);
    }

    Zoom(minY, maxY) {
        this.config.scaleY.domain([minY, maxY]);
        this.yAxisContainer.call(this.yAxis);
        this.yAxisContainer.select(".y-axis").call(this.yAxis)
    }
}