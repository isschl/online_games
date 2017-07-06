$(document).ready(function()
{
	function stvori_zaprikaz( prozor )
	{
		$( "body" ).prepend( prozor );
		$( "#prozor" )
		.css( "position" , "fixed" )
		.css( "z-index" , "1" )
		.css( "margin-top" , Math.floor (0.1*($(window).height()))+"px" )
		.css( "margin-left" , Math.floor (0.1*($(window).width()))+"px" )
		.css( "margin-right" , Math.floor (0.1*($(window).width()))+"px" )
		.css( "margin-bottom" , Math.floor (0.1*($(window).height()))+"px" )
		.css( "width", Math.floor (0.8*($(window).width()))+"px" )
		.css( "height", Math.floor (0.8*($(window).height()))+"px" )
		.css( "background-color" , "#555555" )
		.css( "overflow" , "auto" )
		.css( "display" , "none" )
		.css( "color", "white" )
		.css( "left", "0" )
		.css( "right", "0" )
		.css( "top", "0" )
		.css( "bottom", "0" );
	}

	function dodaj_izlazgumb()
	{
	$( "#prozor" ) . prepend( $('<button id="close" class = "galer" >X</button>') );
	$( "#close" ) . css("float","right");
	$( "#close" ) . css( "background-color", "#f44336" );
	$( "#close" ).css("padding",$("button.galer").width());
	$("#prozor #close")
		.mouseover(function() { $(this).css("background-color","blue"); })
		.mouseout(function() { $(this).css("background-color","red"); })
		.css( "padding", "0px" )
		.css( "border-width", "0px" )
		.css( "width", "50px" )
		.css( "height",  "40px" );
	}

	var enabled = 0;	

	function pokaziProzor()
	{
	enabled = 1;
	$("#prozor").remove();
	var prozor = $('<div id="prozor" class="prozor"></div>');
	stvori_zaprikaz( prozor );
	dodaj_izlazgumb();

	$("#prozor").append('<div style="color:white; position:fixed; padding:2em; left:50%; top:50%; transform:translate(-50%, -50%);" id="dodano">'+$("#tekstuputa").html()+'</div>');

	$("#prozor").css( "display" , "block" );
	}

	$("#tekstuputa") . css( "display" , "none" );

	$("#upute").on("click",pokaziProzor);

	$( "body" ).on( "click", "div.prozor #close", function()
	{
			enabled = 0;
			$("#prozor").css("display","none"); 
	});

	$( window ).resize(function() {
  		if(enabled === 1) pokaziProzor();
	});

});