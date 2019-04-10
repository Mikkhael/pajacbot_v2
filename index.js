const express   = require("express");
const http      = require("http");
const fs      	= require("fs");
const app       = express();

const bot       = require("./bot.js");

const PORT      = process.env.PORT || 3000;


app.get('/', function(request, responce){
    responce.send("OK");
    responce.end();
});

app.listen(PORT, function(){
    bot.logger.info("Listening on port " + PORT);
	
	if(!process.env.TOKEN)
	{
        bot.logger.info("No login token defined...");
        return;
    }
    
	bot.login();
});