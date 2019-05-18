class Prototype
{
    constructor(argumentTemplates, description)
    {
        this.argumentTemplates = argumentTemplates;
        this.description = description;
    }
    
    matchWithArgumentLIst(argumentList)
    {
        // TODO
    }
};

Prototype.ArgumentTemplate = class {
    
    constructor(templateElementsSections, description)
    {
        this.templateElementsSections = templateElementsSections;
        this.description = description;
    }
    
    parseArgumentsValues(argumentList)
    {
        let parsedArguments = {};
        let templateElementsSectionIndex = 0;
        let templateElementIndex = 0;
        for(let argument of argumentList)
        {
            while(templateElementIndex >= this.templateElementsSections[templateElementsSectionIndex].length)
            {
                if(++templateElementsSectionIndex >= this.templateElementsSections.length)
                {
                    return null;
                }
                templateElementIndex = 0;
            }
            
            let templateElement = this.templateElementsSections[templateElementsSectionIndex][templateElementIndex];
            if(templateElement.match(argument))
            {
                parsedArguments[templateElement.name] = templateElement.getValue(argument);
            }
        }
        return parsedArguments;
    }
    
    getSignatureFormated()
    {
        let result = "";
        let depthOfOptionality = 0;
        for(let templateElements of this.templateElementsSections)
        {
            if(depthOfOptionality)
            {
                if(result)
                {
                    result += " ";
                }
                result += "[ ";
            }
            result += templateElements.map(x => x.getSignatureFormated()).join(" ");
            depthOfOptionality++;
        }
        while(--depthOfOptionality > 0)
        {
            result += " ]";
        }
        return result;
    }
}

Prototype.ArgumentTemplate.Element = class {
    constructor(name, description)
    {
        this.name = name;
        this.description = description;
    }
    
    match(argument)
    {
        return true;
    }
    
    getValue(argument)
    {
        return argument;
    }
    
    getSignatureFormated()
    {
        return `<${this.name}>`;
    }
}

/// Predefined elements

Prototype.ArgumentTemplate.Element.Enum = class extends Prototype.ArgumentTemplate.Element{
    constructor(name, possibleValues, description)
    {
        super(name, description);
        this.possibleValues = possibleValues;
    }

    match(argument)
    {
        return this.possibleValues.includes(argument);
    }
    
    getSignatureFormated()
    {
        if(this.possibleValues.length == 1)
        {
            return ""+(this.possibleValues[0]);
        }
        return `(${this.possibleValues.join(" | ")})`;
    }
}

Prototype.ArgumentTemplate.Element.Number = class extends Prototype.ArgumentTemplate.Element{
    match(argument)
    {
        return !isNaN(+argument);
    }
    
    getValue(argument)
    {
        return +argument;
    }
}

Prototype.ArgumentTemplate.Element.Integer = class extends Prototype.ArgumentTemplate.Element.Number{
    match(argument)
    {
        return /^\d+$/.test(argument);
    }
}

Prototype.ArgumentTemplate.Element.String = Prototype.ArgumentTemplate.Element;

module.exports = Prototype;