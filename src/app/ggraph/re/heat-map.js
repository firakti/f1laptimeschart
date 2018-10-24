//function d3Base {
//    attribtes = {
//    };
//    set(ob, property) {
//        let setter = ob.attr.bind(ob);
//        return function (value) {
//            setter("stroke-width", value);
//        }
//    }
//    getSetter() {
//    }
//    map(attributeName, setter) {
//        atributeMap = {}
//        atributes[attributeName] = d3.selectAll("rect").attr("asdfaf", function (this.));
//    }
//    update() {
//    }
//}

function HeatMap(g, config, data) {
    let _this = this;
    this.scaleX;
    this.colorScale;
    _init(g, config, data)

    function _init(g, chartConfig, data) {

        const _defaultConfig = {
            min: null,
            max: null,
            width: 100,
            height: 20,
            textColor:"#fff",
            colorScale: "",
            x: d => d.x,
            y: d => d.y,
            opacity:1,
            scaleX:null,
            domainX:null,

        };

        let config = MergeTo(_defaultConfig, chartConfig);

        let itemWidth = config.width / data.length

        let gHeatMag = g.append('g')
            .attr("width", config.width)
            .attr("id", "chartSliderSvg");
        ;
        if (!(config.min && config.max)) {

        }
        let domainX =config.domainX || d3.extent(data, config.x); 
        let scaleX = config.scaleX || d3.scale.linear().range([0, config.width]).domain([0,data.length]);


        let lapView = gHeatMag.selectAll(".lap")
            .data(data)
            .enter()


        lapView
            .append("rect")
            .text(function (d, i) {
                return config.x(d);
            })
            .style("fill", function (d) { return config.colorScale(config.y(d)) })
            .attr("width", itemWidth)
            .attr("height", config.height)
            .attr("x", function (i, i) {
                return scaleX(i);
            })

            .attr("y", 0)
            .attr("opacity", config.opacity)
            ;

        lapView
            .append('text')
            .attr("width", itemWidth)
            .attr("height", config.height)
            .attr("fill", config.textColor)
            .attr("text-anchor", "middle")
            .text(function (d, i) {
                return d.lap;
            })
            .attr("x", function (d, i) {
                return scaleX(i) + itemWidth / 2;
            })
            .attr("y", config.height / 2 + 5)
            ;

        _this.config = config;
        _this.scaleX = scaleX;

    }
}
