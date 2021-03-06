
function AppController(view, dataRepository) {


    comparisonRanges = {};

    function ComparisonItem(name, start, end, id) {

        this.id = id;
        this.name = name;
        this.start = start;
        this.end = end;
        this.length = 0;
        this.laps = [];
        this.toRange = function () {
            return { "id": this.id, "name": this.name, "start": this.start, "end": this.end };
        }

    }

    var _this = this;
    this.view = view;

    this.dataRepository = dataRepository;

    this.defaultMin = 1;
    this.defaultMax = 70;
    this.maxItemCount = 5;
    this.selectedPilots = [];
    this.lapData;
    this.pilots;
    this.pilotMedia;
    this.events;
    this.lapCount;
    this.sliderData;
    this.comparisonData;
    this.LoadSeason = function (season, race) {
        race = race || 1;
        let seasons = [2017, 2018];
        _this.seasonInfo = _this.dataRepository.getSeasonRaceList(season, raceIndex);
        _this.view.buildMenu(seasons, _this.seasonInfo);

        _this.LoadRace(season, race);
    }
    this.LoadRace = function (season, raceIndex) {

        stateManager.write("season", season);
        stateManager.write("race", raceIndex);

        _this.raceData = _this.dataRepository.getRaceData(season, raceIndex);
        _this.init();

    }

    this.init = function () {

        _this.lapData = _this.raceData.lapTimes;
        _this.pilots = _this.raceData.pilots;
        _this.pilotMedia = _this.raceData.pilotMedia;
        _this.events = null;
        _this.lapCount = _this.raceData.lapCount;

        _this.defaultMax = _this.lapCount;
        _this.bestTime = _this.raceData.best;
        _this.worstTime = _this.raceData.worst;
        _this.sliderData = [];
        _this.comparisonData = [];

        _this.initVisualizations();

        if (stateManager.read("pilots")) {
            initState(stateManager.read("pilots"))
        }

    }

    function initState(pilots) {
        _this.selectedPilots = [];

        pilots.forEach(function (pilot) {
            _this.addComparisonItem(pilot.name, pilot.start, pilot.end, pilot.id);
        }, this);

        _this.view.drawSliders(_this.selectedPilots, _this.bestTime, _this.worstTime);
        _this.comparisonData = _this.createComparisonData(_this.selectedPilots);
        _this.view.drawComparison(_this.comparisonData);
    }

    this.initVisualizations = function () {
        _this.view.init(_this.lapData, _this.pilots, _this.pilotMedia, _this.events, _this.lapCount, _this.sliderData, _this.comparisonData);
        _this.view.onPilotSelectedEvent.subscribe(_this.AddSelectedPilot);
        _this.view.onPilotSliderChangeEvent.subscribe(_this.ChangeComprasionRange);
    }

    this.AddSelectedPilot = function (pilots) {

        _this.selectedPilots = [];

        pilots.forEach(function (pilot) {
            _this.addComparisonItem(pilot.name, _this.defaultMin, _this.defaultMax, pilot.id);
        }, this);


        stateManager.write("pilots", getRange(_this.selectedPilots));

        _this.view.drawSliders(_this.selectedPilots, _this.bestTime, _this.worstTime);
        _this.comparisonData = _this.createComparisonData(_this.selectedPilots);
        _this.view.drawComparison(_this.comparisonData);
    }
    this.ChangeComprasionRange = function (range) {




        var pilot = range.pilot;
        var start = range.start;
        var end = range.end;
        var id = range.sliderId;

        comparisonRanges[id] = range;

        _this.selectedPilots.forEach(function (selectedPilot) {
            if (selectedPilot.id == id) {
                selectedPilot.start = start;
                selectedPilot.end = end;
            }
        }, this);

        stateManager.write("pilots", getRange(_this.selectedPilots));

        _this.comparisonData = _this.createComparisonData(_this.selectedPilots);
        _this.view.drawComparison(_this.comparisonData);
    }

    function getRange(pilots) {
        var ranges = [];
        pilots.forEach(function (pilot) {
            ranges.push(pilot.toRange());
        })
        return ranges;
    }



    this.addComparisonItem = function (name, start, end, id) {

        var item = new ComparisonItem(name, start, end, id);
        item.laps = _this.raceData.lapTimeMap[item.name];

        if (typeof comparisonRanges[id] != 'undefined') {
            item.start = comparisonRanges[id].start;
            item.end = comparisonRanges[id].end;
        }

        _this.selectedPilots.push(item);

        return true;
    }

    this.createComparisonData = function (selectedPilots) {

        var pilotData = [];
        var comparisonData = [];
        var bestTime = -1;


        selectedPilots.forEach(function (pilot) {
            var selectedLaps = []
            for (i = pilot.start; i <= pilot.end; i++) {
                selectedLaps.push(_this.raceData.lapTimeMap[pilot.name][i - 1]);
            }
            pilotData.push(
                {
                    pilot: pilot.name,
                    data: selectedLaps,
                    start: pilot.start,
                    end: pilot.end
                });

        }, this);


        pilotData.forEach(function (element) {
            var itemComparisonData = { 'laps': [], 'total': 0, 'name': "", 'totaldif': 0 };
            var total = 0;
            element.data.forEach(function (item) {
                if (typeof item !== 'undefined') {

                    itemComparisonData.laps.push({
                        'name': element.pilot,
                        'time': item.time,
                        'lap': item.lap,
                        'dif': item.lap,
                        'start': total
                    });
                    total += item.time;
                }
            }, this);

            itemComparisonData.total = total;
            itemComparisonData.name = element.pilot;

            comparisonData.push(itemComparisonData);
            if (bestTime == -1) {
                bestTime = itemComparisonData;
            } else if (total < bestTime.total) {
                bestTime = itemComparisonData;
            }
            var i = 0;
        }, this);


        comparisonData.forEach(function (item) {
            item.totaldif = item.total - bestTime.total;

            for (var index = 0; index < item.laps.length; index++) {

                if (typeof bestTime.laps[index] != 'undefined') {
                    item.laps[index].dif = item.laps[index].time - bestTime.laps[index].time;
                }
                else {
                    item.laps[index].dif = item.laps[index].time;
                }
            }

        }, this);

        comparisonData.sort(function (a, b) {
            return a.total - b.total;
        });

        return comparisonData;
    }
}




