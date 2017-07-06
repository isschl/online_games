/*======================================================================================================================
                                        Tic-Tac-NO functionality implementation
======================================================================================================================*/

/*===============================================  GLOBAL VARIABLES  =================================================*/
var container;
var player1 = "guest_player"; // default player1 name
var player2 = "computer"; // default player2 name
var currentPlayer = -1;
var playingField = [-1,-1];
var highscores = [];
var moveCount = 0;
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
        processMove(Math.floor(r/3),r%3);
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
        square.css("background-color", (currentPlayer == -1) ? "#ff0000" : "#0000ff");
        // set new playing field
        var cid = "#c" + playingField[0] + playingField[1];
        $(cid).css("background-color", "#00ff00");
        // set next player
        currentPlayer *= -1;
    }
    if(ret > 1) {
        // change color of won field
        $(old_cid).css("background-color", (currentPlayer == -1) ? "#0000ff" : "#ff0000");
    }
    if(ret > 2) {
        // change everything to winner color
        $("#gameTable").css("background-color", (currentPlayer == -1) ? "#0000ff" : "#ff0000");
        container.empty();
        container.append("Game Over! " + ((currentPlayer == -1) ? player2 : player1) + " has won.");
        return;
    }
    if(currentPlayer == 1)
        TTN.computerMove();
    else {// increment move count
        moveCount++;
        $("#score").text("Moves: " + moveCount);
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
    container.append("<p id='p1'>Player1:" + " " + player1 + "</p><p id='score'>Moves: 0</p><p id='p2'>Player2:" + " " + player2 + "</p>")
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
    for(var i = 0; i < 10; i++) {
        str += "<tr class='hRow'>";
        str += "<td class='hRank'>" + (i+1) + ".</td>";
        str += "<td class='hName'></td>";
        str += "<td class='hScore'></td>";
        str += "</tr>";
    }
    str += "</table>";
    container.append(str);

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "back to menu</div>");
}

function drawSettings()
{
    // clear container's current content
    container.empty();

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "back to menu</div>");
}

function drawHelp()
{
    // clear container's current content
    container.empty();

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