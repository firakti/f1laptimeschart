function setConfig(item,config) // set attr of svg item
{
    for (var key in config) {
        if (config.hasOwnProperty(key)) {
        
                item.attr(key,config[key]);
                //console.log(key+' : '+config[key]);
        }
     }
}

function setConfigOf(modul,config)
{
    for (var key in config) {
        if (config.hasOwnProperty(key)) {
            modul.set(property+'.'+key,config[key]);
        }
     }
}

function calculateSize(container,parentConfigWidth,moduleConfigWidth)
{
    var width  = 0;
    
    if(typeof moduleConfigWidth !='undefined')
    {
        width = getWidth(container,moduleConfigWidth)
    }
    else if(typeof parentConfigWidth !='undefined')
    {
        width = getWidth(container,parentConfigWidth)
    }
    else
    {
        width = getWidth(container,'100%')
    }

    if(!IsNull(config.margin))
    {

        var translateX = 0;
        var translateY = 0;
        var totalX = 0;
        var totalY = 0;
        if(!IsNull(config.margin.top))
        {
            translateY = config.margin.top;
            totalY+= config.margin.top;
            //config.height+=config.margin.top;
        }
        if(!IsNull(config.margin.bottom))
        {
            totalY+= config.margin.bottom;
            // translateX = config.margin.top;
            // config.height+=config.margin.top;
        }
        if(!IsNull(config.margin.left))
        {
            translateX= config.margin.left;
            totalX += config.margin.left;
            //config.height+=config.margin.top;
        }
        if(!IsNull(config.margin.right))
        {
             totalX += config.margin.right;
            //config.height+=config.margin.top;
        }
        
        if(typeof moduleConfigWidth =='undefined')
        {
             if (!isNaN(parseFloat(parentConfigWidth))) {
                width = width-totalX;
             }
        }


    }
    return width;
}
function initConfig(container,parentConfig,moduleConfig)
{
    var config=[];

    // attributes from parent configuration
     if(!IsNull(parentConfig))
        for (var key in parentConfig) {
            if (parentConfig.hasOwnProperty(key)) {
                config[key] = parentConfig[key];
                //console.log('parentConfig - ' + key+' : '+parentConfig[key]);
            }
        }

     // attributes from modul config
     if(!IsNull(moduleConfig))
        for (var key in moduleConfig) {
            if (moduleConfig.hasOwnProperty(key)) {
                config[key] = moduleConfig[key];
                //console.log('moduleConfig - ' + key+' : '+moduleConfig[key]);
            }
        }
    
    config.width = getWidth(container,config.width)
    
    if(!IsNull(config.margin))
    {

        var translateX = 0;
        var translateY = 0;
        var totalX = 0;
        var totalY = 0;
        if(!IsNull(config.margin.top))
        {
            translateY = config.margin.top;
            totalY+= config.margin.top;
            //config.height+=config.margin.top;
        }
        if(!IsNull(config.margin.bottom))
        {
            totalY+= config.margin.bottom;
            // translateX = config.margin.top;
            // config.height+=config.margin.top;
        }
        if(!IsNull(config.margin.left))
        {
            translateX= config.margin.left;
            totalX += config.margin.left;
            //config.height+=config.margin.top;
        }
        if(!IsNull(config.margin.right))
        {
             totalX += config.margin.right;
            //config.height+=config.margin.top;
        }
        
        if(typeof moduleConfig.width =='undefined')
        {
             if (!isNaN(parseFloat(parentConfig.width))) {
                config.width = config.width-totalX;
            }
        }


    }
    config.transform  =  "translate(" + translateX + "," + translateY + ")";

    return config;
}

