const commands = require("../bot/commands");

const assert = require("chai").assert;



describe("Commands test", ()=>{
   
    describe("Should correctly parse arguments", ()=>{
        
        const assertions = [
            ["a b c d", ["a", "b", "c", "d"]],
            ["a", ["a"]],
            ["a   ", ["a"]],
            ["   a", ["a"]],
            ["  a  ", ["a"]],
            ["      a b  c d   ", ["a", "b", "c", "d"]],
            ["   a b c d", ["a", "b", "c", "d"]],
            ["a b c d    ", ["a", "b", "c", "d"]],
            ["\"a\"", ["a"]],
            ["\"a  \"", ["a  "]],
            ["\"  a  \"", ["  a  "]],
            ["\"  a\"  ", ["  a"]],
            ["\"a\"  ", ["a"]],
            ["\"a  \"  ", ["a  "]],
            ["     \"  a  \"  ", ["  a  "]],
            [" \"  a\"  ", ["  a"]],
            [" \"\" \"  a\"  ", ["", "  a"]],
            ["a \"b\" c d", ["a", "b", "c", "d"]],
            ["a \"b c  \" d", ["a", "b c  ", "d"]],
            ["a \"b c  \" \"d\"", ["a", "b c  ", "d"]],
            ['\'a\'', ['a']],
            ['\'a  \'', ['a  ']],
            ['\'  a  \'', ['  a  ']],
            ['\'  a\'  ', ['  a']],
            ['\'a\'  ', ['a']],
            ['\'a  \'  ', ['a  ']],
            ['     \'  a  \'  ', ['  a  ']],
            [' \'  a\'  ', ['  a']],
            [' \'\' \'  a\'  ', ['', '  a']],
            ['a \'b\' c d', ['a', 'b', 'c', 'd']],
            ['a \'b c  \' d', ['a', 'b c  ', 'd']],
            ['a \'b c  \' \"d\"', ["a", "b c  ", "d"]],
            ['a \'b c "asd" \' \"d\"', ["a", "b c \"asd\" ", "d"]],
            ["a \"b c 'asd' \" \'d\'", ["a", "b c 'asd' ", "d"]],
            ["\"\\\"\"", ["\""]],
            ["\"\\\'\"", ["\'"]],
            ['\"\\\"\"', ["\""]],
            ['\"\\\'\"', ["\'"]],
            ['a \'b c "asd" \\\' \' \"d\"', ["a", "b c \"asd\" \' ", "d"]],
            ["a \"b c 'asd' \\\" \" \'d\'", ["a", "b c 'asd' \" ", "d"]],
            ['a \'b c "asd" \\\' \\\\  \' \"d\"', ["a", "b c \"asd\" \' \\  ", "d"]],
            ["a \"b c 'asd' \\\" \\\\  \" \'d\'", ["a", "b c 'asd' \" \\  ", "d"]],
            ['a \'b c "asd" \\\' \\\\\' \"d\"', ["a", "b c \"asd\" \' \\", "d"]],
            ["a \"b c 'asd' \\\" \\\\\" \'d\'", ["a", "b c 'asd' \" \\", "d"]],
            ["", []],
            ["  ", []],
            [undefined, []]
        ];
        
        assertions.forEach(([query, expectedArgs]) => {
             
            it(`Should parse:(${query}) as [${expectedArgs}]`, ()=>{
                
                let args = commands.parseArguments(query);
                assert.deepEqual(args, expectedArgs);
                
            });
            
        });
        
    });
    
    describe("Should correctly parse query", () => {
        
        const assertions = [
            ["cm a b c", new commands.Query("cm", ["a", "b", "c"])],
            ["a \"b c 'asd' \\\" \\\\\" \'d\'", new commands.Query("a", ["b c 'asd' \" \\", "d"])],
            ["", new commands.Query()],
            ["   ", new commands.Query()],
            [" asd ", new commands.Query("asd")],
            ["asd    ", new commands.Query("asd")],
            ["asd", new commands.Query("asd")],
            ["  asd", new commands.Query("asd")],
            [undefined, new commands.Query()]
        ];
        
        assertions.forEach(([input, expected]) => {
             
            it(`Should parse:(${input}) as ${expected.commandName} with args: [${expected.argumentsList}]`, ()=>{
                
                let query = commands.parseQuery(input);
                assert.deepEqual(query, expected);
                
            });
            
        });
    });
    
    const argumentTemplatesList = [
        new commands.Prototype.ArgumentTemplate(
            [[]]
        ),
        new commands.Prototype.ArgumentTemplate(
            [
                [
                    new commands.Prototype.ArgumentTemplate.Element.Enum("abcEnum", ["a", "b", "c"]),
                    new commands.Prototype.ArgumentTemplate.Element.Number("amount")
                ]
            ]
        ),
        new commands.Prototype.ArgumentTemplate(
            [
                [
                    new commands.Prototype.ArgumentTemplate.Element.Enum("abcEnum", ["a", "b", "c"]),
                    new commands.Prototype.ArgumentTemplate.Element.Number("amount")
                ],
                [
                    new commands.Prototype.ArgumentTemplate.Element.Enum("abcEnum2", ["c"]),
                    new commands.Prototype.ArgumentTemplate.Element.Number("amount2"),
                    new commands.Prototype.ArgumentTemplate.Element.String("str")
                ],
                [
                    new commands.Prototype.ArgumentTemplate.Element.String("str2")
                ]
            ]
        ),
        new commands.Prototype.ArgumentTemplate(
            [
                [],
                [
                    new commands.Prototype.ArgumentTemplate.Element.Integer("tak")
                ]
            ]
        ),
        new commands.Prototype.ArgumentTemplate(
            [
                [],
                [
                    new commands.Prototype.ArgumentTemplate.Element.Number("tak")
                ]
            ]
        ),
        new commands.Prototype.ArgumentTemplate(
            [
                [],
                [
                    new commands.Prototype.ArgumentTemplate.Element.String("tak")
                ]
            ]
        ),
    ];
    
    const testCommand = new commands.Command("tak", argumentTemplatesList.map((x, i) => new commands.Prototype(""+i, x)), function(){});
  
    describe("Should correctly show command signatures", () => {
        
        
        const expectedSignatures = [
            "",
            "(a | b | c) <amount>",
            "(a | b | c) <amount> [ c <amount2> <str> [ <str2> ] ]",
            "[ <tak> ]",
            "[ <tak> ]",
            "[ <tak> ]"
        ];
        
        expectedSignatures.forEach((expectedSignature, prototypeIndex) => {
             
            it(`Should retrive valid command signature for template nr "${prototypeIndex}"`, ()=>{
                
                let signature = argumentTemplatesList[prototypeIndex].getSignatureFormated();
                assert.typeOf(signature, "string");
                assert.equal(signature, expectedSignature);
                
            });
            
        });
        
    });
    
    describe("Should correctly parse arguments", () => {
        
        
        const assertions = [
            [[], "0", {}],
            [["tak"], "5", {tak: "tak"}],
            [["123"], "3", {tak: 123}],
            [["-123"], "3", {tak: -123}],
            [["0"], "3", {tak: 0}],
            [["-12.141"], "4", {tak: -12.141}],
            [["c"], "5", {tak: "c"}],
            [["c", "123"], "1", {abcEnum: "c", amount: 123}],
            [["c", "asd"]],
            [["d", "123"]],
            [["d"], "5", {tak: "d"}],
            [["c", "123", "x"]],
            [["c", "123", "c", "44", "45"], "2", {abcEnum: "c", amount: 123, amount2: 44, str: "45", abcEnum2: "c"}],
            [["a", "123", "c", "44", "45", "sssss"], "2", {abcEnum: "a", amount: 123, amount2: 44, str: "45", abcEnum2: "c", str2: "sssss"}],
            [["c", "123", "c", "44x2", "45", "sssss"]],
            [["c", "123", "a", "42", "45", "sssss"]],
            [["c", "123", "c", "42", "45", "sssss", "0"]],
        ];
        
        assertions.forEach(([argumentList, prototype, parsedArguments]) => {
             
            it(`Should parse [${JSON.stringify(argumentList)}] with prototype nr "${prototype}" as ${JSON.stringify(parsedArguments)}`, ()=>{
                
                let parsed = testCommand.getParsedArguments(argumentList);
                if(!prototype)
                {
                    assert.isNull(parsed);
                }
                else
                {
                    assert.equal(parsed.matchedPrototype, prototype, "Wrong prototype has been chosen");
                    assert.deepEqual(parsed.parsedArguments, parsedArguments, "Arguments were parsed incorrectly");
                }
                
            });
            
        });
        
    });
    
});