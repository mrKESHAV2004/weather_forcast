const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/signup.html');
});

app.post('/', function(req, res) {
    const { first_name, last_name, email } = req.body;
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: first_name,
                LNAME: last_name
            }
        }]
    };
    const jsonData = JSON.stringify(data);
    const url = 'https://us17.api.mailchimp.com/3.0/lists/cd1aa5258f';
    const options = {
        method: "POST",
        auth: "keshav:dff6c8f8a089d4c2f1e867ede82a3d15-us17"
    };
    const request = https.request(url, options, function(response) {
        let responseData = '';
        response.on("data", function(chunk) {
            responseData += chunk;
        });
        response.on("end", function() {
            const result = JSON.parse(responseData);
            console.log(result);
            res.sendFile(__dirname + "/success.html");
        });
    });

    request.on("error", function(error) {
        console.error(error);
        res.status(500).sendFile(__dirname + "/failure.html");
    });

    //request.write(jsonData);
    request.end();
});
app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
    console.log('Server is listening on port 3000');
});
