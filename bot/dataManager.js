const fs = require("fs");


const defaultScopeDataLayer = {
    presetResponses: {},
    safeOverloadEnabled: false,
    test: "Global"
}

class DataManager_impl
{
    // Save given data to a file
    static saveSync(dataObject, filePath)
    {
        return new Promise((resolve) => {
            fs.writeFileSync(filePath, JSON.stringify(dataObject));
            resolve();
        });
    }
    
    // Load given data from file
    static loadSync(dataObject, filePath)
    {
        return new Promise((resolve) => {
            let dataString = fs.readFileSync(filePath).toString();
            Object.assign(dataObject, JSON.parse(dataString));
            if(dataObject instanceof Object && !Array.isArray(dataObject) && dataObject !== null)
            {
                resolve();
            }
            else
            {
                throw new TypeError("Loaded data must be a non-null object");
            }
        });
    }
    
    static getFromLayer(dataLayerObject, propertyPath)
    {
        let result = dataLayerObject;
        // Brakes the loop, if the result is not an Object or if we run to the end of propertyPath
        for(let i=0; i<propertyPath.length && result instanceof Object; i++)
        {
            // Traversing the path
            result = result[propertyPath[i]];
        }
        
        return result;
    }
    
    static setInLayer(dataLayerObject, propertyPath, newValue)
    {
        if(propertyPath.length < 1)
        {
            return false;
        }
        
        let subObject = dataLayerObject;
        
        for(let i=0; i<propertyPath.length - 1; i++)
        {
            // if given path dosen't exist, create new object
            if(subObject[propertyPath[i]] === undefined || subObject[propertyPath[i]] === null)
            {
                subObject[propertyPath[i]] = {};
            }
            // If given path traverses a non-object, abort
            else if(!(subObject[propertyPath[i]] instanceof Object) || Array.isArray(subObject[propertyPath[i]]))
            {
                return false;
            }
            // Traversing the path
            subObject = subObject[propertyPath[i]];
        }
        
        subObject[propertyPath[propertyPath.length - 1]] = newValue;
        return true;
    }
    
    static getScopeLayerObject(dataObject, scope = "global", id = undefined)
    {
        let scopeObject = dataObject[scope];
        // global has no ID and you cannot take a porperty of undefined
        if(scope !== "global" && id !== undefined && scopeObject !== undefined)
        {
            // If given id is undefined, create one
            if(scopeObject[id] === undefined)
            {
                return undefined;
            }
            
            return scopeObject[id];
        }
        
        return scopeObject;
    }
    
    // Gets sorted by scopes
    static getGlobal(dataObject, propertyPath)
    {
        return this.getFromLayer(this.getScopeLayerObject(dataObject), propertyPath);
    }
    static getServer(dataObject, propertyPath, id)
    {
        return this.getFromLayer(this.getScopeLayerObject(dataObject, "server", id), propertyPath);
    }
    static getChannel(dataObject, propertyPath, id)
    {
        return this.getFromLayer(this.getScopeLayerObject(dataObject, "channel", id), propertyPath);
    }
    // Sets sorted by scopes
    static setGlobal(dataObject, propertyPath, newValue)
    {
        return this.setInLayer(this.getScopeLayerObject(dataObject), propertyPath, newValue);
    }
    static setServer(dataObject, propertyPath, newValue, id)
    {
        return this.setInLayer(this.getScopeLayerObject(dataObject, "server", id), propertyPath, newValue);
    }
    static setChannel(dataObject, propertyPath, newValue, id)
    {
        return this.setInLayer(this.getScopeLayerObject(dataObject, "channel", id), propertyPath, newValue);
    }
    
    // Get cascaded data property ( Channel > Server > Global )
    static getCascaded(dataObject, propertyPath, serverId, channelId)
    {
        let result = undefined;
        
        if(channelId)
        {
            result = this.getChannel(dataObject, propertyPath, channelId);
        }
        
        if(result === undefined && serverId)
        {
            result = this.getServer(dataObject, propertyPath, serverId);
        }
        
        if(result === undefined)
        {
            result = this.getGlobal(dataObject, propertyPath);
        }
        
        return result;
    }
    
    // Get an data object with valid fields and default values insted of undefines
    static getValidatedDataObject(dataObject, defaultScopeDataLayer)
    {
        let validatedDataObject = {};
        
        // Data must be an object
        if(!(dataObject instanceof Object))
        {
            dataObject = {};
        }
        
        // Data mus have 'global' property with type Object
        if(!(dataObject.global instanceof Object))
        {
            dataObject.global = {};
        }
        // Merging data with default values
        validatedDataObject.global = Object.assign({}, defaultScopeDataLayer, dataObject.global);
        
        // Data must have 'server' and 'channel' fields
        for(let scope of ["server", "channel"])
        {
            // They must be Objects with keys
            if(!(dataObject[scope] instanceof Object))
            {
                dataObject[scope] = {};
            }
            validatedDataObject[scope] = dataObject[scope];
            
            for(let key in dataObject[scope])
            {
                // And they also must be objects
                if(!(dataObject[scope][key] instanceof Object))
                {
                    validatedDataObject[scope][key] = {};
                }
            }
        }
        
        // Return the prepered object with merged and validated data
        return validatedDataObject;
    }
}

// Interval id for autosaving
var autosaveInterval;

// Information, if stored dataObject was updated since last save
var dataIsNotUpToDate = true;

// Main data object and it's path
var dataObject = {};
var filePath = "DATA.json";

class DataManager
{
    static save()
    {
        if(dataIsNotUpToDate)
        {
            return DataManager_impl.saveSync(dataObject, filePath).then(()=>{
                dataIsNotUpToDate = false;
            });
        }
        return Promise.resolve();
    }
    
    static load()
    {
        return DataManager_impl.loadSync(dataObject, filePath);
    }
    
    static enableAutosave(ms, errorCallback)
    {
        if(autosaveInterval)
        {
            clearInterval(autosaveInterval);
        }
        autosaveInterval = setInterval(function(){
            DataManager.save().catch(errorCallback)
        }, ms);
    }
    
    static disableAutosave()
    {
        if(autosaveInterval)
        {
            clearInterval(autosaveInterval);
        }
    }
    
    static validate()
    {
        dataObject = DataManager_impl.getValidatedDataObject(dataObject, defaultScopeDataLayer);
    }
    
    static get(propertyPath, serverId, channelId)
    {
        // If a string instead of Array is passed, change it to a single element Array
        if(typeof propertyPath === "string")
        {
            propertyPath = [propertyPath];
        }
        return DataManager_impl.getCascaded(dataObject, propertyPath, serverId, channelId);
    }
    
    static getByMessage(propertyPath, message)
    {
        return DataManager.get(propertyPath, message.getGuildId(), message.getChannelId())
    }
    
    static setInScope(propertyPath, newValue, scope, id)
    {
        switch(scope)
        {
            case "server":{
                return DataManager.setServer(id, propertyPath, newValue);
            }
            case "channel":{
                return DataManager.setChannel(id, propertyPath, newValue);
            }
            case "global":{
                return DataManager.setGlobal(propertyPath, newValue);
            }
            default:{
                throw new Error("Invalid scope while setting new data");
            }
        }
    }
    
    static setGlobal(propertyPath, newValue)
    {
        let result = DataManager_impl.setGlobal(dataObject, propertyPath, newValue);
        if(result)
        {
           dataIsNotUpToDate = true; 
        }
        return result;
    }
    static setServer(serverId, propertyPath, newValue)
    {
        let result = DataManager_impl.setServer(dataObject, propertyPath, newValue, serverId);
        if(result)
        {
           dataIsNotUpToDate = true; 
        }
        return result;
    }
    static setChannel(channelId, propertyPath, newValue)
    {
        let result = DataManager_impl.setChannel(dataObject, propertyPath, newValue, channelId);
        if(result)
        {
           dataIsNotUpToDate = true; 
        }
        return result;
    }
}

DataManager._impl = DataManager_impl;



module.exports = DataManager;