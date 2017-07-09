$(document).ready(function()
{ 
	var dummy = null;
	$.ajax(
	{
		url: "../utils/login.php",
		data: { nesto : dummy },
		type: "POST",
		success: function(data)
		{
			$("#pocetni").append('<hr>');
			$("#pocetni").append('<div id="login">'+data+'</div>');
			$("#pocetni").append('<hr>');
		},
		error: function(xhr, status)
		{
			if(status !== null)
				console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
	});

	$("body").on("click","#loginklasa1",function(){
		var usr = $("#username").val();
		var pas = $("#password").val();
		$.ajax(
		{
		url: "../utils/login.php",
		data: { username : usr, password : pas },
		type: "POST",
		success: function(data)
		{
			$("#login").html(data);	
		},
		error: function(xhr, status)
		{
			if(status !== null)
				console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
		} );
	});

	var logout = true;	

	$("body").on("click","#loginklasa2",function(){
		$.ajax(
		{
		url: "../utils/login.php",
		data: { logout : logout },
		type: "POST",
		success: function(data)
		{
			$("#login").html(data);	
		},
		error: function(xhr, status)
		{
			if(status !== null)
				console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
		} );
	});

	var divElement = $("#pocetni");
	
	divElement.prepend('<canvas height="100" width="100" id="naslovniCanvas">Nije podrzan canvas</canvas>');

	crtajNaslovnu();
	setInterval(crtajNaslovnu, 1000);

	function crtajBroj(broj,koordx,koordy,dimenzija,boja)
	{
		var ctx = $("#naslovniCanvas").get(0).getContext("2d");
		
		ctx.lineWidth = 2;

		ctx.strokeStyle = boja;

		ctx.beginPath();
		switch(broj) {
    		case 0:
        		ctx.strokeRect(koordx,koordy,dimenzija,dimenzija);
        		break;
    		case 1:
        		ctx.moveTo(koordx+dimenzija,koordy+dimenzija);
			ctx.lineTo(koordx+dimenzija,koordy);
        		break;
		case 2:
        		ctx.moveTo(koordx,koordy); ctx.lineTo(koordx+dimenzija,koordy);
			ctx.lineTo(koordx+dimenzija,koordy+Math.floor(dimenzija/2));
			ctx.lineTo(koordx,koordy+Math.floor(dimenzija/2));
			ctx.lineTo(koordx,koordy+dimenzija); ctx.lineTo(koordx+dimenzija,koordy+dimenzija);
        		break;
		case 3:
        		ctx.moveTo(koordx,koordy); ctx.lineTo(koordx+dimenzija,koordy);
			ctx.lineTo(koordx+dimenzija, koordy+dimenzija); ctx.lineTo(koordx, koordy+dimenzija);
			ctx.moveTo(koordx,koordy+Math.floor(dimenzija/2));
			ctx.lineTo(koordx+dimenzija,koordy+Math.floor(dimenzija/2));
        		break;
		case 4:
        		ctx.moveTo(koordx,koordy);
			ctx.lineTo(koordx,koordy+Math.floor(dimenzija/2));
			ctx.lineTo(koordx+dimenzija,koordy+Math.floor(dimenzija/2));
			ctx.moveTo(koordx+dimenzija,koordy); ctx.lineTo(koordx+dimenzija,koordy+dimenzija);
        		break;
		case 5:
        		ctx.moveTo(koordx+dimenzija,koordy); ctx.lineTo(koordx,koordy);
			ctx.lineTo(koordx,koordy+Math.floor(dimenzija/2));
			ctx.lineTo(koordx+dimenzija,koordy+Math.floor(dimenzija/2));
			ctx.lineTo(koordx+dimenzija,koordy+dimenzija); ctx.lineTo(koordx,koordy+dimenzija);
        		break;
		case 6:
        		ctx.moveTo(koordx+dimenzija,koordy); ctx.lineTo(koordx,koordy);
			ctx.lineTo(koordx,koordy+Math.floor(dimenzija/2));
			ctx.lineTo(koordx+dimenzija,koordy+Math.floor(dimenzija/2));
			ctx.lineTo(koordx+dimenzija,koordy+dimenzija); ctx.lineTo(koordx,koordy+dimenzija);
			ctx.lineTo(koordx,koordy+Math.floor(dimenzija/2));
        		break;
		case 7:
        		ctx.moveTo(koordx,koordy);
			ctx.lineTo(koordx+dimenzija,koordy);
			ctx.lineTo(koordx+dimenzija,koordy+dimenzija);
        		break;
		case 8:
        		ctx.strokeRect(koordx,koordy,dimenzija,dimenzija);
			ctx.moveTo(koordx,koordy+Math.floor(dimenzija/2));
			ctx.lineTo(koordx+dimenzija,koordy+Math.floor(dimenzija/2));
        		break;
		case 9:
        		ctx.moveTo(koordx+dimenzija,koordy); ctx.lineTo(koordx,koordy);
			ctx.lineTo(koordx,koordy+Math.floor(dimenzija/2));
			ctx.lineTo(koordx+dimenzija,koordy+Math.floor(dimenzija/2));
			ctx.lineTo(koordx+dimenzija,koordy+dimenzija); ctx.lineTo(koordx,koordy+dimenzija);
			ctx.moveTo(koordx+dimenzija,koordy);
			ctx.lineTo(koordx+dimenzija,koordy+Math.floor(dimenzija/2));
        		break;
		}
		ctx.stroke();

	}

	function crtajVrijeme(sat,minuta,sekunda)
	{
		var ctx = $("#naslovniCanvas").get(0).getContext("2d");
		var w = $("#naslovniCanvas").width();
		var h = $("#naslovniCanvas").height();
		
		var dimenzija = null;
		if(Math.floor(h/2) < Math.floor(w/16)) dimenzija = Math.floor(h/2);
		else dimenzija = Math.floor(w/16);

		crtajBroj(Math.floor(sat/10),w-7*dimenzija-30,Math.floor(h/2),dimenzija,"red");
		crtajBroj(sat%10,w-6*dimenzija-25,Math.floor(h/2),dimenzija,"red");

		crtajBroj(Math.floor(minuta/10),w-5*dimenzija-20,Math.floor(h/2),dimenzija,"blue");
		crtajBroj(minuta%10,w-4*dimenzija-15,Math.floor(h/2),dimenzija,"blue");

		crtajBroj(Math.floor(sekunda/10),w-3*dimenzija-10,Math.floor(h/2),dimenzija,"green");
		crtajBroj(sekunda%10,w-2*dimenzija-5,Math.floor(h/2),dimenzija,"green");
	}

	function crtajNaslovnu()
	{
		var width = window.innerWidth;
		var height = window.innerHeight;
		$("#naslovniCanvas").attr("width",width-10);
		$("#naslovniCanvas").attr("height",Math.floor(height/10));

		var ctx = $("#naslovniCanvas").get(0).getContext("2d");
		var w = $("#naslovniCanvas").width();
		var h = $("#naslovniCanvas").height();

		ctx.clearRect(0,0,w,w);	
		
		var velFonta = Math.min(Math.floor(h/2),Math.floor(w/21));
		ctx.font = velFonta + "px Arial";
		ctx.fillStyle = randomBoja();
		ctx.fillText("SUSTAV ZA IGRE",0,h/2);
		ctx.fillStyle = randomBoja();
		ctx.fillText("ONLINE",velFonta,h);
		
		ctx.fillStyle = "black";
		var datetime = new Date();
		//var datum = datetime.getDate() + "/" + (datetime.getMonth()+1)  + "/"  + datetime.getFullYear();
		
		//ctx.font = Math.floor(h/3) + "px Arial";
		//ctx.textAlign="right"; 
		//ctx.fillText(datum,w,Math.floor(h/3));
		crtajVrijeme(datetime.getHours(),datetime.getMinutes(),datetime.getSeconds());
	}


	function randomBoja() {
  	var boja = 'rgb('+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')';
  	return boja;
	}

	var element = '<p id="podaci" style="display:inline"> Created by: ';
	element += '<b text="red"> isschl </b>';
	element += ' Povratak: ';
	element += '<a href="..">';
	element += '<img src="../utils/data/homeButton.jpg"';
	element += ' id="returnPicture"';
	element += ' alt="HOME" border="0" />';
	element += '</a></p>';

	$("#zavrsni")
	.html(element)
	.css("font-size","120%")
	.append('<audio controls autoplay loop style="display:inline" ><source src="../utils/data/Song'+Math.floor(Math.random()*3+1)+'.mp3" type="audio/ogg">Your browser does not support the audio element.</audio>');

	namjesti();

	function namjesti()
	{
		$("#zavrsni")	
		.css("width",Math.floor($(window).width()*0.9))
		.css("height",Math.floor(($(window).height())*0.05));
		$("#returnPicture")
		.css("height",Math.floor(($(window).height())*0.05))
		.css("width",Math.floor(($(window).width())*0.05));
	}

	$( window ).resize(namjesti);


	$("body").on("click","#mojprofil",pokaziProfil);


	function pokaziProfil()
	{
		$("#profil").remove();
		$( "body" ).prepend( '<div id="profil" class="profil"></div>' );
		
		$( "#profil" )
		.css( "position" , "fixed" )
		.css( "z-index" , "2" )
  		.css( "width", "60%")
		.css( "height", "50%")
		.css( "padding", "2em")
		.css( "transform", "translate(-50%, -50%)")
    
		.css( "background-color" , "#555555" )
		.css( "left", "50%" )
		.css( "top", "50%" )
		.prepend('<button id="closeProfil" class = "profil" >X</button>');

		$( "#closeProfil" ) 
		.css("float","right")
		.css("background-color", "#f44336" )
		.mouseover(function() { $(this).css("background-color","blue"); })
		.mouseout(function() { $(this).css("background-color","red"); })
		.css( "border-width", "0px" )
		.css( "position" , "relative" )
		.css( "margin-left", "100%" )
		.css( "z-index" , "3" )
		.css( "width", "50px" )
		.css( "height",  "40px" );

		$.ajax(
		{
			url : "../utils/dajProfil.php",
			data : { kontakt : "ma moze" },
			type: "POST",
			success: function(data)
			{
			$("#profil").append('<div style="color:white; position:fixed; '
				+'padding:0; left:50%; top:50%; transform:'
				+'translate(-50%, -50%);" id="dodano">'
				+data+'</div>');
			},
			error: function(xhr, status)
			{
			if(status!==null)
				console.log("Error prilikom Ajax poziva: "+status);
			},
			async: false
		});
	}


	$( "body" ).on( "click", "div.profil #closeProfil", function()
	{
		$("#profil").css("display","none");
	});
	
} );
