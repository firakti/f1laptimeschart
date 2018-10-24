function StateManager() {
    var currentState = {}
    this.write = function (key, value) {
        updateCurrentState()
        currentState[key] = value;
        updateUrl()
    }
    this.read = function (key) {
        updateCurrentState();
        return currentState[key];
    }
    function updateCurrentState() {
        var a = getUrlParams("state");
        currentState = a ? JSON.parse(a) : {}
    }
    function updateUrl() {
        if (!isIOS)
            history.replaceState("", "", "?state=" + JSON.stringify(currentState));
    }
    function getUrlParams(search) {
        var url = new URL(window.location.href);
        return url.searchParams.get(search);
    }


}
var view = new View();
var dataRepository = new GpDataRepository();
var appContoller = new AppController(view, dataRepository);
var stateManager = new StateManager();
var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

let season;
let raceIndex;

if (stateManager.read("season") && stateManager.read("race")) {  
    season = stateManager.read("season");
    raceIndex = stateManager.read("race");
}
else {
    season = 2018;
    raceIndex = 1;
}

appContoller.LoadSeason(season,raceIndex);




