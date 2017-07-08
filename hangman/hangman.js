$(document).ready(function(){
	var start = 0;
	var stanje = 0;
	var otkriveno = new Array();
	var bodovi = 0;	

	var iskoristenaSlova = new Array();
	var slova = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','r','s','t','u','v','z'];

	var ukupnoRijeci = 0;
	var rijec = null;
	$.ajax( { url:"hangman.php", data: { brojrijeci : 0 },
		  type:"POST", success: function(data) {
		  ukupnoRijeci = parseInt(data); }, error: function(xhr, status)
		  { if(status!==null) console.log("Error prilikom Ajax poziva: "+status);
		  }, async: false });


	var sadrzaj = '<p>Highscores</p>';
	sadrzaj += '<table><tr><th>r.br.</th>';
	sadrzaj += '<th>Ime igrača</th><th>Bodovi</th>';
	sadrzaj += '<tr id="prvi"></tr>';
	sadrzaj += '<tr id="drugi"></tr>';
	sadrzaj += '<tr id="treci"></tr>';
	sadrzaj += '<tr id="cetvrti"></tr>';
	sadrzaj += '<tr id="peti"></tr>';
	sadrzaj += '</table>';

	var kut = 0; //kasnije ide još *Math.PI
	var smjer = 1;
	var anim = null;
	function crtajTruplo()
	{
		var ctx = $("#cnv").get(0).getContext("2d");

		ctx.save();
		ctx.lineWidth = 4;
		if(start === 1) {ctx.scale(0.7,0.7); ctx.translate(50,0);}
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
		if(stanje>0 || start===0) 
			ctx.arc(0,30,30,1.5*Math.PI,3.5*Math.PI); //glava
		ctx.translate(0,60);
		if(stanje>1 || start===0)
		{ ctx.moveTo(0,0); ctx.lineTo(0,100);} //truplo
		ctx.translate(0,30);
		//nadalje desno misli se na moje desno, slično za lijevo
		if(stanje>2 || start===0)
		{ ctx.moveTo(0,0); ctx.lineTo(50,-50);} //desna ruka
		if(stanje>3 || start===0)
		{ ctx.moveTo(0,0); ctx.lineTo(-50,-50);} //lijeva ruka
		ctx.translate(0,70);
		if(stanje>4 || start===0)
		{ ctx.moveTo(0,0); ctx.lineTo(50,50);} //desna noga
		if(stanje>5 || start===0)
		{ ctx.moveTo(0,0); ctx.lineTo(-50,50);} //lijeva noga
		ctx.stroke();
		ctx.restore();

		//naslov igre
		ctx.fillStyle = "red";
		ctx.font = "50px Arial";
		if(start === 1) 
		{
			ctx.save();
			ctx.translate(-10,50);
			ctx.fillText("The Hangman",270,100);
			ctx.restore();
		}
		else
		{
			ctx.fillText("The Hangman",270,100);
		}
	
		//gumb start
		if(start === 0)
		{
			ctx.fillStyle = "green";
			ctx.fillRect(310,180,260,60);
			ctx.fillStyle = "white";
			ctx.lineWidth = 6;
			ctx.font = "50px Arial";
			ctx.fillText("S T A R T",330,230);
		}
		//kućice ili slova
		if(start === 1)
		{
			var w = $("#cnv").width();
			var velicina = Math.floor(w/(rijec.length+2));
			ctx.font = velicina + "px Arial";
			ctx.save();
			ctx.translate(velicina,400-velicina-10);
			for( var i = 0; i < rijec.length; ++i )
			{
				if(otkriveno[i] === 0)
					ctx.strokeRect(0,0,velicina,velicina);
				else
					ctx.fillText(rijec[i],Math.floor(velicina/4),3*Math.floor(velicina/4));
				ctx.translate(velicina, 0);			
			}
			ctx.restore();
		}
	}

	function crtajAnimaciju()
	{
		if( kut > 0.05*Math.PI ) smjer = -1;
		else if( kut < -0.05*Math.PI ) smjer = 1;
		kut += smjer*0.005*Math.PI;

		var h = $("#cnv").height();
		var w = $("#cnv").width();
		var ctx = $("#cnv").get(0).getContext("2d");
		ctx.clearRect(0,0,w,h);

		crtajTruplo();
	}

	function crtajPocetno()
	{
		start = 0;
		var cnvs = '<canvas height="400" width="600" ';
		cnvs += 'id="cnv" style="border:1px solid black"> ';
		cnvs += 'Canvas nije podržan! </canvas>';
		$("#left").html(cnvs);
		
		$("#right").html(sadrzaj);
		ispuniTablicu();
		
		anim = setInterval(crtajAnimaciju, 100);

		$("#right").append('<p>Dobrodošli! Za početak kliknite na <b style="color:green">START</b>.</p>');

	}

	crtajPocetno();

	$("body").on("click","#op",function()
		{
			start=0;
			crtajPocetno();
		});

	$("body").on("click","#loginklasa2",function(){start=0;crtajPocetno();});

	//reakcija na gumb start
	$("body").on("click","#cnv",function(event)
	{
		if(start === 0)
		{
			var ctx=this.getContext("2d");
			var rect = this.getBoundingClientRect();
			var x = event.clientX - rect.left;
			var y = event.clientY - rect.top;
			if( x >= 310 && x <= 570 && y >= 180 && y <= 240 )
			{
				start = 1;
				kut = 0;
				clearInterval(anim);
				dohvatiRijec();
				stanje = 0;
				otkriveno = new Array();
				for(var i = 0; i < rijec.length; ++i)
					otkriveno.push(0);
				bodovi = 0;	
				iskoristenaSlova = new Array();
				napraviKorak();
			}
		}
	});

	function dohvatiRijec()
	{
		var broj = Math.floor(Math.random()*ukupnoRijeci+1);
		$.ajax(
		{
		url:"hangman.php",
		data: { idrijeci : broj },
		type:"POST",
		success: function(data)
		{
			rijec = data.rijec;
		},
		error: function(xhr, status)
		{
			if(status!==null)
			console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
		});
	}

	function sve_otkriveno()
	{
		for( var i = 0; i < rijec.length; ++i )
		{
			if(otkriveno[i] === 0) return false;
		}
		return true;
	}

	function napraviKorak()
	{
		if( stanje === 6 ) //obješen
		{
			var poruka = '<p>Izgleda da malo <i style="color:red">visite</i>.</p>';
			poruka += '<p>Tražena riječ je bila: <b style="color:green">';
			poruka += rijec+'</b>. Osvojili se <b style="color:red">'+bodovi;
			poruka += '</b> bodova. Više sreće u drugom životu!</p>';
			poruka += '<input type="button" value="Moj najbolji rezultat" id="btn1" />';
			poruka += '<p id="MojRezultat"> </p>';
			poruka += '<button id="btn2">';
			poruka += 'Spremi rezultat!</button> <p id="PorukaRezultat"></p>';
			poruka += '<input type="button" class="button" id="op" value="Probaj opet!"/>';
			$("#right").html(poruka);
			for(var i=0; i<rijec.length; ++i)
				otkriveno[i] = rijec[i];
			$("#right").append(sadrzaj);
			ispuniTablicu();
			var h = $("#cnv").height();
			var w = $("#cnv").width();
			var ctx = $("#cnv").get(0).getContext("2d");
			ctx.clearRect(0,0,w,h);
			crtajTruplo();
			start = 0;
		}
		else if( sve_otkriveno() ) //pobjeda
		{
			var poruka = '<p>Čestitam! <i>Pogodili</i> ste riječ!';
			poruka += ' Imate <b style="color:green">'+bodovi+' bodova</b>!<p>';
			poruka += '<input type="button" value="Moj najbolji rezultat" id="btn1" />';
			poruka += '<p id="MojRezultat"> </p>';
			poruka += '<button id="btn2">';
			poruka += 'Spremi rezultat!</button> <p id="PorukaRezultat"></p>';
			poruka += '<input type="button" class="button" id="op" value="Opet?"/>';
			$("#right").html(poruka);
			$("#right").append(sadrzaj);
			ispuniTablicu();
			var h = $("#cnv").height();
			var w = $("#cnv").width();
			var ctx = $("#cnv").get(0).getContext("2d");
			ctx.clearRect(0,0,w,h);
			crtajTruplo();
			start = 0;
		}	
		else
		{
		var h = $("#cnv").height();
		var w = $("#cnv").width();
		var ctx = $("#cnv").get(0).getContext("2d");
		ctx.clearRect(0,0,w,h);
		crtajTruplo();
		var tipkovnica='<p>Trenutni bodovi: <b style="color:blue">'+bodovi+'</b></p>';
		for( i = 0; i < 22; ++i )
		{
			if(iskoristenaSlova.indexOf(slova[i]) === -1)
				tipkovnica += ' <input type="button" value="'+slova[i]+'" class="tipka" />';
		}
		$("#right").html(tipkovnica);
		}
	}

	$("body").on("click",".tipka",function(){
		var sl = $(this).val();
		iskoristenaSlova.push(sl);
		var ima = 0;
		for(var i=0; i<rijec.length; ++i)
		{
			if(rijec[i] === sl)
			{
				otkriveno[i] = sl;
				++ima;
			}
		}
		if( ima === 0 )
			++stanje;
		else bodovi += ima*5;
		napraviKorak();
	});

	function ispuniTablicu(){
		$.ajax(
		{
		url : "../utils/dohvatiListu.php",
		data : { title : "Hangman" },
		type: "POST",
		success: function(data)
		{
		$("#prvi").html('<td>1.</td><td>'+data.prviIgrac+'</td><td>'+data.prviBodovi+'</td>');
		$("#drugi").html('<td>2.</td><td>'+data.drugiIgrac+'</td><td>'+data.drugiBodovi+'</td>');
		$("#treci").html('<td>3.</td><td>'+data.treciIgrac+'</td><td>'+data.treciBodovi+'</td>');
		$("#cetvrti").html('<td>4.</td><td>'+data.cetvrtiIgrac+'</td><td>'+data.cetvrtiBodovi+'</td>');
		$("#peti").html('<td>5.</td><td>'+data.petiIgrac+'</td><td>'+data.petiBodovi+'</td>');
		},
		error: function(xhr, status)
		{
			if(status!==null) 
				console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
		});
	}
	
	$("body").on("click","#btn2",function(){
	$.ajax(
	{
		url : "../utils/spremiRezultat.php",
		data : { title : "Hangman", score : bodovi },
		success: function(data)
		{
			$("#PorukaRezultat").html(data);
			ispuniTablicu();
		},
		error: function(xhr, status)
		{
			if(status!==null)
				console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
	});
	});


	$("body").on("click","#btn1",function(){
	$.ajax(
	{
		url : "../utils/dohvatiRezultat.php",
		data : { title : "Hangman" },
		success: function(data)
		{
			$("#MojRezultat").html(data);
		},
		error: function(xhr, status)
		{
			if(status!==null) 
				console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
	});
	});

});
