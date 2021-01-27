const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);
const path = require("path");
const Mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");
const BodyParser = require("body-parser");


app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

Mongoose.connect("mongodb://localhost:27017/weatherapplogin", { useNewUrlParser: true });

//Test to see that MongoDB is connected
const db = Mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected to MongoDB")
});

//Create a Model/Schema for a new user entry into database
const UserModel = Mongoose.model("user", {
    username: String,
    password: String
});


//Database responses to HTTP requests from the browser

//Homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/client/register.html');
})

//Login Page
app.get('/client/login.html', (req, res) => {
    res.sendFile(__dirname + '/client/login.html');
})

//Registration Page
app.get('/client/register.html', (req, res) => {
    res.sendFile(__dirname + '/client/register.html');
})


//Storing of login credentials in database after submission of registration form
app.post("/register", async (request, response) => {
    var user = await UserModel.findOne({ "username": request.body.username }).exec();
    if (!user) {
        if (request.body.password === request.body.password2) {
            try {
                request.body.password = Bcrypt.hashSync(request.body.password, 12);
                var user = new UserModel(request.body);
                var result = await user.save();
                response.redirect('login.html');
            }

            catch (error) {
                response.status(500).send(error);
            }
        }
        else {
            //Error page when re-entered password doesn't match original password
            response.redirect('index.html');
        }
    } else {
        //Error page when username already exists
        response.redirect('index.html');
    }

});

//Response to the submission of login credentials by user
app.post("/login", async (request, response) => {
    try {
        var user = await UserModel.findOne({ "username": request.body.username }).exec();
        if (!user) {
            //Error Page: User doesn't exist
            response.redirect('index.html');
        }

        if (!Bcrypt.compareSync(request.body.password, user.password)) {
            //Error Page: password is wrong
            response.redirect('index.html');
        }

        //Redirect to weather forecast page when login is correct
        response.redirect('weather.html');
    }

    catch (error) {
        response.status(500).send(error);
    }
});


//ONLY FOR DEVELOPMENT PURPOSES. DO NOT PUBLISH: Link to view users in database
app.get("/dump", async (request, response) => {
    try {
        var result = await UserModel.find().exec();
        response.send(result);
    }

    catch (error) {
        response.status(500).send(error);
    }
})

//Declaration of static files (CSS) to use
app.use(express.static(path.resolve(__dirname, "client")));



//Weather forecast page
app.get("/weather", (req, res) => {
    const address = req.query.address;
    if (!address) {
        return res.send({
            error: "You must enter a city",
        });
    }
    //API-call
    //Expected callback: city, country, all forecastdata and data from day 1,2,3,4 & 5
    weatherData(address, (error, { cityName, countryName, allData, day1, day2, day3, day4, day5 } = {}) => {

        if (error) {
            return res.send({
                error,
            });

        }
        res.send({
            cityName,
            countryName,
            allData,
            day1,
            day2,
            day3,
            day4,
            day5,
        });
    }
    );
});

server.listen(
    process.env.PORT || 3000,
    function () {
        var addr = server.address();
        console.log(
            "All ready! Server listening at port:" + addr.port
        );
    }
);

//------------------------API------------------------
const request = require("request");
const { response } = require("express");
//The API base URL + our personal key
const constants = {
    openWeatherMap: {
        BASE_URL: "http://api.openweathermap.org/data/2.5/forecast?q=",
        SECRET_KEY: "3709f89e826c2838310e77a773533f2d",
    },
};

//API-call with users input (address)
const weatherData = (address, callback) => {
    const url =
        constants.openWeatherMap.BASE_URL +
        encodeURIComponent(address) +
        "&appid=" +
        constants.openWeatherMap.SECRET_KEY;
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback("Can't fetch data from open weather map api ", undefined);
        } else if (body.city == undefined
        ) {
            callback("Unable to find city, try another location", undefined);
        } else {
            callback(undefined, {
                cityName: body.city.name,
                countryName: body.city.country,
                allData: body.list,
                day1: body.list[0],
                day2: body.list[8],
                day3: body.list[16],
                day4: body.list[24],
                day5: body.list[32],
            });
        }
    });
};




