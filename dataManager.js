const fs = require("fs");

var logger = require("./logger.js");

var DATA = {};
const DATAPath = "DATA.json";


function checkValidity(target = DATA)
{
    if(!target.global || !target.guilds || !target.channels)
    {
        return false;
    }
    
    return true;
}

function loadDataSync(path = DATAPath, target = DATA)
{
    try{
        Object.assign(target, JSON.parse(fs.readFileSync(path)));
        return true;
    }
    catch(err){
        logger.error(err);
        return false;
    }
}

function loadData(callback = ()=>{}, path = DATAPath, target = DATA)
{
    fs.readFile(path, function(err, data){
        if(err)
        {
            logger.error(err);
        }
        else
        {
            try{
                Object.assign(target, JSON.parse(data.toString()));
                callback();
            }
            catch(err){
                logger.error(err);
            }
        }
    })
}


function saveData(callback = ()=>{}, path = DATAPath, target = DATA)
{
    try
    {
        fs.writeFile(path, JSON.stringify(target), function(err){
            if(err)
            {
                logger.error(err);
            }
            else
            {
                callback();
            }
        });
    }
    catch(err)
    {
        logger.error(err);
    }
}

function resetData(target = DATA)
{
    Object.assign(target, {
        global: createDefaultDataLayer(),
        guilds: {},
        channels: {}
    });
}

const dataLayerDefaultKeys = [
    {
        keys: ["responsePresets"],
        getDefaultValue: function(){
            return {};
        }
    }
];

function createDefaultDataLayer()
{
    let dataLayer = {};
    for(let x of dataLayerDefaultKeys)
    {
        for(let key of x.keys)
        {
            dataLayer[key] = x.getDefaultValue();
        }
    }
    return dataLayer;
}

function getDataToAssign(keyPath, dataLayer)
{
    if(dataLayer === undefined)
    {
        return {};
    }
    let temp = dataLayer;
    for(let key of keyPath)
    {
        temp = temp[key];
        if(temp === undefined)
        {
            return {};
        }
    }
    return temp;
}

function getComputedData(keyPath, guildId, channelId, target = DATA)
{
    let result = {};
    if(keys)
    {
        Object.assign(result, getDataToAssign(keyPath, target.global));
        
        if(guildId)
        {
            Object.assign(result, getDataToAssign(keyPath, target.guilds[guildId]));
        }
        
        if(channelId)
        {
            Object.assign(result, getDataToAssign(keyPath, target.channels[channelId]));
        }
    }
    return result;
}

var isDataUpToDate = true;

function set(keyPath, targetKey, targetValue, dataLayer)
{
    let temp = dataLayer;
    for(let key of keyPath)
    {
        if(temp[key] === undefined)
        {
            temp[key] = {};
        }
        temp = temp[key];
    }
    temp[targetKey] = targetValue;
    isDataUpToDate = false;
}

function setGlobal(keyPath, targetKey, targetValue, target = DATA)
{
    set(keyPath, targetKey, targetValue, target.global)
}
function setGuild(guildId, keyPath, targetKey, targetValue, target = DATA)
{
    (target.guilds[guildId] === undefined)
    {
        target.guilds[guildId] = createDefaultDataLayer();
    }
    set(keyPath, targetKey, targetValue, target.guilds[guildId]);
}
function setChannel(channelId, keyPath, targetKey, targetValue, target = DATA)
{
    (target.channels[channelId] === undefined)
    {
        target.channels[channelId] = createDefaultDataLayer();
    }
    set(keyPath, targetKey, targetValue, target.channels[channelId]);
}


var autosaveInterval = undefined;
function enableAutosave(ms = 1000*60*5)
{
    saveData();
    if(autosaveInterval)
    {
        disableAutosave(true);
    }
    autosaveInterval = setInterval(function(){
        if(!isDataUpToDate)
        {
            saveData();
        }
    }, ms);
    logger.info("Autosave enabled (" + ms + "ms)");
}
function disableAutosave(noSave = false)
{
    if(!noSave)
    {
        saveData();
    }
    
    clearInterval(autosaveInterval);
    logger.info("Autosave disabled");
}

module.exports = {
    load: loadData,
    loadSync: loadDataSync,
    save: saveData,
    reset: resetData,
    get: getComputedData,
    set,
    setGlobal,
    setGuild,
    setChannel,
    checkValidity,
    disableAutosave,
    enableAutosave
}