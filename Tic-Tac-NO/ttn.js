/*======================================================================================================================
                                        Tic-Tac-NO functionality implementation
======================================================================================================================*/

/*===============================================  GLOBAL VARIABLES  =================================================*/
var container;
var gameType = "AI";
var backgroundColor = "grey";
var player1 = "Ti"; // default player1 name
var player1Color =  "red";
var player2 = "AI"; // default player2 name
var player2Color = "blue";
var playerColors = "pc1";
var currentPlayer = -1;
var playingField = {"row":-1,"column":-1};
var highscores = [{"player": "","score":0},{"player": "","score":0},{"player": "","score":0},{"player": "","score":0},{"player": "","score":0}];
var moveCount = 41;
var TTN;

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
        this.bigState = [[0,0,0],[0,0,0],[0,0,0]];
        this.fullState= [[0,0,0],[0,0,0],[0,0,0]];
        // reset lobal game values
        currentPlayer = -1;
        playingField.row = -1;
        playingField.column = -1;
		moveCount = 41;
    }

    update(i,j,k,l,value) {
        var ret = 0;
        // moves allowed just in playing field
        if(playingField.row != -1 && (i != playingField.row || j != playingField.column))
            return ret;
        // update field's fullness
        this.fullState[i][j]++;
        // save move, change playing field
        this.state[i][j][k][l] = value;
        // decide next playing field
        if(this.fullState[k][l] < 9) {
            playingField.row = k;
            playingField.column = l;
        } else if(this.fullState[i][j] < 9) { // choose current field as playing field
            playingField.row = i;
            playingField.column = j;
        } else { // choose first free field
            for(var m = 0; m < 3; m++)
                for(var n = 0; n < 3; n++)
                    if(this.fullState[m][n] < 9) {
                        playingField.row = m;
                        playingField.column = n;
                        break;
                    }
        }
        ret++;
        // if field win
        if(this.smallWin(i,j))
            ret++;
        if(this.bigWin())
            ret++;
        return ret;
    }

    winMove(r1, c1, r2, c2, r3, c3, who) {
        var field = this.state[playingField.row][playingField.column];
        if(field[r1][c1] == who && field[r2][c2] == who && field[r3][c3] == 0)
            return 3*r3+c3;
        if(field[r1][c1] == who && field[r2][c2] == 0 && field[r3][c3] == who)
            return 3*r2+c2;
        if(field[r1][c1] == 0 && field[r2][c2] == who && field[r3][c3] == who)
            return 3*r1+c1;
        return -1;
    }

    findWin(who) {
        var win = -1;
        win = this.winMove(0,0,0,1,0,2,who);
        if(win > -1) return win;
        win = this.winMove(1,0,1,1,1,2,who);
        if(win > -1) return win;
        win = this.winMove(2,0,2,1,2,2,who);
        if(win > -1) return win;
        win = this.winMove(0,0,1,0,2,0,who);
        if(win > -1) return win;
        win = this.winMove(0,1,1,1,2,1,who);
        if(win > -1) return win;
        win = this.winMove(0,2,1,2,2,2,who);
        if(win > -1) return win;
        win = this.winMove(0,0,1,1,2,2,who);
        if(win > -1) return win;
        win = this.winMove(0,2,1,1,2,0,who);
        return win;
    }

    computerMove() {
        var win = this.findWin(currentPlayer);
        var block = this.findWin(-1*currentPlayer);
        if(win > -1) { // if can win
            processMove(Math.floor(win/3),win%3);
        } else if(block > -1) { // if can block opponent's win
            processMove(Math.floor(block/3),block%3);
        } else {
            // choose random available
            var field = this.state[playingField.row][playingField.column];
            var available = [];
            for (var i = 0; i < 3; i++)
                for (var j = 0; j < 3; j++)
                    if (field[i][j] == 0)
                        available.push(3 * i + j);
            var r = Math.floor(Math.random() * available.length);
            processMove(Math.floor(available[r] / 3), available[r] % 3);
        }
    }

    smallWin(row,column) {
        var field = this.state[row][column];
        if(field[0][0] + field[0][1] + field[0][2] == 3*currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[1][0] + field[1][1] + field[1][2] == 3*currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[2][0] + field[2][1] + field[2][2] == 3*currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[0][0] + field[1][0] + field[2][0] == 3*currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[0][1] + field[1][1] + field[2][1] == 3*currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[0][2] + field[1][2] + field[2][2] == 3*currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[0][0] + field[1][1] + field[2][2] == 3*currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[2][0] + field[1][1] + field[0][2] == 3*currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        return false;
    }

    bigWin() {
        if(this.bigState[0][0] + this.bigState[0][1] + this.bigState[0][2] == 3*currentPlayer)
            return true;
        if(this.bigState[1][0] + this.bigState[1][1] + this.bigState[1][2] == 3*currentPlayer)
            return true;
        if(this.bigState[2][0] + this.bigState[2][1] + this.bigState[2][2] == 3*currentPlayer)
            return true;
        if(this.bigState[0][0] + this.bigState[1][0] + this.bigState[2][0] == 3*currentPlayer)
            return true;
        if(this.bigState[0][1] + this.bigState[1][1] + this.bigState[2][1] == 3*currentPlayer)
            return true;
        if(this.bigState[0][2] + this.bigState[1][2] + this.bigState[2][2] == 3*currentPlayer)
            return true;
        if(this.bigState[0][0] + this.bigState[1][1] + this.bigState[2][2] == 3*currentPlayer)
            return true;
        if(this.bigState[2][0] + this.bigState[1][1] + this.bigState[0][2] == 3*currentPlayer)
            return true;
        return false;
    }

    fieldColor(row,column) {
        if(row == -1)
            return "#000000";
        return (this.bigState[row][column] == -1) ? player1Color : (this.bigState[row][column] == 1) ? player2Color : "#000000";
    }
}

function processMove(row,column)
{
    var square;
    // if computer moved
    if(row > -1) {
        var id = "#c" + playingField.row + playingField.column + row + column;
        square = $(id);
    } else // see which field square (td) was clicked
        square = $(this);

    // do nothing if field is already colored (played)
    if(square.css("background-color") != "rgb(255, 255, 255)")
        return;

    // save playing field id and old field color
    var old_cid = "#c" + playingField.row + playingField.column;
    var old_clr = TTN.fieldColor(playingField.row, playingField.column);
    // find square index from which take indices to update game state
    var id = square.attr("id");

    // make move logically
    var ret = TTN.update(Number(id[1]),Number(id[2]),Number(id[3]),Number(id[4]), currentPlayer);

    // deal with results
    if(ret > 0) {
        // reset previous playing field color
        $(old_cid).css("background-color", old_clr);
        // change field's color
        square.css("background-color", (currentPlayer == -1) ? player1Color : player2Color);
        // set new playing field
        var cid = "#c" + playingField.row + playingField.column;
        $(cid).css("background-color", "#00ff00");
        // set next player
        currentPlayer *= -1;
    }
    if(ret > 1) {
        // change color of won field if not won before
		if(old_clr != player1Color && old_clr != player2Color)
        	$(old_cid).css("background-color", (currentPlayer == -1) ? player2Color : player1Color);
    }
    if(ret > 2) {
        // change everything to winner color
        //$("#gameTable").css("background-color", (currentPlayer == -1) ? player2Color : player1Color);
        // draw win screen
		drawGameOver();
        return;
    }
    if(currentPlayer == 1) {
		$("#p2").css("visibility", "visible");
		$("#p1").css("visibility", "hidden");
        if (gameType == "AI")
            TTN.computerMove();
        moveCount--;
       	$("#score").text("Preostalo poteza: " + moveCount);
	} else {
		$("#p1").css("visibility", "visible");
		$("#p2").css("visibility", "hidden");
	}
}

/*==============================================  SCREEN INITIALIZERS  ===============================================*/
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

function drawPlay()
{
    // clear container's current content
    container.empty();

    // append player names
    container.append("<div id='p1'>" + " " + player1 + "</div><div id='score'>Preostalo poteza: 41</div><div id='p2'>" + " " + player2 + "</div>");
    $("#p1").css("color", player1Color);
    $("#p2").css("color", player2Color);
	$("#p2").css("visibility", "hidden");

    var str = "";
    str += "<table id='gameTable'>";
    for(var i=0; i<3; i++) {
        str += "<tr>";
        for (var j = 0; j < 3; j++) {
            str += "<td id='c" + i + j + "'><table>";
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

    // append game table
    container.append(str);

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "natrag u meni</div>");

    $(".clickable").on("click", processMove);
    TTN = new Game();
}

function drawGameOver() 
{
	// clear container's current content
    container.empty();
	
	container.css("background-color", ((currentPlayer == -1) ? player2Color : player1Color));
	// append win text
	container.append("<div id='gameOver'><span class='subtitle'>KRAJ IGRE!</span><br>" + ((currentPlayer == -1) ? player2 : player1) + " je pobijednio s" + (41-moveCount+1) + " poteza.</div>");

	// append save score button
	container.append("<div id='saveScore' class='menuButtons'>Spremi rezultat</div>");
	// add score to database
	$("#saveScore").on("click", function(){
		console.log("save");
		$.ajax({
    	url : "../utils/spremiRezultat.php ",
      	data : { title : "Tic-Tac-NO", score : moveCount },
        success: function(data)
        {
   	    	console.log(data);
			// $("#saveScore").html(data);
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
            url : " ../utils/dohvatiListu.php ",
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

    // fill table with scores
    var hNames = $(".hName");
    for(var i = 0; i < 5; i++) {
        hNames.eq(i+1).text(highscores[i].player);
    }
    var hScores = $(".hScore");
    for(var i = 0; i < 5; i++) {
        hScores.eq(i+1).text(highscores[i].score);
    }

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "natrag u meni</div>");
}

function drawSettings()
{
    // clear container's current content
    container.empty();

    container.append("<div id='settDiv'><form id='settingsForm'></form></div>");

    var str = "<span class='subtitle'>Izaberi pozadinsku boju:</span><br>";
    str += "<input type='radio' name='bcolorSettings' value='white'> Bijela<br>";
    str += "<input type='radio' name='bcolorSettings' value='grey'> Siva<br>";
    str += "<input type='radio' name='bcolorSettings' value='brown'> Smeđa";

    str += "<br><br><span class='subtitle'>Izaberi boje igrača:</span><br>";
    str += "<input type='radio' name='pcolorSettings' value='pc1'> Crveni i Plavi<br>";
    str += "<input type='radio' name='pcolorSettings' value='pc2'> Ljubičasti i Žuti<br>";

    str += "<br><br><span class='subtitle'>Odaberi tip igre</span><br>";
    str += "<input type='radio' name='gtypeSettings' value='AI'> Ti vs. AI<br>";
    str += "<input type='radio' name='gtypeSettings' value='2off'> Ti vs. Prijatelj<br>";

    str += "</form>";

    $("#settingsForm").append(str);

    var settingsForm = $("#settingsForm input:radio");
    // set default checked current background color
    settingsForm.filter("[value=" + backgroundColor + "]").prop('checked', true);
    settingsForm.filter("[value=" + playerColors + "]").prop('checked', true);
    settingsForm.filter("[value=" + gameType + "]").prop('checked', true);
    // set action on click
    settingsForm.on("click", function() {
        // get value of object that was clicked
        if($(this).attr("name") == "bcolorSettings") {
			var clr = $(this).attr("value");
            // set container color
            container.css("background-color", clr);
			backgroundColor = clr;
        } else if($(this).attr("name") == "pcolorSettings"){
            // set player colors
            playerColors = $(this).attr("value");
            if(playerColors == "pc1") {
                player1Color = "red";
                player2Color = "blue";
            } else {
                player1Color = "purple";
                player2Color = "yellow";
            }
        } else {
            // set game type
            gameType = $(this).attr("value");
            if(gameType == "AI")
                player2 = "AI";
            else
                player2 = "Prijatelj";
        }
    });

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "natrag u meni</div>");
}

function drawHelp()
{
    // clear container's current content
    container.empty();

    container.append("<div id='helpText'></div>");
    var str = "";
    str += "Iskombiniraj male pobjede da bi odnio veliku.<br>";
    str += "3x3 polje za igru određeno je protivnikovim zadnjim potezom ili slučajno ako je potrebno.<br><br>";
    str += "<span class='subtitle'>Primjer:</span><br>Igrač1 odigra u donje desno polje trenutnog igračeg polja.<br>";
    str += "Trenutno igrače polje (za sljedećeg igrača) postaje donje desno 3x3 polje.<br>";
    str += "Igrače polje označeno je zelenim rubovima, a prvi potez igre je proizvoljan.<br>";
    $("#helpText").append(str);

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "natrag u meni</div>");
}

/*================================================  GAME INITIALIZER  ================================================*/
$(document).ready( function()
{
    TTN = new Game();
    container = $("#gameContainer");
    drawMenu();
});