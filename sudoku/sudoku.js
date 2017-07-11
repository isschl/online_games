/*======================================================================================================================
                                        Sudoku functionality implementation.
======================================================================================================================*/

/*===============================================  GLOBAL VARIABLES  =================================================*/
var container;
var backgroundColor = "grey";
var choices;
var timeContext;
var notesContext;
var notesCnv;
var timeW;
var timeH;
var notesW;
var notesH;
var prevX, prevY, currX, currY;
var setdt;
var cs = 1;
var seconds = 0;
var minutes = 0;
var pause = false;
var help = false;

var Sudoku;
var all = new Set([1,2,3,4,5,6,7,8,9]);


/*===================================================  GAME LOGIC  ===================================================*/
class Game {
    constructor(str) {
        var gameState = [];
        for(var i = 0; i < 3; i++) {
            gameState.push([]);
            for(var j = 0; j < 3; j++) {
                gameState[i].push([]);
                for (var k = 0; k < 3; k++) {
                    gameState[i][j].push([]);
                    for (var l = 0; l < 3; l++)
                        gameState[i][j][k].push(0);
                }
            }
        }
        this.state = gameState;
		// fill (sudokus are stored line by line)
		for(var i = 0; i < 81; i++)
			this.state[Math.floor(i/27)][Math.floor((i%9)/3)][Math.floor(i/9)%3][i%3] = Number(str.charAt(i));
	}

	get numbers() { return this.state; }  

    update(i,j,k,l,value) {
		this.state[i][j][k][l] = value;
    }

	/* manje linija, ali još čudnovatije
	for(var i = 0; i < 9; i++)
		this.state[Math.floor(row/3)][Math.floor(i/3)][row%3][i%3];
	*/
	numbersInRow(r) {
		var numbers = new Set();
		var num;
		num = this.state[Math.floor(r/3)][0][r%3][0]; if(num != 0) numbers.add(num);
		num = this.state[Math.floor(r/3)][0][r%3][1]; if(num != 0) numbers.add(num);
		num = this.state[Math.floor(r/3)][0][r%3][2]; if(num != 0) numbers.add(num);
		num = this.state[Math.floor(r/3)][1][r%3][0]; if(num != 0) numbers.add(num);
		num = this.state[Math.floor(r/3)][1][r%3][1]; if(num != 0) numbers.add(num);
		num = this.state[Math.floor(r/3)][1][r%3][2]; if(num != 0) numbers.add(num);
		num = this.state[Math.floor(r/3)][2][r%3][0]; if(num != 0) numbers.add(num);
		num = this.state[Math.floor(r/3)][2][r%3][1]; if(num != 0) numbers.add(num);
		num = this.state[Math.floor(r/3)][2][r%3][2]; if(num != 0) numbers.add(num);
		return numbers;
	}
	numbersInColumn(c) {
		var numbers = new Set();
		var num;
		num = this.state[0][Math.floor(c/3)][0][c%3]; if(num != 0) numbers.add(num);
		num = this.state[0][Math.floor(c/3)][1][c%3]; if(num != 0) numbers.add(num);
		num = this.state[0][Math.floor(c/3)][2][c%3]; if(num != 0) numbers.add(num);
		num = this.state[1][Math.floor(c/3)][0][c%3]; if(num != 0) numbers.add(num);
		num = this.state[1][Math.floor(c/3)][1][c%3]; if(num != 0) numbers.add(num);
		num = this.state[1][Math.floor(c/3)][2][c%3]; if(num != 0) numbers.add(num);
		num = this.state[2][Math.floor(c/3)][0][c%3]; if(num != 0) numbers.add(num);
		num = this.state[2][Math.floor(c/3)][1][c%3]; if(num != 0) numbers.add(num);
		num = this.state[2][Math.floor(c/3)][2][c%3]; if(num != 0) numbers.add(num);
		return numbers;
	}
	numbersInSquare(r,c) {
		var numbers = new Set();
		var num;
		num = this.state[r][c][0][0]; if(num != 0) numbers.add(num);
		num = this.state[r][c][0][1]; if(num != 0) numbers.add(num);
		num = this.state[r][c][0][2]; if(num != 0) numbers.add(num);
		num = this.state[r][c][1][0]; if(num != 0) numbers.add(num);
		num = this.state[r][c][1][1]; if(num != 0) numbers.add(num);
		num = this.state[r][c][1][2]; if(num != 0) numbers.add(num);
		num = this.state[r][c][2][0]; if(num != 0) numbers.add(num);
		num = this.state[r][c][2][1]; if(num != 0) numbers.add(num);
		num = this.state[r][c][2][2]; if(num != 0) numbers.add(num);
		return numbers;
	}
	
	RCS(R,C,r,c) {
		var ret = new Set();
		ret = ret.union(this.numbersInRow(3*R+r));
		ret = ret.union(this.numbersInColumn(3*C+c));
		ret = ret.union(this.numbersInSquare(R,C));
		return ret;
	}

	check() {
		var numbers = new Set();
		
		for(var i = 0; i < 9; i++) {
			numbers = this.numbersInRow(i);
			if(numbers.size != 9) { console.log("row " + i); return false; }
		}
		for(var i = 0; i < 9; i++) {
			numbers = this.numbersInColumn(i);
			if(numbers.size != 9) { console.log("row " + i); return false; }
		}
		for(var i = 0; i < 3; i++)
			for(var j = 0; j < 3; j++) {
				numbers = this.numbersInSquare(i,j);
				if(numbers.size != 9) { console.log("square " + i+j); return false; }		
			}
		return true;
	}
}

Set.prototype.union = function(setB) {
	var union = new Set(this);
	for(var el of setB)
		union.add(el);
	return union;
}
Set.prototype.difference = function(setB) {
	var difference = new Set(this);
	for(var el of setB)
		difference.delete(el);
	return difference;
}
/*==============================================  SCREEN INITIALIZERS  ===============================================*/
function drawUnfinished()
{
	// container color
	container.css("background-color", backgroundColor);

	// add overlay
	container.append("<div id='overlay'></div>");
	$("#overlay").css("top", "0px");
	
	// add try button	
	container.append("<button id='try' style='position:absolute;width:10%;height:10%;top:45%;left:45%'>Testiraj!</button>");
	$("#try").on("click", drawMenu);
}

function drawMenu()
{
	// stop time
	clearInterval(setdt);
	// reset time
	cs = 1; seconds = 0; minutes = 0;
    // clear container's current content
    container.empty();
	// container color
	container.css("background-color", backgroundColor);

    // append 4 menu buttons
    container.append("<div id='play' class='menuButtons' onclick='drawPlay()'>" + "IGRAJ</div>");
    container.append("<div id='highscores' class='menuButtons' onclick='drawHighscores()'>" + "TOP 5</div>");
}

function fillTable(str) 
{
	var squares = $(".clickable");
	// clear old numbers first if present
	squares.empty();

	var nums = Sudoku.numbers;
	var c = 0;
	for(var i = 0; i < 3; i++)
    	for(var j = 0; j < 3; j++)
  	      for (var k = 0; k < 3; k++)
     	     for (var l = 0; l < 3; l++) {
				if(nums[i][j][k][l] != 0) {
			 		squares.eq(c).html("<b>" + nums[i][j][k][l] + "</b>");
					squares.eq(c).css('background-color', 'yellow');
				} else {
					squares.eq(c).css('background-color', 'white');
				}
				c++;
			}
}

function getSudoku()
{
	// stop time
	clearInterval(setdt);
	// reset time
	cs = 1; seconds = 0; minutes = 0;
	// get sudoku string	
	$.ajax({
    		url : "sudoku.php",
     		data : { numbers: "give", difficulty: $(this).attr("value") },
			type: "POST",
        	success: function(data)
        	{
				Sudoku = new Game(data);
				fillTable(data);
        	},
        	error: function(xhr, status)
        	{
        		if(status!==null)
           			console.log("Error prilikom Ajax poziva: "+status);
        	},
        	async: false
		});
	// start time
	setdt = setInterval(drawTime, 10);
}

function showChoices()
{
	var thisSquare = $(this);
	if(thisSquare.css("background-color") == "rgb(255, 255, 0)" || pause)
		return;
	var index = thisSquare.attr("id");
	var pos = thisSquare.position();
	// set position (above if last row)
	if(index[1] == 2)
		choices.css("position", "absolute").css("top", pos.top-100).css("left", pos.left+40);
	else
		choices.css("position", "absolute").css("top", pos.top+40).css("left", pos.left+40);
	choices.empty();
	
	var missing = all;
	if(help) { 
		// calculate choices
		var present = Sudoku.RCS(Number(index[1]),Number(index[2]),Number(index[3]),Number(index[4]));
		missing = all.difference(present);
	}	
	// append choices
	for(var el of missing)
	choices.append("<button class='choice' value='"+el+"'>"+el+"</button>")
	$(".choice").on("click", function() { 
		thisSquare.html($(this).attr("value"));
		Sudoku.update(Number(index[1]),Number(index[2]),Number(index[3]),Number(index[4]),Number($(this).attr("value"))); 
		choices.hide(); 
	});
	choices.show();
}

function drawTime() 
{
	if(!pause) {
		// if 100cs = 1s passed
		if(cs == 0) {
			timeContext.clearRect(0,0,timeW,timeH+10);
			// increment seconds
			seconds = (seconds+1)%60;
			// if  1m passed
			if(seconds == 0) minutes++;
		}
		// set up
		timeContext.strokeStyle = "red";
		timeContext.lineWidth = 5;
		// draw seconds circle
		timeContext.beginPath();
		timeContext.arc(100,50,25,0,(cs/100)*2*Math.PI);
		timeContext.stroke();
		// draw minutes circle
		timeContext.beginPath();
		timeContext.arc(100,110,25,0,(seconds/60)*2*Math.PI);
		timeContext.stroke();
		// set up
		timeContext.strokeStyle = "black";
		timeContext.lineWidth = 1;
		timeContext.strokeText("" + seconds, ((seconds<10)?95:90),55);
		timeContext.strokeText("" + minutes, ((minutes<10)?95:90),115);
		// increment centiseconds
		cs = (cs+1)%100;
	}
}

function checkSolution()
{
	pause = true;
	var done = Sudoku.check();
	if(done)
		drawGameOver();
	else {
		$("#done").html("nisi");
		$("#continue").show();
		$("#continue").on("click", function() { pause = false; $("#done").html("GOTOV"); $(this).hide(); })
	}
}

var write = false;
function drawPlay()
{
    // clear container's current content
    container.empty();

	var testString = "";

    // append difficulty buttons
    container.append("<button id='easy' class='gameButton' value='easy'>LAKO</button><br>");
	container.append("<button id='medium' class='gameButton' value='medium'>SREDNJE</button><br>");
	container.append("<button id='hard' class='gameButton' value='hard'>TEŠKO</button>  ");
	container.append("<button id='help' value='hard'>uključi pomoć</button>  ");
	container.append("<button id='done'>GOTOV</button>");
	container.append("<button id='continue'>NASTAVI</button>");
	$("#continue").hide();
	
	$("#help").on("click", function() { 
		help = !help; 
		if(help) 
			$(this).html("isključi pomoć");
		else
			$(this).html("uključi pomoć"); 
	});

	// get random sudoku from database	
	$(".gameButton").on("click", getSudoku);

	$("#done").on("click", checkSolution);

    var str = "";
    str += "<table id='gameTable'>";
    for(var i=0; i<3; i++) {
        str += "<tr>";
        for (var j = 0; j < 3; j++) {
            str += "<td id='c" + i + j + "' class='outer'><table>";
            for (var k = 0; k < 3; k++) {
                str += "<tr>";
                for (var l = 0; l < 3; l++)
                    str += "<td id='c" + i + j + k + l + "' class='clickable'></td>";
                str += "</tr>";
            }
            str += "</table></td>";
        }
        str += "</tr>";
    }
    str += "</table>";

	container.append("<div id='choices'></div>");
	choices = $("#choices");
	choices.hide();

    // append game table
    container.append(str);

	// canvas for notes
	container.append("<canvas id='notescnv'></canvas>");
	notesCnv = $("#notescnv");
	notesContext = notesCnv.get(0).getContext("2d");
	notesContext.lineWidth = 5;
	notesContext.strokeStyle = "blue";
	notesW = notesCnv.width();
	notesH = notesCnv.height();
	notesCnv.mousedown(function(e) { currX = e.clientX; currY = e.clientY; write = true; });
	notesCnv.mousemove(function(e) {
						if(write) {
								currX = e.clientX - notesCnv.position().left - container.position().left; 
								currY = e.clientY - notesCnv.position().top - container.position().top;
								notesContext.beginPath();
        						notesContext.moveTo(prevX, prevY);
        						notesContext.lineTo(currX, currY);
        						notesContext.stroke();
        						notesContext.closePath();
								prevX = currX; prevY = currY;
						}
					});
	notesCnv.mouseup(function(e) { write = false; });
	container.append("<button id='clearNote'>očisti</button>");
	$("#clearNote").on("click", function() { notesContext.clearRect(0,0,notesW+100,notesH+10); });

	// canvas for time drawing
	container.append("<canvas id='timecnv'></canvas>");
	timeContext = $("#timecnv").get(0).getContext("2d");
	timeContext.font = "20px Arial";
	timeW = $("#timecnv").width();
	timeH = $("#timecnv").height();
	// draw 0 for seconds and minutes
	timeContext.strokeText("" + seconds, 95,55);
	seconds++;
	timeContext.strokeText("" + minutes, 95,115);

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "natrag u meni</div>");

    $(".clickable").on("click", showChoices);
}

function drawGameOver() 
{
	// add overlay
	container.append("<div id='overlay'></div>");
	$("#overlay").css("top", "0px");
	 
	// append win text
	container.append("<div id='gameOver'><span class='subtitle'>KRAJ IGRE!</span><br>Vrijeme = " + minutes + ":" + seconds + ":" + cs + "</div>");
	$("#gameOver").css("top", "100px");

	// append save score button
	container.append("<div id='saveScore' class='menuButtons'>Spremi rezultat</div>");
	$("#saveScore").css("top", "240px");
	// add score to database
	$("#saveScore").on("click", function(){
			var result = Math.floor(1000*60/(60*minutes + seconds));
			console.log(result); 
			$.ajax({
    			url : "../utils/spremiRezultat.php",
      			data : { title : "Sudoku", score : result },
        		success: function(data)
        		{
					$("#saveScore").append("<br>" + data);
        		},
        		error: function(xhr, status)
        		{
        			if(status!==null)
            			console.log("Error prilikom Ajax poziva: "+status);
        		},
        		async: false
				});
	});

	// append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "natrag u meni</div>");
}

function drawHighscores()
{
    // clear container's current content
    container.empty();

    var str = "";
    str += "<table id='hTable'>";
    str += "<tr class='hRow'>";
    str += "<td class='hRank'>#</td>";
    str += "<td class='hName'>IME</td>";
    str += "<td class='hScore'>BODOVI</td>";
    str += "</tr>";
    for(var i = 0; i < 5; i++) {
        str += "<tr class='hRow'>";
        str += "<td class='hRank'>" + (i+1) + ".</td>";
        str += "<td class='hName'></td>";
        str += "<td class='hScore'></td>";
        str += "</tr>";
    }
    str += "</table>";
    container.append(str);

    // ajax get highscores...
    $.ajax(
        {
            url : "../utils/dohvatiListu.php",
            data : { title : "Sudoku" },
            type: "POST",
            success: function(data)
            {
                var hNames = $(".hName");
				var hScores = $(".hScore");
				// fill columns with data obtained
                hNames.eq(1).text(data.prviIgrac);
                hScores.eq(1).text(data.prviBodovi);
                hNames.eq(2).text(data.drugiIgrac);
                hScores.eq(2).text(data.drugiBodovi);
				hNames.eq(3).text(data.treciIgrac);
                hScores.eq(3).text(data.treciBodovi);
				hNames.eq(4).text(data.cetvrtiIgrac);
                hScores.eq(4).text(data.cetvrtiBodovi);
				hNames.eq(5).text(data.petiIgrac);
                hScores.eq(5).text(data.petiBodovi);
            },
            error: function(xhr, status)
            {
                if(status!==null)
                    console.log("Error prilikom Ajax poziva: "+status);
            },
            async: false
        });

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "natrag u meni</div>");
}

/*================================================  GAME INITIALIZER  ================================================*/
$(document).ready( function()
{
	Sudoku = new Game("");
    container = $("#gameContainer");
    drawUnfinished();
});
