/*======================================================================================================================
                                        Tic-Tac-NO functionality implementation
======================================================================================================================*/

/*===============================================  GLOBAL VARIABLES  =================================================*/
var container;
var backgroundColor = "grey";
var player1 = "guest_player"; // default player1 name
var player1Color =  "red";
var player2 = "computer"; // default player2 name
var player2Color = "blue";
var playerColors = "pc1";
var currentPlayer = -1;
var playingField = [-1,-1];
var highscores = [{"igrac": "Pero", "bodovi":30}, {"igrac": "Mirko", "bodovi":40}];
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
        // reset lobal game values
        currentPlayer = -1;
        playingField = [-1,-1];
    }

    update(i,j,k,l,value) {
        var ret = 0;
        // moves allowed just in playing field
        if(playingField[0] != -1 && (i != playingField[0] || j != playingField[1]))
            return ret;
        // save move, change playing field
        this.state[i][j][k][l] = value;
        playingField[0] = k;
        playingField[1] = l;
        // check
        ret++;
        // if field win
        if(this.smallWin(i,j))
            ret++;
        if(this.bigWin())
            ret++;
        return ret;
    }

    computerMove() {
        var available = [];
        for(var i = 0; i < 3; i++)
            for(var j = 0; j < 3; j++)
                if(this.state[playingField[0]][playingField[1]][i][j] == 0)
                    available.push(3*i+j);
        var r = Math.floor(Math.random() * available.length);
        processMove(Math.floor(available[r]/3),available[r]%3);
    }

    smallWin(row,column) {
        var field = this.state[row][column];
        if(field[0][0] == currentPlayer && field[0][1] == currentPlayer && field[0][2] == currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[1][0] == currentPlayer && field[1][1] == currentPlayer && field[1][2] == currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[2][0] == currentPlayer && field[2][1] == currentPlayer && field[2][2] == currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[0][0] == currentPlayer && field[1][0] == currentPlayer && field[2][0] == currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[0][1] == currentPlayer && field[1][1] == currentPlayer && field[2][1] == currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[0][2] == currentPlayer && field[1][2] == currentPlayer && field[2][2] == currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[0][0] == currentPlayer && field[1][1] == currentPlayer && field[2][2] == currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        if(field[2][0] == currentPlayer && field[1][1] == currentPlayer && field[0][2] == currentPlayer) {
            this.bigState[row][column] = currentPlayer;
            return true;
        }
        return false;
    }

    bigWin() {
        if(this.bigState[0][0] == currentPlayer && this.bigState[0][1] == currentPlayer && this.bigState[0][2] == currentPlayer)
            return true;
        if(this.bigState[1][0] == currentPlayer && this.bigState[1][1] == currentPlayer && this.bigState[1][2] == currentPlayer)
            return true;
        if(this.bigState[2][0] == currentPlayer && this.bigState[2][1] == currentPlayer && this.bigState[2][2] == currentPlayer)
            return true;
        if(this.bigState[0][0] == currentPlayer && this.bigState[1][0] == currentPlayer && this.bigState[2][0] == currentPlayer)
            return true;
        if(this.bigState[0][1] == currentPlayer && this.bigState[1][1] == currentPlayer && this.bigState[2][1] == currentPlayer)
            return true;
        if(this.bigState[0][2] == currentPlayer && this.bigState[1][2] == currentPlayer && this.bigState[2][2] == currentPlayer)
            return true;
        if(this.bigState[0][0] == currentPlayer && this.bigState[1][1] == currentPlayer && this.bigState[2][2] == currentPlayer)
            return true;
        if(this.bigState[2][0] == currentPlayer && this.bigState[1][1] == currentPlayer && this.bigState[0][2] == currentPlayer)
            return true;
        return false;
    }

    fieldColor(row,column) {
        if(row == -1)
            return "#000000";
        return (this.bigState[row][column] == -1) ? "#ff0000" : (this.bigState[row][column] == 1) ? "#0000ff" : "#000000";
    }
}

function processMove(row,column)
{
    var square;
    // if computer moved
    if(row > -1) {
        var id = "#c" + playingField[0] + playingField[1] + row + column;
        console.log(id);
        square = $(id);
    } else // see which field square (td) was clicked
        square = $(this);

    // do nothing if field is already colored (played)
    if(square.css("background-color") != "rgb(255, 255, 255)")
        return;
    // save playing field id and old field color
    var old_cid = "#c" + playingField[0] + playingField[1];
    var old_clr = TTN.fieldColor(playingField[0],playingField[1]);
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
        var cid = "#c" + playingField[0] + playingField[1];
        $(cid).css("background-color", "#00ff00");
        // set next player
        currentPlayer *= -1;
    }
    if(ret > 1) {
        // change color of won field
        $(old_cid).css("background-color", (currentPlayer == -1) ? player2Color : player1Color);
    }
    if(ret > 2) {
        // change everything to winner color
        $("#gameTable").css("background-color", (currentPlayer == -1) ? player2Color : player1Color);
        container.empty();
        container.append("<div id='gameOver'>Game Over! " + ((currentPlayer == -1) ? player2 : player1) + " has won.</div>");
        return;
    }
    if(currentPlayer == 1)
        TTN.computerMove();
    else {// increment move count
        moveCount--;
        $("#score").text("Moves left: " + moveCount);
    }
}

/*==============================================  SCREEN INITIALIZERS  ===============================================*/
function drawMenu()
{
    // clear container's current content
    container.empty();

    // append 4 menu buttons
    container.append("<div id='play' class='menuButtons' onclick='drawPlay()'>" + "PLAY</div>");
    container.append("<div id='highscores' class='menuButtons' onclick='drawHighscores()'>" + "HIGHSCORES</div>");
    container.append("<div id='settings' class='menuButtons' onclick='drawSettings()'>" + "SETTINGS</div>");
    container.append("<div id='help' class='menuButtons' onclick='drawHelp()'>" + "HELP</div>");
}

function drawPlay()
{
    // clear container's current content
    container.empty();

    // append player names
    container.append("<p id='p1'>Player1:" + " " + player1 + "</p><p id='score'>Moves left: 41</p><p id='p2'>Player2:" + " " + player2 + "</p>")
    $("#p1").css("color", player1Color);
    $("#p2").css("color", player2Color);

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
    container.append("<div id='back' onclick='drawMenu()'>" + "back to menu</div>");

    $(".clickable").on("click", processMove);
    TTN = new Game();
}

function drawHighscores()
{
    // clear container's current content
    container.empty();

    var str = "";
    str += "<table id='hTable'>";
    str += "<tr class='hRow'>";
    str += "<td class='hRank'>rank</td>";
    str += "<td class='hName'>name</td>";
    str += "<td class='hScore'>score</td>";
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

    // fill table with scores
    var hNames = $(".hName");
    for(var i = 0; i < 2; i++) {
        hNames.eq(i+1).text(highscores[i].igrac);
    }
    var hScores = $(".hScore");
    for(var i = 0; i < 2; i++) {
        hScores.eq(i+1).text(highscores[i].bodovi);
    }

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "back to menu</div>");
}

function drawSettings()
{
    // clear container's current content
    container.empty();

    var str = "<form id='settingsForm'>";

    str += "Choose background color:<br>";
    str += "<input type='radio' name='bcolorSettings' value='white'> White<br>";
    str += "<input type='radio' name='bcolorSettings' value='grey'> Grey<br>";
    str += "<input type='radio' name='bcolorSettings' value='brown'> Brown";

    str += "<br><br>Choose player colors:<br>";
    str += "<input type='radio' name='pcolorSettings' value='pc1'> Red & Blue<br>";
    str += "<input type='radio' name='pcolorSettings' value='pc2'> Purple & Yellow<br>";

    str += "</form>";

    container.append(str);

    var settingsForm = $("#settingsForm input:radio");
    // set default checked current background color
    settingsForm.filter("[value=" + backgroundColor + "]").prop('checked', true);
    settingsForm.filter("[value=" + playerColors + "]").prop('checked', true);
    // set action on click
    settingsForm.on("click", function() {
        // get value of object that was clicked
        if($(this).attr("name") == "bcolorSettings") {
            var clr = $(this).attr("value");
            // set color to container
            backgroundColor = clr;
            container.css("background-color", backgroundColor);
        } else {
            var clrs = $(this).attr("value");
            // set color to container
            playerColors = clrs;
            if(playerColors == "pc1") {
                player1Color = "red";
                player2Color = "blue";
            } else {
                player1Color = "purple";
                player2Color = "yellow";
            }
        }
    });

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "back to menu</div>");
}

function drawHelp()
{
    // clear container's current content
    container.empty();

    container.append("<div id='helpText'>");
    container.append("Combine small Tic-Tac-Toe wins to win a large Tic-Tac-Toe(NO)<br>");
    container.append("Allowed small Tic-Tac-Toe playing field is determined by opponent's last move.<br>");
    container.append("<h4>Example:</h4><br>Player1 plays in bottom middle square of playing field (no matter which)");
    container.append("<br>Now the playing field for Player2 becomes the bottom middle Tic-Tac-Toe field");
    container.append("<br>Playing field is marked with gren edges");
    container.append("</div>");

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "back to menu</div>");
}

/*================================================  GAME INITIALIZER  ================================================*/
$(document).ready( function()
{
    TTN = new Game();
    container = $("#gameContainer");
    drawMenu();
});