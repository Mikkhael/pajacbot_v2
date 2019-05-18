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
    
    
    
  
    describe("Should correctly show command signatures", () => {
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
                        new commands.Prototype.ArgumentTemplate.Element.String("tak")
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
                        new commands.Prototype.ArgumentTemplate.Element.Integer("tak")
                    ]
                ]
            ),
        ];
        
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
    
});