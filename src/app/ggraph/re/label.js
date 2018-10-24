class Label {
    constructor(container, chartConfig, data) {
        var _self = this;
        const defaultConfig =
        {
            statusStep: 1,
            width: 100,
            opacity: 1,
            height: 100,
            colorMap: d3.scale.category20(),
            value: d => d,
            color: "#fff",
            format: d => d,
            labelWidth: 50,
        }
        let config = MergeTo(defaultConfig, chartConfig);
        let labelStatuses = {};
        let labelContainer = container.append("g");
        let InRowCount;

        data.forEach(function (element) {
            labelStatuses[config.value(element)] = 0;
        })


        if (data.length * config.labelWidth > config.width) {
            InRowCount = Math.floor(config.width / config.labelWidth);
        }
        else
            InRowCount = data.length;

        let scaleX = d3.scale.linear()
            .range([0, config.width])
            .domain([0, InRowCount]);

        var chartLabels = labelContainer.selectAll(".pilot-label")
            .data(data)
            .enter().append("g")
            .attr("class", "pilot-label")
            .on("mouseover", function (d) { mouseOver(d) })
            .on("mouseout", function (d) { mouseOut(d) })
            .on("click", function (d, i) { mouseClicked(d) });

        var rects = chartLabels.append("rect")
            .attr("class", "s")
            .attr("x", function (d, i) { return (scaleX(i % InRowCount)) })
            .attr("y", function (d, i) { return config.height * (Math.floor(i / InRowCount)); })
            .style("fill", config.color)
            .attr("opacity", config.opacity)
            .attr("width", config.labelWidth)
            .style("stroke-width", 3)
            .style("stroke", function (d) { return config.colorMap(config.value(d)) })
            .attr("height", config.height)

        var texts = chartLabels.append("text")
            .attr("x", function (d, i) { return scaleX(i % InRowCount) + config.labelWidth / 2 })
            .attr("y", function (d, i) { return config.height * (Math.floor(i / InRowCount)) + config.height / 2 + 3; })
            .attr("class", "pilot-names")
            .attr("text-anchor", "middle")
            .attr("fill", function (d) { return config.colorMap(config.value(d)) })
            .text(function (d, i) { return config.format(d) })

        function Hover(selected) {

            rects
                .filter(function (d) {
                    if (typeof d == 'undefined')
                        return false;
                    return (config.value(d) === config.value(selected));
                })
                .style("fill", d => config.colorMap(config.value(d)))

            texts
                .filter(function (d) {
                    if (typeof d === 'undefined')
                        return false;
                    return (config.value(d) === config.value(selected));
                })
                .attr("fill", config.color);
            _self.ItemHover(selected);
        }
        function UnHover(selected) {

            rects
                .filter(function (d) {
                    if (typeof d == 'undefined')
                        return false;
                    return (config.value(d) === config.value(selected));
                })
                .style("fill", config.color)

            texts
                .filter(function (d) {
                    if (typeof d === 'undefined')
                        return false;
                    return (config.value(d) === config.value(selected));
                })
                .attr("fill", d => config.colorMap(config.value(d)))
            _self.ItemUnHover(selected);
        }
        function mouseOut(selected) {
            if (labelStatuses[config.value(selected)] == 1) {
                Hover(selected);
            }
            else {
                UnHover(selected);
            }
        }
        function mouseOver(selected) {

            if (labelStatuses[config.value(selected)] == 0) {
                Hover(selected);
            }
            else {
                UnHover(selected);
            }
        }
        function mouseClicked(d) {

            if (labelStatuses[config.value(d)]) {
                labelStatuses[config.value(d)] = 0;
                UnHover(d);
            }
            else {
                labelStatuses[config.value(d)] = 1;
                Hover(d);
            }
            _self.ItemSelected(labelStatuses[config.value(d)], labelStatuses);

        }
    }
}
