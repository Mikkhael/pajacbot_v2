module.exports = class Command
{
    constructor(name, prototypes, description = "")
    {
        this.name = name;
        this.prototypes = prototypes;
        this.description = description;
    }    
};
