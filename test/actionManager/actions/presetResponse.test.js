var assert = require("chai").assert;

let presetResponse = require("../../../bot/actionManager/actions/presetResponse");

describe("Preset response api tests", ()=>{
    
    describe("Getting raw string", ()=>{
       
        const assertions = [
            ["asdf", "asdf"],
            ["a?s!!D...f2", "a?s!!d...f2"],
            ["abcd.......", "abcd"],
            ["aBCd.", "abcd"],
            ["...aBCd?!!?...?", "...abcd"],
            ["..aBCd?!!?...?X", "..abcd?!!?...?x"]
        ]
        
        assertions.forEach(([string, result]) => {
            it(`"${string}" should be converted to "${result}"`, ()=>{
                let raw = presetResponse.getRawString(string);
                assert.equal(raw, result);
            });
        });
    });
    
    
    describe("Formatting a simple message with a preset", ()=>{
        const preset1 = {
            response: "Tak"
        };
        const assertions1 = [
            ["ASDF", "TAK"],
            ["ASdF", "Tak"],
            ["Asdf", "Tak"],
            ["Asdf...", "...Tak"],
            ["asdf.???", "Tak"],
            ["asdf.", "Tak"],
            ["asdf..", "...Tak"],
            ["ASDF.??!?", "TAK"],
            ["ASDF.??!?.", "TAK"],
            ["ASDF..??!?", "...TAK"],
            ["ASDF..??!?.", "TAK"],
            ["ASDF.??!?..", "...TAK"],
            ["ASDF.", "TAK"],
            ["ASDF..", "...TAK"],
        ];
        
        assertions1.forEach(([string, result]) => {
            it(`"${string}" with preset 1 should be result with a simple response with value "${result}"`, ()=>{
                let response = presetResponse.getFormatedResponseForAPreset(string, preset1);
                assert.isObject(response);
                assert.equal(response.type, "simple");
                assert.equal(response.value, result);
            });
        });
    });
});

