$(document).ready(function(){
	//varijable za praćenje stanja sustava

	//je li igra počela
	var start = 0;
	//u kojem je stanju, npr. 1 ima glavu,...,6 obješen je!
	var stanje = 0;
	//prati koja su slova otkrivena
	var otkriveno = new Array();
	//prati koliko korisnik ima bodova - svako slovo 5 bodova
	var bodovi = 0;	

	//pamti koja su slova već iskorištena u pogađanju
	var iskoristenaSlova = new Array();
	//koja su slova dostupna za pogađanje
	var slova = ['a','b','c','d','e','f','g',
		     'h','i','j','k','l','m','n',
		     'o','p','r','s','t','u','v','z'];

	//koliko riječi je dostupno u bazi podataka
	var ukupnoRijeci = 0;
	//dohvaćena riječ iz baze
	var rijec = null;

	//pogledaj koliko je riječi dostupno u bazi
	$.ajax({ 
		url:"hangman.php", 
		data: { brojrijeci : 0 },
		type:"POST", 
		success: function(data) 
		{
			//spremi koliko je riječi dostupno u bazi
		  	ukupnoRijeci = parseInt(data); 
		},
		error: function(xhr, status)
		{ 
		if(status!==null) 
		console.log("Error prilikom Ajax poziva: "+status);
		}, 
		async: false
	});


	//tablica sa highscoreovima - prazna, kasnije će se popuniti
	var sadrzaj = '<p>Highscores</p>';
	sadrzaj += '<table><tr><th>r.br.</th>';
	sadrzaj += '<th>Ime igrača</th><th>Bodovi</th>';
	sadrzaj += '<tr id="prvi"></tr>';
	sadrzaj += '<tr id="drugi"></tr>';
	sadrzaj += '<tr id="treci"></tr>';
	sadrzaj += '<tr id="cetvrti"></tr>';
	sadrzaj += '<tr id="peti"></tr>';
	sadrzaj += '</table>';

	//da bi se čovjek njihao, treba mijenjati kut pod kojim se crta
	var kut = 0; //kasnije ide još *Math.PI
	//njiše li se nalijevo ili nadesno
	var smjer = 1;
	//za početak ili kasnije otkazivanje animacije(da samo visi)
	var anim = null;

	//crtaj čovječuljka na vješalu
	function crtajTruplo()
	{
		var ctx = $("#cnv").get(0).getContext("2d");

		//spremi stanje prije transformacija
		ctx.save();
		ctx.lineWidth = 4;
		if(start === 1)
		{
			//na početku je veći, ali tokom igre je manja slika!
			ctx.scale(0.7,0.7); 
			ctx.translate(50,0);
		}

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

		//dijelove čovječuljka crtam ovisno o stanju igre
		//naravno, prije početka je nacrtan cijeli

		//glava
		if(stanje>0 || start===0) 
			ctx.arc(0,30,30,1.5*Math.PI,3.5*Math.PI);
		ctx.translate(0,60);

		if(stanje>1 || start===0)
		{ 
			//truplo
			ctx.moveTo(0,0); 
			ctx.lineTo(0,100);
		}
		ctx.translate(0,30);

		//nadalje desno misli se na moje desno, slično za lijevo
		if(stanje>2 || start===0)
		{ 
			//desna ruka
			ctx.moveTo(0,0);
			ctx.lineTo(50,-50);
		}

		if(stanje>3 || start===0)
		{ 
			//lijeva ruka
			ctx.moveTo(0,0); 
			ctx.lineTo(-50,-50);
		} 
		ctx.translate(0,70);

		if(stanje>4 || start===0)
		{ 
			//desna noga
			ctx.moveTo(0,0); 
			ctx.lineTo(50,50);
		}

		if(stanje>5 || start===0)
		{ 
			//lijeva noga
			ctx.moveTo(0,0); 
			ctx.lineTo(-50,50);
		}
		ctx.stroke();
		//vrati stanje kakvo je bilo prije transformacija
		ctx.restore();

		//naslov igre
		ctx.fillStyle = "red";
		ctx.font = "50px Arial";
		if(start === 1) 
		{
			//tijekom igre naslov je manji
			ctx.save();
			ctx.translate(-10,50);
			ctx.fillText("The Hangman",270,100);
			ctx.restore();
		}
		else
		{
			//prije početka igre naslov je veći
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

		//kućice ili slova - ako je to slovo otkriveno
		if(start === 1)
		{
			var w = $("#cnv").width();
			var velicina = Math.floor(w/(rijec.length+2));
			ctx.font = velicina + "px Arial";
			ctx.save();
			ctx.translate(velicina,400-velicina-10);
			for( var i = 0; i < rijec.length; ++i )
			{
				//ako slovo nije otkriveno crtam kućicu
				if(otkriveno[i] === 0) {
				ctx.strokeRect(0,0,velicina,velicina);
				}

				else{
				ctx.fillText(rijec[i],
				Math.floor(velicina/4),3*Math.floor(velicina/4));
				}
		
				//pomak na sljedeću kućicu ili slovo
				ctx.translate(velicina, 0);			
			}
			ctx.restore();
		}
	}

	//povećaj ili smanji kut i crtaj čovječuljka - tako dobivam njihanje
	function crtajAnimaciju()
	{
		//npr. ako otišao previše ulijevo, njiši ga desno
		if( kut > 0.05*Math.PI ) smjer = -1;
		else if( kut < -0.05*Math.PI ) smjer = 1;
		kut += smjer*0.005*Math.PI;

		var h = $("#cnv").height();
		var w = $("#cnv").width();
		var ctx = $("#cnv").get(0).getContext("2d");
		ctx.clearRect(0,0,w,h); //očisti canvas, pa crtaj

		crtajTruplo();
	}

	//dodaj lijevo canvas na početku, a u desni div poruku dobrodošlice
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

		$("#right")
		.append('<p>Dobrodošli! Za početak kliknite '
			+ 'na <b style="color:green">START</b>.</p>');

	}

	//na početku nacrtaj ovo iznad opisano
	crtajPocetno();

	//reakcija na gumb probaj opet - vraća igru na početak
	$("body").on("click","#op",function()
	{
		start=0;
		crtajPocetno();
	});

	//kad se korisnik odjavi, resetiraj igru
	//da netko ne bi zlouporabio njegov rezultat
	$("body").on("click","#loginklasa2",function()
	{
		start=0;
		crtajPocetno();
	});

	//reakcija na gumb start
	$("body").on("click","#cnv",function(event)
	{
		//ali ne reagiramo tijekom igre!
		if(start === 0)
		{
			//pogledaj di je klik i je li klik na gumb
			var ctx=this.getContext("2d");
			var rect = this.getBoundingClientRect();
			var x = event.clientX - rect.left;
			var y = event.clientY - rect.top;
			if( x >= 310 && x <= 570 && y >= 180 && y <= 240 )
			{
				//ako je resetiraj stanje sustava i pokreni igru
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

	//dohvati neku riječ iz baze koja će se pogađati
	function dohvatiRijec()
	{
		//u bazi su po id-ju broj - random odaberi neku
		var broj = Math.floor(Math.random()*ukupnoRijeci+1);
		$.ajax(
		{
		url:"hangman.php",
		data: { idrijeci : broj },
		type:"POST",
		success: function(data)
		{
			//spremi dohvaćenu riječ
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

	//provjerava jesu li sav slova riječi otkrivena
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
			//ispiši poruku i dodaj gumbe za rezultate(spremi, dohvati...)
			var poruka = '<p>Izgleda da malo '
				+ '<i style="color:red">visite</i>.</p>'
				+ '<p>Tražena riječ je bila: '
				+ '<b style="color:green">'
				+ rijec
				+ '</b>. Osvojili se <b style="color:red">'
				+ bodovi
				+ '</b> bodova. Više sreće u drugom životu!</p>'
				+ '<input type="button" '
				+ 'value="Moj najbolji rezultat" id="btn1" />'
				+ '<p id="MojRezultat"> </p>'
				+ '<button id="btn2">'
				+ 'Spremi rezultat!</button>'
				+ ' <p id="PorukaRezultat"></p>'
				+ '<input type="button" class="button" id="op" '
				+ 'value="Probaj opet!"/>';

			//dodaj ovo iznad u desni div
			$("#right").html(poruka);

			//otrkij riječ do kraja(kad već korisnik nije)
			for(var i=0; i<rijec.length; ++i)
				otkriveno[i] = rijec[i];

			//dodaj desno praznu tablicu
			$("#right").append(sadrzaj);
			//ispuni tu tablicu najboljim rezultatima korisnika
			ispuniTablicu();

			//za to vrijeme, lijevo nacrtaj truplo
			var h = $("#cnv").height();
			var w = $("#cnv").width();
			var ctx = $("#cnv").get(0).getContext("2d");
			ctx.clearRect(0,0,w,h);
			crtajTruplo();
			start = 0;
		}
		else if( sve_otkriveno() ) //pobjeda
		{
			//kao gre, desno poruka, gumbi za rezultat, tablica,...
			var poruka = '<p>Čestitam! '
				+ '<i>Pogodili</i> ste riječ!'
				+ ' Imate <b style="color:green">'
				+ bodovi
				+ ' bodova</b>!<p>'
				+ '<input type="button" '
				+ 'value="Moj najbolji rezultat" id="btn1" />'
				+ '<p id="MojRezultat"> </p>'
				+ '<button id="btn2">'
				+ 'Spremi rezultat!</button> '
				+ '<p id="PorukaRezultat"></p>'
				+ '<input type="button" class="button" '
				+ 'id="op" value="Opet?"/>';
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
		else //igra još traje!
		{
		var h = $("#cnv").height();
		var w = $("#cnv").width();
		var ctx = $("#cnv").get(0).getContext("2d");
		ctx.clearRect(0,0,w,h);
		crtajTruplo();

		//prikaz korisniku (u desnom divu) koliko trenutno ima bodova
		var tipkovnica='<p>Trenutni bodovi: <b style="color:blue">'
			+bodovi+'</b></p>';
		
		//daj gumbe, ali samo neiskorištenih slova!
		for( i = 0; i < 22; ++i )
		{
			if(iskoristenaSlova.indexOf(slova[i]) === -1)
				tipkovnica += ' <input type="button" value="'
					+slova[i]+'" class="tipka" />';
		}
		$("#right").html(tipkovnica);
		}
	}

	//klik na gumb kojim korisnik odabire slovo za pogađanje
	$("body").on("click",".tipka",function(){
		//koje je odabrano slovo piše u value od gumba na koji je kliknuto
		var sl = $(this).val();
		//to slovo je iskorišteno
		iskoristenaSlova.push(sl);
		//pogledaj je li to slovo u riječi i svaku mu pojavu otkrij korisniku
		var ima = 0;
		for(var i=0; i<rijec.length; ++i)
		{
			if(rijec[i] === sl)
			{
				otkriveno[i] = sl;
				++ima;
			}
		}
		if( ima === 0 )	//nema tog slova, povećaj stanje (dod. dio tijela)
			++stanje;
		else bodovi += ima*5; //inače mu povećaj broj osvojenih bodova
		napraviKorak(); //idemo dalje
	});

	//ispunjava tablicu za highscoreove na toj igri
	function ispuniTablicu(){
		$.ajax(
		{
		url : "../utils/dohvatiListu.php",
		data : { title : "Hangman" },
		type: "POST",
		success: function(data)
		{
		$("#prvi").html('<td>1.</td><td>'
			+data.prviIgrac+'</td><td>'
			+data.prviBodovi+'</td>');
		$("#drugi").html('<td>2.</td><td>'
			+data.drugiIgrac+'</td><td>'
			+data.drugiBodovi+'</td>');
		$("#treci").html('<td>3.</td><td>'
			+data.treciIgrac+'</td><td>'
			+data.treciBodovi+'</td>');
		$("#cetvrti").html('<td>4.</td><td>'
			+data.cetvrtiIgrac+'</td><td>'
			+data.cetvrtiBodovi+'</td>');
		$("#peti").html('<td>5.</td><td>'
			+data.petiIgrac+'</td><td>'
			+data.petiBodovi+'</td>');
		},
		error: function(xhr, status)
		{
			if(status!==null) 
				console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
		});
	}
	
	//klikom na gumb spremi rezultat (+ iscrtaj sad već osvježenu tablicu bodova)
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


	//klikom na gumb moj rezultat dohvati korisnikov rezultat(ili ispiši poruku)
	//npr. ispisat će poruku - nemaš rezultat u toj igri
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

