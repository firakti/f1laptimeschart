class ToolTip {
    constructor() {

    }
    Show() {

    }
}
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
}