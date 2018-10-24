// Merge  obj2 over obj1 1
function MergeTo(obj1, obj2) {
    let cloneObject = Object.assign({}, obj1);


    for (let property in obj2) {

        if (obj2.hasOwnProperty(property)) {
            if (obj2[property]
                && typeof obj2[property] === "object"
                && typeof cloneObject[property] === "object"
                && (!Array.isArray(obj2[property]))
                && (!Array.isArray(cloneObject[property]))
            )
            {
                cloneObject[property] = MergeTo(cloneObject[property], obj2[property]);     
            }
            else
            {
                cloneObject[property] = obj2[property];
            }
        }
    }
    return cloneObject;
}
function isEmptyObject(obj) {
    return Object.getOwnPropertyNames(obj).length === 0;
}
var toFormatedTime = function (miliseconds) {
    var minute = Math.floor(miliseconds / (1000 * 60));
    var second = Math.floor((miliseconds - minute * (1000 * 60)) / 1000);
    var milisecond = Math.floor(miliseconds) % 1000;
    return minute + ":" + second + "." + milisecond;
}