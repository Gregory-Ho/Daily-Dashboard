(function(){
	var clock;
	var date;
	var dayEncoding = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var monthEncoding = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "November", "December"];
	
	var $top1;
	var $bottom1;
	var $transform1;
	
	var TOP_COLOR_1 = "#b2b200";
	var BOTTOM_COLOR_1 = "black";
	
	var newsData;
	var currentArticleIndex;
	var $newsFeed;
	var $newsItems = [];

	var geolocationData;
	var weatherData;
	var $location;
	var $quickDesc;
	var $temperature;
	var $currentWeatherLeft;
	var $currentWeatherRight;
	var $hourlyForecast;
	var $dailyForecast;
	
	// Please Don't Abuse.... 
	var DarkSkyKey = "";
	var NewsKey = "";
	
	$(function(){
		clock = document.getElementById("clock");
		date = document.getElementById("date");
		$top1 = $("#frame2");
		$bottom1 = $("#frame1");
		$transform1 = $top1.css("transform");
		updateClock();
		
		currentArticleIndex = 0;
		$newsFeed = $("#newsFeed");
		$newsItems[0] = $newsFeed.children().eq(0);
		$newsItems[1] = $newsFeed.children().eq(1);
		$newsItems[2] = $newsFeed.children().eq(2);
		$.getJSON('https://newsapi.org/v2/top-headlines?' +
			'country=ca&' +
			'apiKey=' + NewsKey,null, function(data){
				newsData = data;
				//console.log(newsData);
				initLoadNewsArticles();
				
				$(".closeButton").on("click", function(e) {
					var $newsItem = $(e.target).parent();
					$newsItem.hide();
					$newsItem.fadeIn(500, "swing", loadNewsArticle($newsItem));
				});
				var $clickable = $(".newsItem").children().not($(".closeButton"));
				$clickable.on("click", function(e) {
					$target = $(e.target).parent();
					var newTab = window.open($target.data("href"), "_blank");
				});
		});
		
		$location = $(".location");
		$quickDesc = $(".quickDesc");
		$temperature = $(".temperature");
		$currentWeatherLeft = $(".currentWeather.leftCol").children();
		$currentWeatherRight = $(".currentWeather.rightCol").children();
		$hourlyForecast = $(".hourlyForecast").children().children();
		$dailyForecast = $(".dailyForecast").children().children();
		$.getJSON("http://ip-api.com/json", null, function(data1){
			geolocationData = data1;
			//console.log(geolocationData);
			$.getJSON("https://cors.io/?https://api.darksky.net/forecast/" + DarkSkyKey + "/" + geolocationData.lat + "," + geolocationData.lon + "?&units=ca&exclude=minutely,flags",null, function (data2){
				weatherData = data2;
				//console.log(weatherData);
				loadWeather();
			});
		});
		
	});
	
	setInterval(update, 1000);
	
	$(".newsItem").on("mouseover",function(e){
		console.log(e.target);
		$(e.target).css("color", "blue");
	});
	
	function update(){
		updateClock();
	}
	
	function updateClock(){
		var time = new Date();
		var timeString = time.toLocaleTimeString();
		clock.innerText = timeString.slice(0, timeString.lastIndexOf(":"));
		date.innerText = dayEncoding[time.getDay()] + ", " + monthEncoding[time.getMonth()] + " " + time.getDate();
		setProgressRotation(time.getSeconds() * 6, $bottom1, $top1, TOP_COLOR_1, BOTTOM_COLOR_1);
	}
	
	function loadWeather(){
		
		$location.text(geolocationData.city + ", " + geolocationData.region);
		
		$quickDesc.text(Math.round(weatherData.currently.temperature) + "\u00B0" + "C \u2022 " + weatherData.currently.summary);
		//$temperature.text(Math.round(weatherData.currently.temperature) + "\u00B0");
		
		$currentWeatherLeft.eq(0).text("Feels Like: " + Math.round(weatherData.currently.apparentTemperature) + "\u00B0");
		$currentWeatherLeft.eq(1).text("Wind: " + Math.round(weatherData.currently.windSpeed) + " km/h");
		var sunrise = new Date(weatherData.daily.data[0].sunriseTime * 1000);
		$currentWeatherLeft.eq(2).text("Sunrise: " + sunrise.toLocaleTimeString().substring(0, sunrise.toLocaleTimeString().lastIndexOf(":")) + sunrise.toLocaleTimeString().substring(sunrise.toLocaleTimeString().lastIndexOf(":") + 3));
	
		$currentWeatherRight.eq(0).text("Precipitation: " + Math.round(weatherData.currently.precipProbability * 100) + "%");
		$currentWeatherRight.eq(1).text("Humidty: " + Math.round(weatherData.currently.humidity * 100) + "%");
		var sunset = new Date(weatherData.daily.data[0].sunsetTime * 1000);
		$currentWeatherRight.eq(2).text("Sunset: " + sunset.toLocaleTimeString().substring(0, sunset.toLocaleTimeString().lastIndexOf(":")) + sunset.toLocaleTimeString().substring(sunset.toLocaleTimeString().lastIndexOf(":") + 3));
		
		for (var i = 0; i < 12; i++){
			for (var x = 0; x < 4; x++){
				var $td = $hourlyForecast.eq(x).children().eq(i);
				var hour = (new Date(weatherData.hourly.data[i].time * 1000)).toLocaleTimeString();
				switch (x){
					case 0: 
						$td.text(hour.substring(0, hour.indexOf(":")) + hour.substring(hour.lastIndexOf(":") + 4));
						break;
					case 1:
						$td.text(weatherData.hourly.data[i].summary);
						break;
					case 2:
						$td.text(Math.round(weatherData.hourly.data[i].temperature) + "\u00B0");
						break;
					default:
						$td.text(Math.round(weatherData.hourly.data[i].precipProbability * 100) + "%");
						break;
				}	
			}
		}
		
		for (var i = 0; i < 8; i++){
			for (var x = 0; x < 5; x++){
				var $td = $dailyForecast.eq(x).children().eq(i);
				var day = (new Date(weatherData.daily.data[i].time * 1000)).toDateString();
				switch (x){
					case 0: 
						$td.text(day.substring(0, 4));
						break;
					case 1:
						//$td.text(weatherData.daily.data[i].icon);
						break;
					case 2:
						$td.text(Math.round(weatherData.daily.data[i].temperatureHigh) + "\u00B0");
						break;
					case 3:
						$td.text(Math.round(weatherData.daily.data[i].temperatureLow) + "\u00B0");
						break;	
					default:
						$td.text(Math.round(weatherData.daily.data[i].precipProbability * 100) + "%");
						break;
				}	
			}
		}
		
		if (weatherData == null){
			$location.text("Try Disable Your Ad-Blocker!");
		}
		
	}
	
	function initLoadNewsArticles(){
		for (var i = 0; i < 3 ; i++){
			loadNewsArticle($newsItems[i]);
		}
	}
	
	function loadNewsArticle($item){
		$item.children("h2.headline").text(newsData.articles[currentArticleIndex].title);
		$item.children("p.articleDesc").text(newsData.articles[currentArticleIndex].description == null ? "" : newsData.articles[currentArticleIndex].description);
		$item.children("span.articleInfo").text(newsData.articles[currentArticleIndex].source.name
			+ " \u2022 " + timeDifference(new Date(newsData.articles[currentArticleIndex].publishedAt)));
		$item.data("href", newsData.articles[currentArticleIndex].url);
		currentArticleIndex++;
	}
	
	function timeDifference(time){ // time is a date object to compare to
		var now = new Date();
		var difference = (now - time);
		if (difference <= 15 * 60 * 1000){
			return "now";
		}
		else if (difference  < 30 * 60 * 1000){
			return "15 mins ago";
		}
		else if (difference  < 60 * 60 * 1000){
			return "30 mins ago";
		}
		else if (difference  < 24 * 60 * 60 * 1000){
			if (Math.floor(difference / (60 * 60 * 1000) == 1)){
				return "1 hour ago";
			}
			return (Math.floor(difference / (60 * 60 * 1000)) + " hours ago");
		}
		return "error";
	}
	
	function setProgressRotation(angle, bottomBar, topBar, TOP_COLOR, BOTTOM_COLOR){
		angle = angle % 360;
		var rotation = angle + 45;
		if (angle >= 0 && angle < 90){
			bottomBar.css("border-color", TOP_COLOR + " " + BOTTOM_COLOR + " " + BOTTOM_COLOR + " " + BOTTOM_COLOR);
			topBar.css("border-color", BOTTOM_COLOR + " " +  BOTTOM_COLOR + " " + BOTTOM_COLOR + " transparent");
		}
		else if (angle >= 90 && angle < 180){
			bottomBar.css("border-color", TOP_COLOR + " " + TOP_COLOR + " " + BOTTOM_COLOR + " " + BOTTOM_COLOR);
			topBar.css("border-color", BOTTOM_COLOR + " " +  BOTTOM_COLOR + " transparent transparent");
		}
		else if (angle >= 180 && angle < 270){
			bottomBar.css("border-color", TOP_COLOR + " " + TOP_COLOR + " " + TOP_COLOR + " " + BOTTOM_COLOR);
			topBar.css("border-color", BOTTOM_COLOR + " transparent transparent transparent");
		}
		else if (angle >= 270 && angle < 360){
			bottomBar.css("border-color", TOP_COLOR + " " + TOP_COLOR + " " + TOP_COLOR + " " + BOTTOM_COLOR);
			topBar.css("border-color", "transparent transparent transparent " + TOP_COLOR);
		}
		bottomBar.css("transform", $transform1 + " rotate(45deg)");
		topBar.css("transform", $transform1 + " rotate(" + rotation + "deg)");
	}

})();