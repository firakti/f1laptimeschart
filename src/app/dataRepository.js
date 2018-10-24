class GpDataRepository {
    constructor() {

        var dataUrl = "data/";
        var teamColors = {};

        teamColors[2018] = {
            'Mercedes': '#00D2BE',
            'Ferrari': '#DC0000',
            'Red Bull': '#1E41FF',
            'Haas F1 Team': '#828282',
            'Williams': '#FFFFFE',
            'Toro Rosso': '#469BFF',
            'Force India': '#F596C8',
            'Renault': '#FFF500',
            'McLaren': '#006EFF',
            'Sauber': '#9B0000'
        };
        this.getSeasonRaceList = function(season)
        {
            let url = dataUrl + '/season-' + season + '.json';
            let seasonInfo = null;
            $.ajaxSetup({
                async: false
            });
            $.getJSON(url, function(data) {
                seasonInfo = data;
            });
            $.ajaxSetup({
                async: true
            });
            return seasonInfo;
        }
        this.getRaceData = function(season, raceIndex) {
            let url = dataUrl + '/race/' + season + '/' + raceIndex + '.json';
            let gpData = null;
            $.ajaxSetup({
                async: false
            });
            $.getJSON(url, function(data) {
                gpData = data;
            });
            $.ajaxSetup({
                async: true
            });
            var t0 = performance.now();
            let best = gpData.AllLaps[0].time;
            let worst = gpData.AllLaps[0].time;
            var lapTimeMap = {};
            gpData.Pilots.forEach(function(element) {
                lapTimeMap[element.name] = [];
            });
            gpData.AllLaps.forEach(function(lapTime) {
                lapTimeMap[lapTime.pilot].push(lapTime);
            }, this);
            gpData.AllLaps.forEach(function(lap) {
                if (lap.time < best) {
                    best = lap.time;
                }
                if (lap.time > worst) {
                    worst = lap.time;
                }
            }, this);
            var t1 = performance.now();
            console.log("Call to init took " + (t1 - t0) + " milliseconds.");
            let raceData = {
                best: best,
                worst: worst,
                lapTimes: gpData.AllLaps,
                lapCount: gpData.LapCount,
                pilotMedia: this.getPilotMedia(gpData.Pilots),
                pilots: gpData.Pilots,
                lapTimeMap: lapTimeMap
            };
            return raceData;
        };
        this.getPilotMedia = function(pilots) {
            var pilotMedia = [];
            pilots.forEach(function(pilot) {
                pilotMedia.push({ 'name': pilot.name, 'color': teamColors[2018][pilot.team], 'image': './img/P1' });
            }, this);
            return pilotMedia;
        };
    }
}

