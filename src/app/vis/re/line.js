class MultipleLineChart {

    constructor(container, config, data) {

        let yAxisWidth = 0;
        let xAxisHeight = 0;
        let width = 0;
        let height = 0;
        this.lines = {};
        this.config = {};

        let defaultConfig = {
            colorMap: [],
            hideYAxis: false,
            hideXAxis: false,
            yAxisWidth: 40,
            xAxisHeight: 40,
            strokeWidth: 1,
            opacity: 0.5,
            width: 1000,
            height: 500,
            minX: null,
            maxX: null,
            minY: null,
            maxY: null,
            x: d => d.x,
            y: d => d.y,
            mouseOut: null,
            mouseOver: null,
            interpolate: "step",
            hoverOpacity: 1,
            hoverStrokeWidth: 2,

            xAxis: {
                type: xAxis,
                config: {}
            },
            yAxis: {
                type: yAxis,
                config: {}
            },

        };

        this.config = MergeTo(defaultConfig, config);

        if (this.config.yAxis) {
            yAxisWidth = this.config.yAxisWidth;
        }
        if (this.config.xAxis) {
            xAxisHeight = this.config.xAxisHeight;
        }

        width = this.config.width - yAxisWidth;
        height = this.config.height - xAxisHeight;


        this.scaleX = d3.scale.linear()
            .range([0, width])
            .domain([this.config.minX, this.config.maxX]);

        this.scaleY = d3.scale.linear()
            .range([height, 0])
            .domain([this.config.minY, this.config.maxY]);

        this.d = d3.svg.line()
            .x(d => {
                let v = this.config.x(d)
                let p = this.scaleX(v);
                return p;
            })
            .y(d => {
                let value = this.scaleY(this.config.y(d));
                return value;
            })
            .interpolate(this.config.interpolate);



        this._lineContainer = container
            .append("g")
            .attr("transform", "translate(" + (yAxisWidth) + "," + 0 + ")")
            .append("g")
            .append("svg")
            .attr("width", width)
            .attr("height", height)

        if (data.forEach)
            data.forEach(
                element => {
                    let color = this.config.colorMap(element.key)

                    this.lines[element.key] = this._lineContainer.append("path")
                        .datum(element.values)
                        .attr("d", this.d)
                        .attr("class", "line")
                        .attr("stroke", color)
                        .attr("stroke-width", this.config.strokeWidth)
                        .attr("opacity", this.config.opacity)
                        .on("mouseover", this.OnMouseOver(this))
                        .on("mouseout", this.OnMouseOut(this));

                });


        if (this.config.xAxis != null) {
            let xAxisContainer = container
                .append("g")
                .attr("width", width)
                .attr("height", xAxisHeight)
                .attr("transform", "translate(" + yAxisWidth + "," + height + ")")

            let xAxisConfig = this.config.xAxis.config;
            xAxisConfig.scaleX = this.scaleX;
            this.xAxis = new this.config.xAxis.type(xAxisContainer, xAxisConfig);
        }

        if (this.config.yAxis != null) {

            let yAxisContainer = container
                .append("g")
                .attr("width", yAxisWidth)
                .attr("height", height)
                .attr("transform", "translate(" + yAxisWidth + "," + 0 + ")")


            let yAxisConfig = this.config.yAxis.config;
            yAxisConfig.scaleY = this.scaleY;
            this.yAxis = new this.config.yAxis.type(yAxisContainer, yAxisConfig);
        }
    }

    OnMouseOver(self) {
        return function (d, i) {

        }
    }
    OnMouseOut(self) {
        return function (d, i) {

        }
    }
    SetHover(key, rate) {

        if (!IsNull(this.lines[key])) {

            let opacity = this.config.opacity;
            let strokewidth = this.config.strokeWidth;

            if (!(rate == null) && !(rate == 0)) {
                opacity = (this.config.hoverOpacity - this.config.opacity) * rate + this.config.opacity;
                strokewidth = (this.config.hoverStrokeWidth - this.config.strokeWidth) * rate + this.config.strokeWidth;
            }

            this.lines[key]
                .attr("opacity", opacity)
                .attr("stroke-width", strokewidth)
                .moveToFront();
        }
    }

    ZoomHorizontal(minX, maxX) {
        this.scaleX.domain([minX, maxX]);
        this._lineContainer.selectAll("path").attr("d", this.d);
        if (this.xAxis)
            this.xAxis.Zoom(minX, maxX);
    }
    ZoomVertical(minY, maxY) {
        this.scaleY.domain([minY, maxY]);
        this._lineContainer.selectAll("path").attr("d", this.d);
        if (this.yAxis)
            this.yAxis.Zoom(minY, maxY);
    }

    Resize(width, height) {
        this.scaleY.range([height, 0]);
        this.scaleX.range([0, width]);
        this._lineContainer.selectAll("path").attr("d", this.d);
    }

}
