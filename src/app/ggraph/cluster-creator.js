

function GetMaxMin(dataArray, key) {
    var min = dataArray[0];
    var max = dataArray[0];
    for (var i = 0; i < dataArray.length; i++) {
        if (dataArray[i][key] <= min[key]) {
            min = dataArray[i];
        }
        if (dataArray[i][key] >= max[key]) {
            max = dataArray[i];
        }
    }
    return {
        'min': min,
        'max': max
    };
}


function calculateCenter(dataArray, key) {
    var total = 0;
    for (var i = 0; i < dataArray.length; i++) {
        total += dataArray[i][key];
    }
    return total / dataArray.length;
}


function getClusters(point1, point2, dataArray, key) {
    var cluster1 = {
        'items': [],
        'center': point1
    };
    var cluster2 = {
        'items': [],
        'center': point2
    };



    dataArray.forEach(function (element) {
        var c1Distance = Math.abs(element[key] - cluster1.center);
        var c2Distance = Math.abs(element[key] - cluster2.center);
        if (c1Distance < c2Distance) {
            cluster1.items.push(element);
        } else {
            cluster2.items.push(element);
        }
    }, this);

    cluster1.center = calculateCenter(cluster1.items, key);
    cluster2.center = calculateCenter(cluster2.items, key);

    return [cluster1, cluster2];
}

function calculateScale(dataArray, key) {

    var mapCount;
    var edges = GetMaxMin(dataArray, key);
    var point1 = edges.min;
    var point2 = edges.max;
    var clusters = getClusters(point1[key], point2[key], dataArray, key);

    for (var i = 0; i < 3; i++) {
        clusters = getClusters(clusters[0].center, clusters[1].center, dataArray, key);
    }

    return GetMaxMin(clusters[0].items, key);
} 