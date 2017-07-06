/*======================================================================================================================
                          Tic-Tac-NO gameplay functionality implementation
======================================================================================================================*/

/*=============================================  GLOBAL VARIABLES  ===================================================*/
var playerName = "guest_player"; // default player name
var currentPlayer = -1;
var currentColor = (currentPlayer == -1) ? "#ff0000" : "#0000ff";

/*================================================  FUNCTIONS  =======================================================*/
function processMove()
{
    // do nothing if field is already colored
    if($(this).css("background-color") != "rgb(255, 255, 255)")
        return;
    // change field's color and set color for next player
    $(this).css("background-color", currentColor);
    currentPlayer *= -1;
    currentColor = (currentPlayer == -1) ? "#ff0000" : "#0000ff";

    //check for win...
}

/*=============================================  INITIALIZE ARENA  ===================================================*/
// draw 3x3x3x3 abstract game matrix, (write player names...)
function init()
{
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

    var body = $("body");
    body.append(str);
    body.append("<hr><a href='../../index.html'>povratak</a><br>Created by: isschl");

    $(".clickable").on("click", processMove);
}

$(document).ready( function()
{
    init();
});