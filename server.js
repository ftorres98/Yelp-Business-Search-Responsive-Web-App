const express = require('express');
const app = express();
const axios = require('axios');

/*const cors = require('cors');
const { json } = require('express');
app.use(cors({
  origin: 'http://localhost:4200'
}));*/

const YELP_KEY = 'KEY GOES HERE';

const GOOGLE_KEY = 'KEY GOES HERE';

const header = {'Authorization': 'Bearer ' + YELP_KEY};

const config = {headers: header};

app.use(express.static(process.cwd()+"/dist/hw8-angular"));

app.get('/', (req, res) => {
    res.sendFile(process.cwd()+"/dist/hw8-angular/index.html");
});

app.get('/search', (req, res) => {
    res.sendFile(process.cwd()+"/dist/hw8-angular/index.html");
});

app.get('/searchTerm', (req, res) => {
    var params = req.query;
    console.log(params);
    var keyWord = params.term;
    var lat = params.latitude;
    var lng = params.longitude;
    var cat = params.categories;
    var rad = params.radius;

    axios.get('https://api.yelp.com/v3/businesses/search?term='+keyWord+'&latitude='+lat+'&longitude='+lng+'&categories='+cat+'&radius='+rad, config).then(function(response){
        console.log(response.data);
        res.send(response.data.businesses);
    }).catch(function(err){
        console.log(err.error);
    });
});

app.get('/autocomplete', (req, res) => {
    var params = req.query;
    console.log(params);

    axios.get('https://api.yelp.com/v3/autocomplete?text='+params.text, config).then(function(response){
        console.log(response.data);
        var sol =[];
        if(response == undefined || response == null){
            res.send(JSON.stringify(sol));
        }else{
            var data = response.data;
            var terms = data.terms;
            var cat = data.categories;

            for(let i = 0; i<terms.length; i++){
                sol.push(terms[i].text);
            }
            for(let i = 0; i<cat.length; i++){
                sol.push(cat[i].title);
            }

            res.send(JSON.stringify(sol));
        }
    }).catch(function(err){
        console.log(err.error);
    });
});

app.get('/businessDetails', (req, res) => {
    var params = req.query;
    console.log(params);

    axios.get('https://api.yelp.com/v3/businesses/'+params.ID, config).then(function(response){
        console.log(response.data);
        res.send(response.data);
    }).catch(function(err){
        console.log(err.error);
    });
});

app.get('/getReviews', (req, res) => {
    var params = req.query;
    console.log(params);

    axios.get('https://api.yelp.com/v3/businesses/'+params.ID+'/reviews', config).then(function(response){
        console.log(response.data);
        res.send(response.data.reviews);
    }).catch(function(err){
        console.log(err.error);
    });
});

app.get('/getLocation', (req, res) => {
    var params = req.query;
    console.log(params);

    axios.get('https://maps.googleapis.com/maps/api/geocode/json?address='+params.location+'&key='+GOOGLE_KEY).then(function(response){
        console.log(response.data);
        if(response.data.status == "ZERO_RESULTS"){
            res.send(JSON.stringify([]));
        }else{
            res.send(response.data.results[0].geometry.location);
        }
    }).catch(function(err){
        console.log(err.error);
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

