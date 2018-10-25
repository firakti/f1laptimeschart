var EventTypes =
  {
    resize: "resize",
    hover: "hover",
    unhover: "unhover",
    click: "click",
    zoom: "zoom",
    verticalzoom: "verticalzoom",
    horizontalzoom: "horizontalzoom",
  }

var Event = function (_name, _value, _source) {
  if (arguments.length == 3) {
    this.name = _name;
    this.value = _value;
    this.source = _source;
  }
  else {
    this.name = "";
    this.value = "";
    this.source = "";
  }
}

var EventBus = function () {
  this.observers = [];

  this.subscribe = function (observer) {
    this.observers.push(observer);
  };
  this.notifyAllObservers = function () {
    for (var i = 0; i < this.observers.length; i++) {
      this.observers[i].notify(i);
    };
  };
  this.notify = function (event) {

    for (var i = 0; i < this.observers.length; i++) {
      try
      {
          this.observers[i](event);
      } catch (error) {

      }   
    };
  };
};