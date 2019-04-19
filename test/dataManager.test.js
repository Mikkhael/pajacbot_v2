var expect = require("chai").expect;

let dataManager = require("../bot/dataManager");


describe("Data manager implementation test", ()=>{
    
    const testObject1 = {
        global: {
            prop: "g",
            x: 100,
            ob: {
                a: 10,
                b: 20
            }
        },
        server: {
            "1": {
                prop: "s1",
                x: 200
            },
            "2": {
                prop: "s2",
                ob: {
                    a: 1,
                    b: 2
                }
            }
        },
        channel: {
            "1": {
                prop: "c1",
                x: 300
            },
            "11": {
                prop: "c11",
            },
            "2": {
                prop: "c2",
                ob: {
                    b: 15
                }
            }
        }
    }
    
    describe("Reading data form specified object on different scopes", ()=>{
        
        const assertions = [
            ["global", 0, "g"],
            ["global", 123, "g"],
            ["global", 1, "g"],
            ["global", 2, "g"],
            [undefined, 1, "g"],
            [undefined, undefined, "g"],
            ["global", undefined, "g"],
            ["server", undefined, undefined],
            ["server", 3, undefined],
            ["server", 0, undefined],
            ["server", 1, "s1"],
            ["server", 2, "s2"],
            ["channel", undefined, undefined],
            ["channel", 3, undefined],
            ["channel", 0, undefined],
            ["channel", 1, "c1"],
            ["channel", 2, "c2"],
        ];
        
        assertions.forEach(([scope, id, result]) => {
            
            describe(`For scope "${scope}" with id "${id}"`, ()=>{
                
                it(`Should return valid data layer object`, ()=>{
                    
                    let value = dataManager._impl.getScopeLayerObject(testObject1, scope, id);
                    if(result !== undefined)
                    {
                        expect(value).to.have.property("prop", result);
                    }
                    else
                    {
                        expect(value, {});
                    }
                    
                });
                
            });
        });
        
        
    });
    
    describe("Reading correctly cascaded data", ()=>{
        
        
        const assertions = [
            [["prop"], undefined, undefined, "g"],
            [["prop"], 1, undefined, "s1"],
            [["prop"], 2, undefined, "s2"],
            [["prop"], 1, 1, "c1"],
            [["prop"], 2, 11, "c11"],
            [["prop"], undefined, 1, "c1"],
            [["prop"], undefined, 2, "c2"],
            [["x"], undefined, undefined, 100],
            [["x"], 1, undefined, 200],
            [["x"], 1, 1, 300],
            [["x"], 1, 11, 200],
            [["x"], 2, 2, 100],
            [["x"], undefined, 2, 100],
            [["x"], undefined, 1, 300],
            [["ob", "a"], 1, 1, 10],
            [["ob", "a"], undefined, 1, 10],
            [["ob", "a"], undefined, undefined, 10],
            [["ob", "a"], 2, undefined, 1],
            [["ob", "a"], 2, 2, 1],
            [["ob", "b"], 2, 2, 15],
            [["ob", "b"], 2, undefined, 2],
            [["ob", "b"], 1, 1, 20],
            [["ob", "c"], 1, 1, undefined],
            [["obsad", "adad"], 2, 2, undefined],
            [["x"], 100, 100, 100],
        ];
        
        assertions.forEach(([path, serverId, channelId, result]) => {
            
            describe(`For path "${path}" with serverId "${serverId}" and channelId "${channelId}"`, ()=>{
                
                it(`Should return ${result}`, ()=>{
                    
                    let value = dataManager._impl.getCascaded(testObject1, path, serverId, channelId);
                    expect(value, result);
                    
                });
                
            });
        });
        
        
        
    });
    
});