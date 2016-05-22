var working = true;
var speed = 1000;

function pop() {
    window.confirm("Timer is paused, press OK or CANCEL to resume");
}

function breaks(total) {
    var min = 100000;
    for (i = 7; i < 50; i += 4) {
        if (Math.abs(total / i - 17 * 60) < min) {
            min = total / i - 17 * 60;
            var optim = i;
        }
    }
    var numBreaks = Math.round((total / (min + 17 * 60) - 7) / 4 + 1);
    var breakTime = Math.round(total / optim);
    var workTime = breakTime * 3;
    return [numBreaks * 2 + 1, workTime, breakTime];
}

function currentTime() {
    var now = new Date();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
}

currentTime();

function countDown(total, clock) {
    var final = total;
    document.getElementById(clock).innerHTML = secondsToClock(total);
    total--;
    $("body").css("background-color", "#00e676");
    var counter = setInterval(function() {
        document.getElementById(clock).innerHTML = secondsToClock(total);
        if (total != 0) {
            total--;
        } else if (total <= 1) {
			document.getElementById("message").innerHTML = "All done!";
            clearInterval(counter);
        }
        if (working == true) {

            x = cycles[1];
            working = false;
        } else {

            x = cycles[2];
            working = true;
        }
    }, speed);
}

function secondsToClock(time) {
    var hours = (time - time % 3600) / 3600;
    var temp = time % 3600;
    var minutes = (temp - temp % 60) / 60;
    var seconds = temp % 60;

    var s = "";

    if (hours != 0) {
        s += hours.toString() + ":";
    }
    if (minutes != 0) {
        if (minutes < 10) {
			if(hours != 0){
				s += "0" + minutes.toString() + ":";
			} else {
				s += minutes.toString() + ":";
			}
        } else {
            s += minutes.toString() + ":";
        }
    } else if (hours != 0 && minutes == 0) {
        s += "00:"
    }
    if (seconds < 10) {
		if(hours != 0 || minutes != 0){
			s += "0" + seconds.toString();
		} else {
			s += seconds.toString();
		}
    } else {
        s += seconds.toString();
    }
    return s;
}

function analysis(hour, min) {
	s = ""
	
	s += "For the requested time of ";
	
	if(hour > 2){
		s += hour;
		s += " hours";
	} else if(hour == 1){
		s += "1 hour";
	}
	
	if(min != 0){
		if(hour != 0){
			s += " and ";
		}
		if(min != 1){
			s += min;
			s += " minutes";
		} else {
			s += min;
			s += " minute";
		}
	}
	
	s += ", you should have ";
	
	s += (cycles[0]-1)/2 + 1;
	s += " work sessions of ";
	s += secondsToClock(cycles[1]);
	s += " each and ";
	
	s += (cycles[0]-1)/2;
	if((cycles[0]-1)/2 == 1){
		s += " break session of ";
	} else {
		s += " break sessions of ";
	}
	
	s += secondsToClock(cycles[2]);
	s += " in between.";
	
	return s
}

function mainFunction() {
    $("#submit").click(function() {
        var hour = $("#hour").val();
        var min = $("#min").val();
        var count = hour * 3600 + min * 60;
        cycles = breaks(count);
		document.getElementById("analysis").innerHTML = analysis(hour, min);
		document.getElementById("message").innerHTML = "Time for work!";
        countDown(cycles[1], "clock");
        var delay = 0;
		var interval;
		for(i = 1; i < cycles[0]; i++){
			if(i % 2 == 0){
				delay += cycles[2] * speed + 1;
				interval = setTimeout(
				function(){
					countDown(cycles[1], "clock"); 
					$("body").css("background-color", "#00E676");
					document.getElementById("message").innerHTML = "Time for work!";
					$("#message").fadeIn();
				}, delay);
			} else {
				delay += cycles[1] * speed + 1;
				interval = setTimeout(
				function(){
					countDown(cycles[2], "clock"); 
					$("body").css("background-color", "#f44336");
					document.getElementById("message").innerHTML = "Take a break...";
				}, delay);
			}
		}
        $("#menu").css("display", "none");
    });
}
