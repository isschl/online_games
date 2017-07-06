/*======================================================================================================================
                                        Tic-Tac-NO functionality implementation
======================================================================================================================*/

/*===============================================  GLOBAL VARIABLES  =================================================*/
var container;
var player1 = "guest_player"; // default player1 name
var player2 = "computer"; // default player2 name
var currentPlayer = -1;
var highscores = [];

/*================================================  LOGIC FUNCTIONS  ==================================================*/
function processMove()
{
    // do nothing if field is already colored
    if($(this).css("background-color") != "rgb(255, 255, 255)")
        return;
    // change field's color and set next player
    currentColor = (currentPlayer == -1) ? "#ff0000" : "#0000ff";
    $(this).css("background-color", currentColor);
    currentPlayer *= -1;

    //check for win...
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
    container.append("<p id='p1'>Player1:" + " " + player1 + "</p><p id='p2'>Player2:" + " " + player2 + "</p>")
    var str = "";
    str += "<table>";
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
    container = $("#gameContainer");
    drawMenu();
});