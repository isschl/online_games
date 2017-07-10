$(document).ready(function()
{
	//klikom na npr. div sa id-jem tekstuputa, njegov sadržaj se skriva
	//te se dodaje u div ispred ostalog sadržaja (nešto kao gallery iz dz)
 
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

	//dodaj tom stvorenom prozoru gumb kojim se zatvara
	function dodaj_izlazgumb()
	{
	$( "#prozor" ) . prepend( $('<button id="close" '
				+ 'class = "galer" >X</button>') );
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

	//varijabla govori je li prozor prikazan - na dnu imamo da se na resize
	//prilagođava dimenzijama - ali samo ako je prikazan!

	var enabled = 0;	



	function pokaziProzor()
	{
	//prozor je prikazan, pa je enabled postavljen na 1
	enabled = 1;

	//ako je bio neki start prozor, ukloni ga
	$("#prozor").remove();
	var prozor = $('<div id="prozor" class="prozor"></div>');
	stvori_zaprikaz( prozor );

	//dodaj mu gumb za izlaz
	dodaj_izlazgumb();

	$("#prozor").append('<div style="color:white; position:fixed; '
		+ 'padding:2em; left:50%; top:50%; '
		+ 'transform:translate(-50%, -50%);" id="dodano">'
		+ $("#tekstuputa").html()+'</div>');

	$("#prozor").css( "display" , "block" );
	}

	//makni tekst na početku koji će se prikazati klikom na tag id-ja upute
	$("#tekstuputa") . css( "display" , "none" );

	$("#upute").on("click",pokaziProzor);

	//zatvori prozor ako je kliknuto na gumb za izlazak iz njega
	$( "body" ).on( "click", "div.prozor #close", function()
	{
			enabled = 0;
			$("#prozor").css("display","none"); 
	});



	//na resize, pokaži ponovo taj prozor s prilagođenim dimenzijama
	$( window ).resize(function() {
  		if(enabled === 1) pokaziProzor();
	});

});
