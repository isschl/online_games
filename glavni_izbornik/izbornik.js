$(document).ready(function(){
	
	var kut = 0; //kasnije ide još *Math.PI	
	var smjer = 1;
	var animVjesala = setInterval(crtajAnimaciju, 100);
	var animKrizic = setInterval(crtajKrizic,500);
	var animUpitnik = setInterval(crtajUpitnik, 1000);
	var animStaza = setInterval(crtajStazu, 100);
	var animSudoku = setInterval(crtajSudoku,700);

	var brojPolja = 0;
	var naRedu = 1;
	var ispunjena = new Array();
	var bojePolja = new Array();
	var boja1 = "rgb(0,0,255)";
	var boja2 = "rgb(255,0,0)";

	var slova = ['A','B','C','D'];

	

	function crtajTruplo()
	{
		var ctx = $("#vjesala").get(0).getContext("2d");

		ctx.save();
		ctx.lineWidth = 4;
		ctx.scale(0.5,0.5); ctx.translate(35,0);
		ctx.beginPath();
		ctx.moveTo(10,350); ctx.lineTo(110,350); //baza
		ctx.moveTo(60,350); ctx.lineTo(60,50); //štap
		ctx.lineTo(210,50);//greda

		ctx.translate(210,50);
		ctx.rotate(kut);
		
		ctx.moveTo(0,0);
		ctx.lineTo(0,40); //kuka
		ctx.translate(0,40);
		ctx.moveTo(0,0); 
		ctx.arc(0,30,30,1.5*Math.PI,3.5*Math.PI); //glava
		ctx.translate(0,60);
		ctx.moveTo(0,0); ctx.lineTo(0,100); //truplo
		ctx.translate(0,30);
		//nadalje desno misli se na moje desno, slično za lijevo
		ctx.moveTo(0,0); ctx.lineTo(50,-50); //desna ruka
		ctx.moveTo(0,0); ctx.lineTo(-50,-50); //lijeva ruka
		ctx.translate(0,70);
		ctx.moveTo(0,0); ctx.lineTo(50,50); //desna noga
		ctx.moveTo(0,0); ctx.lineTo(-50,50); //lijeva noga
		ctx.stroke();
		ctx.restore();
		
	}

	function crtajAnimaciju()
	{
		if( kut > 0.05*Math.PI ) smjer = -1;
		else if( kut < -0.05*Math.PI ) smjer = 1;
		kut += smjer*0.005*Math.PI;

		var h = $("#vjesala").height();
		var w = $("#vjesala").width();
		var ctx = $("#vjesala").get(0).getContext("2d");
		ctx.clearRect(0,0,w,h);

		crtajTruplo();
	}

	function crtajKrizic()
	{
		//isprazni canvas
		var ctx=$("#krizic").get(0).getContext("2d");
		var w = $("#krizic").width();
		var h = $("#krizic").height();
		ctx.clearRect(0,0,w,h);
	
		//treba li crtati iznova?
		if(brojPolja === 9)
		{
			brojPolja = 0;
			ispunjena = new Array();
			bojePolja = new Array();
			boja1 = "rgb("+Math.floor(Math.random()*256)
				+","+Math.floor(Math.random()*256)
				+","+Math.floor(Math.random()*256)+")";
			boja2 = "rgb("+Math.floor(Math.random()*256)
				+","+Math.floor(Math.random()*256)
				+","+Math.floor(Math.random()*256)+")";
		}

		//odaberi neobojano random polje od 0 do 8
		var kojePolje = Math.floor(Math.random()*9);
		while( ispunjena.indexOf(kojePolje) !== -1 )
			kojePolje = Math.floor(Math.random()*9);
		ispunjena.push(kojePolje);


		//koja je boja za polje
		if( naRedu === 1 )
			bojePolja.push(boja1);
		else
			bojePolja.push(boja2);

		//oboji polja do sad ispunjena
		for( var i = 0; i < ispunjena.length; ++i)
		{
			var redak = Math.floor(ispunjena[i]/3);
			var stupac = ispunjena[i]%3;
			ctx.fillStyle = bojePolja[i];
			ctx.fillRect(Math.floor(redak*h/3),Math.floor(stupac*w/3),Math.floor(w/3),Math.floor(h/3));
		}

		//iscrtaj vodoravne i okomite crte
		ctx.lineWidth = 3;
		ctx.beginPath();
		
		ctx.moveTo(0,Math.floor(h/3));
		ctx.lineTo(w,Math.floor(h/3));
		ctx.moveTo(0,Math.floor(2*h/3));
		ctx.lineTo(w,Math.floor(2*h/3));

		ctx.moveTo(Math.floor(w/3),0);
		ctx.lineTo(Math.floor(w/3),h);
		ctx.moveTo(Math.floor(2*w/3),0);
		ctx.lineTo(Math.floor(2*w/3),h);

		ctx.stroke();

		//promijeni stanje sustava
		++brojPolja;
		naRedu = 1 - naRedu;	
	}

	function crtajUpitnik()
	{
		//isprazni canvas
		var ctx=$("#upitnik").get(0).getContext("2d");
		var w = $("#upitnik").width();
		var h = $("#upitnik").height();
		ctx.clearRect(0,0,w,h);

		ctx.font= Math.floor(h/5)+"px Arial";
		ctx.textAlign = "center";
		ctx.lineWidth = 3;
		var odabran = Math.floor(Math.random()*4);

		for(var i = 0; i < 4; ++i)
		{
			if( i === odabran )
				ctx.fillStyle = "green";
			else
				ctx.fillStyle = "black";

			ctx.fillText(slova[i],Math.floor(3*w/4),Math.floor((i+1)*h/4-h/24));

			if( i === odabran )
			{	
				ctx.fillRect(Math.floor(w/4),Math.floor(i*h/4+h/24),Math.floor(w/5),Math.floor(h/6));
			}
			ctx.strokeRect(Math.floor(w/4),Math.floor(i*h/4+h/24),Math.floor(w/5),Math.floor(h/6));
				
			//crtaj upitnik kod odabranog odgovora
			if( i === odabran )
			{
				ctx.fillStyle = "red";
				ctx.fillText("?",Math.floor(w/8),Math.floor((i+1)*h/4-h/24));
			}
		}
	
	}

	var tockex = new Array();
	var tockey = new Array();
	var boje = new Array();
	var novax = 0;
	var novay = 0;
	var smjerx = 1;
	var smjery = 1;
	var begin = 0;

	function predznak(varijabla)
	{
		if(varijabla > 0)
			return 1;
		else return -1;
	}

	function crtajStazu()
	{
		//isprazni canvas
		var ctx=$("#staza").get(0).getContext("2d");
		var w = $("#staza").width();
		var h = $("#staza").height();
		ctx.clearRect(0,0,w,h);
	
		if( tockex.length >= 10 || begin === 0)
		{
			begin = 1;
			tockex = new Array();
			tockey = new Array();
			boje = new Array();
			if(Math.floor(Math.random()*2) === 1)
				smjerx = Math.floor(Math.random()*5+2);
			else
				smjerx = - Math.floor(Math.random()*5+2);
			if(Math.floor(Math.random()*2) === 1)
				smjery = Math.floor(Math.random()*5+2);
			else
				smjery = - Math.floor(Math.random()*5+2);

			var randomBoja = "rgb("+Math.floor(Math.random()*256)
				+","+Math.floor(Math.random()*256)
				+","+Math.floor(Math.random()*256)+")";
			boje.push(randomBoja);

			novax = Math.floor(Math.random()*(w/4)+w/4);
			novay = Math.floor(Math.random()*(h/4)+h/4);
			tockex.push(novax);
			tockey.push(novay);
		}
		
		ctx.lineWidth = 5;		

		var i = 0;
		for( i = 0; i < tockex.length-1; ++i )
		{
			ctx.beginPath();
			ctx.strokeStyle = boje[i];
			ctx.moveTo(tockex[i],tockey[i]);
			ctx.lineTo(tockex[i+1],tockey[i+1]);
			ctx.stroke();
		}
		
		ctx.beginPath();
		ctx.strokeStyle = boje[i];
		ctx.moveTo(tockex[i],tockey[i]);

		if( novax+smjerx >= w || novax+smjerx <= 0 ) 
		{
			smjerx = (-1)*predznak(smjerx)*Math.floor(Math.random()*5+2);
			smjery = predznak(smjery)*Math.floor(Math.random()*5+2);
			var randomBoja = "rgb("+Math.floor(Math.random()*256)
				+","+Math.floor(Math.random()*256)
				+","+Math.floor(Math.random()*256)+")";
			boje.push(randomBoja);
			tockex.push(novax);
			tockey.push(novay);

		}
		if( novay+smjery >= h || novay+smjery <= 0 ) 
		{
			smjerx = predznak(smjerx)*Math.floor(Math.random()*5+2);
			smjery = (-1)*predznak(smjery)*Math.floor(Math.random()*5+2);
			var randomBoja = "rgb("+Math.floor(Math.random()*256)
				+","+Math.floor(Math.random()*256)
				+","+Math.floor(Math.random()*256);
			boje.push(randomBoja);
			tockex.push(novax);
			tockey.push(novay);
		}
		
		novax += smjerx;
		novay += smjery;

		ctx.lineTo(novax,novay);

		ctx.stroke();

	}

	var brojSudokuPolja = 0;
	var ispunjenaSudokuPolja = new Array();

	function crtajSudoku()
	{
		//isprazni canvas
		var ctx=$("#sudoku").get(0).getContext("2d");
		var w = $("#sudoku").width();
		var h = $("#sudoku").height();
		ctx.clearRect(0,0,w,h);
	
		//treba li crtati iznova?
		if(brojSudokuPolja === 9)
		{
			brojSudokuPolja = 0;
			ispunjenaSudokuPolja = new Array();
		}

		//odaberi neobojano random polje od 0 do 8
		var kojePolje = Math.floor(Math.random()*9);
		while( ispunjenaSudokuPolja.indexOf(kojePolje) !== -1 )
			kojePolje = Math.floor(Math.random()*9);
		ispunjenaSudokuPolja.push(kojePolje);

		//upiši u polja do sad ispunjena
		for( var i = 0; i < ispunjenaSudokuPolja.length; ++i)
		{
			var redak = Math.floor(ispunjenaSudokuPolja[i]/3);
			var stupac = ispunjenaSudokuPolja[i]%3;
			ctx.fillStyle = "red";
			ctx.font = Math.floor(Math.min(h/3,w/3))+"px Arial";
			ctx.fillText(i+1,Math.floor(redak*h/3)+5,Math.floor((stupac+1)*w/3)-5);
		}

		//iscrtaj vodoravne i okomite crte
		ctx.lineWidth = 3;
		ctx.beginPath();
		
		ctx.moveTo(0,Math.floor(h/3));
		ctx.lineTo(w,Math.floor(h/3));
		ctx.moveTo(0,Math.floor(2*h/3));
		ctx.lineTo(w,Math.floor(2*h/3));

		ctx.moveTo(Math.floor(w/3),0);
		ctx.lineTo(Math.floor(w/3),h);
		ctx.moveTo(Math.floor(2*w/3),0);
		ctx.lineTo(Math.floor(2*w/3),h);

		ctx.stroke();

		//promijeni stanje sustava
		++brojSudokuPolja;	
	}



	
	$("#vjesala").on("click",function()
	{
		window.open("../hangman","_self");
	});
	$("#krizic").on("click",function()
	{
		window.open("../Tic-Tac-NO","_self");
	});
	$("#staza").on("click",function()
	{
		window.open("../staza","_self");
	});
	$("#upitnik").on("click",function()
	{
		window.open("../upitnik","_self");
	});
	$("#sudoku").on("click",function()
	{
		window.open("../sudoku","_self");
	});
	
	$("#informacije")
		.hide()
		.css("background-color","rgb(249, 249, 249)")
		.css("position","absolute")
		.css("width","200");

	$(".igra").on("mouseenter",function(){
		var x = $(this).position().left;
		var y = $(this).position().top+200;

		$("#informacije").html($( "."+$(this).attr("id") ).html());
		
		$("#informacije").show();
		$("#informacije")
		.css("left",x)
		.css("top",y);
	});

	$(".igra").on("mouseleave",function(){
		$("#informacije").hide();
	});


	$("#traka").css("height",Math.floor( $(window).height()/2 )+"px");
	$("#traka").css("cursor","pointer");

	var promjenaSlike = setInterval(mijenjajSliku, 2000);
	var redniBrojSlike = -1;
	var opis = ["naslovna slika","slika za Tic-Tac-NO","slika za Vješala","slika za Stazu","slika za Upitnik"];
	mijenjajSliku();

	function mijenjajSliku()
	{
		redniBrojSlike = (redniBrojSlike+1)%6;
		$("#traka").html('<img src="../utils/data/igra' + redniBrojSlike
		+ '.png" alt="' + opis[redniBrojSlike] + '" '
		+ 'style=" max-width:100%; max-height:100%; '
		+ 'display: block; margin-left: auto; margin-right: auto;'
		+ '" />' );
	}

	$(window).on("resize",function()
	{
		$("#traka").css("height",Math.floor( $(window).height()/2 )+"px");
	});

	$("#traka").on("click",function(){
		switch(redniBrojSlike) {
    			case 1:
				window.open("../Tic-Tac-NO","_self");
        			break;
    			case 2:
				window.open("../hangman","_self");
        			break;
			case 3:
				window.open("../staza","_self");
        			break;
			case 4:
				window.open("../upitnik","_self");
        			break;
			case 5:
				window.open("../sudoku","_self");
        			break;
    			default:
        			window.open("..","_self");
		}
	});
	
});	
