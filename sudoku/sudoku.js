/*======================================================================================================================
                                        Sudoku functionality implementation
======================================================================================================================*/

/*===============================================  GLOBAL VARIABLES  =================================================*/
var container;
var backgroundColor = "grey";
var highscores = [{"player": "","score":0},{"player": "","score":0},{"player": "","score":0},{"player": "","score":0},{"player": "","score":0}];
var choices;
var Sudoku;

/*===================================================  GAME LOGIC  ===================================================*/
class Game {
    constructor() {
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
    }

	get numbers() { return this.state; }  

    update(i,j,k,l,value) {
		this.state[i][j][k][l] = value;
    }

	constructFromString(str) {
		for(var i = 0; i < 3; i++)
            for(var j = 0; j < 3; j++)
                for (var k = 0; k < 3; k++)
                    for (var l = 0; l < 3; l++)
                        this.state[i][j][k][l] = str.charAt(27*i + 9*j + 3*k + l);
	}
}

function processMove(row,column)
{
    
}

/*==============================================  SCREEN INITIALIZERS  ===============================================*/
function drawUnfinished()
{
	// container color
	container.css("background-color", backgroundColor);

	// add overlay
	container.append("<div id='overlay'></div>");
	$("#overlay").css("top", "0px");
	
	container.append("<div style='position:absolute;width:100%;height:20%;top:20%;text-align:center;color:white;font-size:30px'>Igra je u početnom stadiju izrade...</div>");
	// add try button	
	container.append("<button id='try' style='position:absolute;width:10%;height:10%;top:45%;left:45%'>Pogledaj</button>");
	$("#try").on("click", drawMenu);
}

function drawMenu()
{
    // clear container's current content
    container.empty();
	// container color
	container.css("background-color", backgroundColor);

    // append 4 menu buttons
    container.append("<div id='play' class='menuButtons' onclick='drawPlay()'>" + "IGRAJ</div>");
    container.append("<div id='highscores' class='menuButtons' onclick='drawHighscores()'>" + "TOP 5</div>");
    container.append("<div id='settings' class='menuButtons' onclick='drawSettings()'>" + "POSTAVKE</div>");
    container.append("<div id='help' class='menuButtons' onclick='drawHelp()'>" + "POMOĆ</div>");
}

function fillTable(str) 
{
	var squares = $(".clickable");
	var nums = Sudoku.numbers;
	var c = 0;
	for(var i = 0; i < 3; i++)
    	for(var j = 0; j < 3; j++)
  	      for (var k = 0; k < 3; k++)
     	     for (var l = 0; l < 3; l++) {
				if(nums[i][j][k][l] != 0)
			 		squares.eq(c).text(nums[i][j][k][l]);
				c++;
				}
}

function showChoices()
{
	var thisSquare = $(this);
	var pos = thisSquare.position();
	// calculate choices list...
	choices.css("position", "absolute").css("top", pos.top).css("left", pos.left);
	choices.empty();
	for(var i=0; i<9; i++)
		choices.append("<button class='choice' value='"+(i+1)+"'>"+(i+1)+"</button>")
	$(".choice").on("click", function() { 
		thisSquare.html($(this).attr("value")); 
		choices.hide(); 
	});
	choices.show();
}

function drawPlay()
{
    // clear container's current content
    container.empty();

	var testString = "";

    // append difficulty buttons
    container.append("<button id='easy' class='difficultyButtons' value='t'>LAKO</button><br>");
	container.append("<button id='medium' class='difficultyButtons' value='s'>SREDNJE</button><br>");
	container.append("<button id='hard' class='difficultyButtons' value='l'>TEŠKO</button>  ");
	container.append("<button id='gotov' onclick='drawGameOver()'>GOTOV</button>");
	$(".difficultyButtons").on("click", function(){
		testString = "000689100800000029150000008403000050200005000090240801084700910500000060060410000";
		Sudoku.constructFromString(testString);
		fillTable(testString);
		$.ajax({
    			url : "sudoku.php",
      			data : { numbers: "give", difficulty: $(this).attr("value") },
				type: "POST",
        		success: function(data)
        		{
					console.log("--> " + data);
					testString = "000689100800000029150000008403000050200005000090240801084700910500000060060410000";
					Sudoku.constructFromString(testString);
					fillTable(testString);
        		},
        		error: function(xhr, status)
        		{
        			if(status!==null)
            			console.log("Error prilikom Ajax poziva: "+status);
        		},
        		async: false
				});
	});

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

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "natrag u meni</div>");

    $(".clickable").on("click", showChoices);

    Sudoku = new Game();
}

function drawGameOver() 
{
	// add overlay
	container.append("<div id='overlay'></div>");
	$("#overlay").css("top", "0px");
	 
	// append win text
	container.append("<div id='gameOver'><span class='subtitle'>KRAJ IGRE!</span><br>Vrijeme = MM:SS</div>");
	$("#gameOver").css("top", "100px");

	// append save score button
	container.append("<div id='saveScore' class='menuButtons'>Spremi rezultat</div>");
	$("#saveScore").css("top", "240px");
	// add score to database
	$("#saveScore").on("click", function(){
		if(true) {
			$("#saveScore").append("<br>Ne sprema se rezultat za igre s prijateljima")
		} else {
			$.ajax({
    			url : "../utils/spremiRezultat.php",
      			data : { title : "Tic-Tac-NO", score : moveCount },
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
		}
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
            data : { title : "Tic-Tac-NO" },
            type: "POST",
            success: function(data)
            {
                highscores[0].player = data.prviIgrac;
                highscores[0].score = data.prviBodovi;
                highscores[1].player = data.drugiIgrac;
                highscores[1].score = data.drugiBodovi;
                highscores[2].player = data.treciIgrac;
                highscores[2].score = data.treciBodovi;
                highscores[3].player = data.cetvrtiIgrac;
                highscores[3].score = data.cetvrtiBodovi;
                highscores[4].player = data.petiIgrac;
                highscores[4].score = data.petiBodovi;
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

function drawSettings()
{
    // clear container's current content
    container.empty();

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "natrag u meni</div>");
}

function drawHelp()
{
    // clear container's current content
    container.empty();

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "natrag u meni</div>");
}

/*================================================  GAME INITIALIZER  ================================================*/
$(document).ready( function()
{
    Sudoku = new Game();
    container = $("#gameContainer");
    drawUnfinished();
});
