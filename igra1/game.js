/*======================================================================================================================
                                    Igra1 functionality implementation
======================================================================================================================*/

/*===============================================  GLOBAL VARIABLES  =================================================*/
var container;
var highscores = [];

/*================================================  LOGIC FUNCTIONS  ==================================================*/


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

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "back to menu</div>");
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