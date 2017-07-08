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
        playingField.count= 0;
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

    computerMove() {
        var available = [];
        for(var i = 0; i < 3; i++)
            for(var j = 0; j < 3; j++)
                if(this.state[playingField.row][playingField.column][i][j] == 0)
                    available.push(3*i+j);
        var r = Math.floor(Math.random() * available.length);
        processMove(Math.floor(available[r]/3),available[r]%3);
    }

    checkFull(row,column) {
        for(var i = 0; i < 3; i++)
            for(var j = 0; j < 3; j++)
                if(this.state[playingField.row][playingField.column][i][j] == 0)
                    return false;
        this.fullState[playingField.row][playingField.column] = true;
        return true;
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
        // change color of won field
        $(old_cid).css("background-color", (currentPlayer == -1) ? player2Color : player1Color);
    }
    if(ret > 2) {
        // change everything to winner color
        $("#gameTable").css("background-color", (currentPlayer == -1) ? player2Color : player1Color);
        container.empty();
        // append win text
        container.append("<div id='gameOver'>Game Over! " + ((currentPlayer == -1) ? player2 : player1) + " has won.</div>");
        // append back to menu button
        container.append("<div id='back' onclick='drawMenu()'>" + "back to menu</div>");
        // add score to database
        $.ajax(
            {
                url : "../utils/spremiRezultat.php ",
                data : { title : "Tic-Tac-NO", score : moveCount },
                success: function(data)
                {
                    console.log(data);
                },
                error: function(xhr, status)
                {
                    if(status!==null)
                        console.log("Error prilikom Ajax poziva: "+status);
                },
                async: false
            });
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