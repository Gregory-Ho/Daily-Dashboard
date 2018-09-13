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
	
	$(function(){
		clock = document.getElementById("clock");
		date = document.getElementById("date");
		$top1 = $("#frame2");
		$bottom1 = $("#frame1");
		$transform1 = $top1.css("transform");
		updateClock(clock);
	});
	
	function updateClock(clockDiv){
		var time = new Date();
		var timeString = time.toLocaleTimeString();
		clock.innerText = timeString.slice(0, timeString.lastIndexOf(":"));
		date.innerText = dayEncoding[time.getDay()] + ", " + monthEncoding[time.getMonth()] + " " + time.getDate();
		setProgressRotation(time.getSeconds() * 6, $bottom1, $top1, TOP_COLOR_1, BOTTOM_COLOR_1);
	}
	
	setInterval(updateClock, 1000, clock);
	
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