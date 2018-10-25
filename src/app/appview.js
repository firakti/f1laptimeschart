function View() {
    _this = this;

    this.lineChart;
    this.sliderChart;
    this.comparisonChart;
    this.lineChartConfig;
    this.sliderConfig;
    this.comparisonChartConfig;
    this.lineChartContainer = '#chart';
    this.sliderContainer = '#lapSelection';
    this.comparisonChartContainer = "#lapDetails";

    this.buildMenu = function (seasons, races) {
        var menuId = "#gplist"
        $(menuId).empty();
        races.RaceInfoList.forEach(function (gp) {

            var raceName = "'" + gp.RaceName + "'";
            var liClass = "";
            if (gp.IsHasLapData) {
                liClass = "enabled"
            }
            else {
                liClass = "disabled"
            }
            $(menuId).append(
                '<li class="' + liClass + '">' +
                '<a id = "' + gp.Round + '"class="nav-item">' +
                '<img src="./img/flags/' + getCountryCode(gp.Country) + '.svg">' +
                '<div class="nav-item-header">' + gp.Country + '</div>' +
                '</a>' +
                '</li>'
            )

            $("#" + gp.Round).click(function () {
                initRace(gp.Season,gp.Round,gp.RaceName);
            });
        }, this);


        seasons.forEach(function (season) {
            let id = "season_" + season;
            $("#seasonlist").append(
                '<li  id ="' + id + '" >' +
                '<a id = "' + season + '" >' + season + ' Season </a>' +
                '</li>'
            )

            $("#" + id).click(function () {
                setSeason(season);
            });
        }, this);

        function setSeason(season) {
            appController.LoadSeason(season, raceIndex)
        }

        function initRace(season, raceIndex, raceName) {
            $('#raceTitle').text(season + " " + raceName);
            $('.nav-item').removeClass('active');
            $('#' + raceIndex).addClass('active');
            appController.LoadRace(season, raceIndex)
        }
    }

    this.init = function (lapData, pilots, pilotMedia, events, lapCount, sliderData, comparisonData) {


        _this.lineChartConfig = {
            data: lapData,
            dataConfig:
            {
                x: 'lap',
                y: 'time',
                groupkey: 'pilot',
                name: 'pilot '
            },
            pilots: pilots,
            pilotMedia: pilotMedia,
            modules:
            {
                label:
                {
                    config:
                    {
                        margin: { top: 5, right: 20, bottom: 5, left: 10 },
                        height: 25
                    }
                },

                lineChart:
                {
                    config:
                    {
                        class: 'line',
                        margin: { top: 50, right: 0, bottom: 0, left: 60 },
                        height: 350,
                        hover: true,
                    }
                },

                verticalChartSlider:
                {
                    config:
                    {
                        margin: { top: 50, right: 0, bottom: 0, left: 0 },
                        width: 60,
                        height: 350,
                    }
                },

                chartSliderEvent:
                {
                    config:
                    {
                        class: 'line',
                        margin: { top: 400, right: 50, bottom: 5, left: 60 },
                        height: 50,
                        hover: true,
                    },
                },
            },
            config:
            {
                margin: { top: 0, right: 0, bottom: 100, left: 0 },
                width: "100%",
                height: 550,
                class: 'chart'
            }
        };

        _this.sliderConfig = {
            data: lapData,
            dataConfig:
            {
                x: 'lap',
                y: 'time',
                groupkey: 'pilot',
                name: 'pilot '
            },
            pilots: pilots,
            pilotMedia: pilotMedia,
            modules:
            {
                horizontalChartSlider:
                {
                    config:
                    {
                        margin: { top: 0, right: 20, bottom: 0, left: 20 },
                        height: 60,
                        width: "100%",
                    },
                    dataConfig:
                    {
                        min: 1,
                        max: lapCount
                    },
                    data: sliderData,
                },
            },
            config:
            {
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
                width: "100%",
                height: 300,
                class: 'chart3'
            }
        };

        comparisonChartConfig = {

            pilots: pilots,
            pilotMedia: pilotMedia,
            modules:
            {
                lapTimeBarChart:
                {
                    config:
                    {
                        class: 'line',
                        margin: { top: 100, right: 20, bottom: 10, left: 0 },
                        height: 100,
                        hover: true,
                    },
                    selectedLaps: comparisonData,
                }
            },
            config:
            {
                margin: { top: 0, right: 0, bottom: 100, left: 0 },
                width: "100%",
                height: 300,
                class: 'chart2'
            }
        };
        _this.lineChart = Create(_this.lineChartContainer, _this.lineChartConfig);
        _this.sliderChart = Create(_this.sliderContainer, _this.sliderConfig);
        _this.comparisonChart = Create(_this.comparisonChartContainer, comparisonChartConfig);

        _this.lineChart.eventBus.subscribe(_this.HandleEvents)
        _this.sliderChart.eventBus.subscribe(_this.HandleEvents)
        _this.comparisonChart.eventBus.subscribe(_this.HandleEvents)

    };

    this.drawvisualizations = function () {

    }

    this.drawLineChart = function (lapTimes, pilots, pilotMedia, events) {
        _this.lineChartConfig.data = lapData;
        _this.lineChartConfig.pilots = pilots;
        _this.lineChartConfig.pilotMedia = pilotMedia;
        _this.lineChartConfig.modules.chartSliderEvent.events = events;
        _this.lineChart.refresh(_this.lineChartConfig);
    };
    this.drawSliders = function (sliderData, min, max) {
        if (typeof sliderData.length != 'undefined')
            _this.sliderConfig.config.height = sliderData.length * 35;
        _this.sliderConfig.modules.horizontalChartSlider.dataConfig.best = min;
        _this.sliderConfig.modules.horizontalChartSlider.dataConfig.worst = max;
        _this.sliderConfig.modules.horizontalChartSlider.data = sliderData;
        _this.sliderChart.refresh(_this.sliderConfig);
    }
    this.drawComparison = function (comparisonData) {
        if (typeof comparisonData.length != 'undefined')
            comparisonChartConfig.config.height = comparisonData.length * 100;

        comparisonChartConfig.modules.lapTimeBarChart.selectedLaps = comparisonData;
        _this.comparisonChart.refresh(comparisonChartConfig);
    }

    this.HandleEvents = function (event) {
        if (event.name == EventTypes.horizontalzoom) {

            range = {};
            range.pilot = event.value.pilot;
            range.start = event.value.min;
            range.end = event.value.max;
            range.sliderId = event.value.id;

            _this.onPilotSliderChangeEvent.notify(range);
        }

        if (event.name == EventTypes.horizontalzoom) {

        }

        if (event.name == EventTypes.click) {

            var items = event.value.selectedItems;
            var eventData = [];
            for (var k in items) {
                if (items.hasOwnProperty(k)) {
                    if (items[k] == 0) {

                    }
                    else if (items[k] == 1) {
                        var data = { 'name': k, 'id': k + "1" }
                        eventData.push(data);
                    }
                    else if (items[k] == 2) {
                        var data = { 'name': k, 'id': k + "1" }
                        eventData.push(data);
                        data = { 'name': k, 'id': k + "2" }
                        eventData.push(data);

                    }

                }
            }
            _this.onPilotSelectedEvent.notify(eventData);
        }
    }

    this.onPilotSelectedEvent = new EventBus();
    this.onPilotSliderChangeEvent = new EventBus();

}