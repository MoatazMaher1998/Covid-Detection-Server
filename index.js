const performance = require('perf_hooks');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var multiparty = require('multiparty');
const port = process.env.PORT || 8080;
//_________________________________//
const AWS = require('aws-sdk')
const fs = require('fs')
const ACCESS_KEY_ID = "AKIAXNLLRY7K57RVYJ7D"
const SECRET_ACCESS_KEY = process.env.AWS_Secret
const BUCKET_NAME = "alexunicovidapi"
app.get('/*',function(req,res){
    res.send("Welcome To Our Covid API Post Your Data Please");
});

app.post('/API',function(req,res){
    var start = new Date().getTime();
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if(files['img'] == null){console.log("wrong Input"); return;}
        console.log(files['img'][0].path);
        var spawn = require("child_process").spawn; 
        var process = spawn('python',["./CovidModel.py",files['img'][0].path] );
                             process.stdout.on('data', async function(data) { 
                                console.log(data.toString());
                                const value = await data.toString();
                                try {
                                res.status(200);
                                res.send(value);
                                } catch (error) {
                                    res.status(500);
                                    res.send("Server Error");
                                }
                                
                                var end = new Date().getTime();
                                var time = (end - start) / 1000;
                                console.log(time + "  Seconds");
                                process.kill();
                              });
    });
});
app.listen(port,function(){
    console.log("Server started on port : "+ port);
  });
