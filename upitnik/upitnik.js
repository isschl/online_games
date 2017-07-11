$(document).ready(function(){
	
	//varijable potrebne za praćenje stanja sustava

	//koliko pitanja ima u bazi
	var ukupnoPitanja = 0;
	//je li u tijeku odgovaranje na neko pitanje
	var igraPocela = 0;
	//na kojem je po redu pitanju
	var brojPitanja = 0;
	//koliko je dosad u igri osvojio bodova
	var bodovi = 0;
	//koja pitanja(tj. njihovi id-ovi u bazi) su iskorištena
	var iskoristenaPitanja = new Array();
	//koji je točan odgovor(A,B,C ili D)
	var odgovor = " ";
	//koja je težina pitanja(t,l,s) - teško,lako,srednje
	var tezina = " ";
	//koji je odgovor korisnik odabrao(prije klika nepostojeći,npr.E)
	var odabranOdgovor = "E";

	//na početku, iscrtaj početno stanje(vidi fju pocetno)
	pocetno();
	
	//kad korisnik napravi logout, resetiraj stvari(vrati na početno)
	$("body").on("click","#loginklasa2",pocetno);

	//prvo saznaj koliko pitanja imaš u bazi dostupno
	function saznajBrojPitanja()
	{
		$.ajax(
		{
			url : "upitnik.php",
			data : { brojpitanja : "saznaj" },
			type: "POST",
			success: function(data)
			{
				//spremi koliko u bazi ima pitanja
				ukupnoPitanja = parseInt(data);
			},
			error: function(xhr, status)
			{
				if(status!==null) 
				console.log("Error prilikom Ajax poziva: "+status);
			},
			async: false
		});

	}

	//ispuni tablicu za highscoreove
	function ispuniTablicu(){
		$.ajax(
		{
		url : "../utils/dohvatiListu.php",
		data : { title : "Upitnik" },
		type: "POST",
		success: function(data)
		{
		$("#prvi").html('<td>1.</td><td>'
			+ data.prviIgrac  + '</td><td>'
			+ data.prviBodovi + '</td>');
		$("#drugi").html('<td>2.</td><td>'
			+ data.drugiIgrac  + '</td><td>'
			+ data.drugiBodovi + '</td>');
		$("#treci").html('<td>3.</td><td>'
			+ data.treciIgrac  + '</td><td>'
			+ data.treciBodovi + '</td>');
		$("#cetvrti").html('<td>4.</td><td>'
			+ data.cetvrtiIgrac  + '</td><td>'
			+ data.cetvrtiBodovi + '</td>');
		$("#peti").html('<td>5.</td><td>'
			+ data.petiIgrac  + '</td><td>'
			+ data.petiBodovi + '</td>');
		},
		error: function(xhr, status)
		{
			if(status!==null) 
			console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
		});
	}

	//napravi praznu tablicu za highscoreove, dodaj je u lijevi div i ispuni
	function ispuniLijevo()
	{
		var sadrzaj = '<p>Highscores</p>'
			+ '<table><tr><th>r.br.</th>'
			+ '<th>Ime igrača</th><th>Bodovi</th>'
			+ '<tr id="prvi"></tr>'
			+ '<tr id="drugi"></tr>'
			+ '<tr id="treci"></tr>'
			+ '<tr id="cetvrti"></tr>'
			+ '<tr id="peti"></tr>'
			+ '</table>'
			+ '<input type="button" class="button" '
			+ 'value="Start the game" id="start"/>';
		$("#left").html(sadrzaj);

		//oboji gumb za start u zeleno
		$("#start").css("background-color","#4CAF50");

		ispuniTablicu();
	}

	//crtaj početno stanje - u lijevi div ovo iznad
	//u desni uputu za klik na start
	function pocetno(){
		ispuniLijevo();
		$("#right")
		.html('<p>Za početak kliknite na '
			+ '<em style="color:green">Start the game</em>.</p>');
	}
	
	//malo efekata u smislu promjene boje za gumb start
	$("body")
	.on("mouseenter","#start",function(){
		$("#start").css("background-color","blue");})
	.on("mouseleave","#start",function(){
		$("#start").css("background-color","#4CAF50");})
	.on("click","#start",function(){

		//što se dogodi kad se klikne na gumb start
		//u ovo lijevo će se ispisivati pitanja, odgovori i gumbi
		$("#left")
		.html('<div id="question"></div><div id="answer">'
			+ '</div><div id="kontrola"></div>');
		//igra je počela, na 1. smo pitanju, osvojenih bodova imamo 0
		igraPocela = 1;
		brojPitanja = 1;
		bodovi = 0;
		//još nismo iskoristili niti jedno pitanje
		iskoristenaPitanja = new Array();
		//sad ćemo uzeti neko pitanje
		dajPitanje();
	});

	//pozovem fju da znam koliko je pitanja dostupno u bazi
	saznajBrojPitanja();

	//reakcija na klik za spremanje rezultata - spremi korisnikova rezultat
	//te ispuni lijevo - tako da imam osvježenu tablicu rezultata
	$("body").on("click","#btn2",function(){
	$.ajax(
	{
		url : "../utils/spremiRezultat.php",
		data : { title : "Upitnik", score : bodovi },
		success: function(data)
		{
			$("#PorukaRezultat").html(data);
			ispuniLijevo();
		},
		error: function(xhr, status)
		{
			if(status!==null)
			  console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
	});
	});


	//reakcija na klik za dohvaćanje rezultata za korisnika (podatak iz sessiona)
	//i danu igru čiji naziv šaljem
	$("body").on("click","#btn1",function(){
	$.ajax(
	{
		url : "../utils/dohvatiRezultat.php",
		data : { title : "Upitnik" },
		success: function(data)
		{
			//upiši u p tag s id-jem MojRezultat odbiveno
			//a dobili smo ili broj bodova, ili poruku npr. nemaš rezultat
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

	function dajPitanje()
	{
		//ako je došao preko 15, znači kraj - sva pitanja su odgovorena
		if(brojPitanja > 15) 
		{
			//desno poruka o pobjedi, lijevo kao na početku -
			//tablica sa rezultatima i gumb start
			var poruka = '<p> Čestitam, ukupno ste osvojili '
				+ '<b style="color:red">'
				+ bodovi 
				+' bodova.</b></p>'
				+ '<input type="button" value="'
				+ 'Moj najbolji rezultat" id="btn1" />'
				+ '<p id="MojRezultat"> </p>'
				+ '<button id="btn2">'
				+ 'Spremi rezultat!</button>'
				+ ' <p id="PorukaRezultat"></p>';
			$("#right").html(poruka);
			ispuniLijevo();
		}
		else //ako još nije gotovo daj sljedeće pitanje
		{
		//uzmi slučajan, još neiskorišten id od koliko je pitanja u bazi
		//i onda to pitanje dohvati iz baze
		var indeksPitanja = Math.floor(Math.random()*ukupnoPitanja);

		while(iskoristenaPitanja.indexOf(indeksPitanja) > -1)
			indeksPitanja = Math.floor(Math.random()*ukupnoPitanja);
	
		$.ajax(
		{
			url : "upitnik.php",
			data : { idpitanja : indeksPitanja },
			type: "POST",
			success: function(data)
			{
			  odgovor = data.odgovor;
			  tezina = data.tezina;
			  $("#question").html(data.pitanje);
			  $("#answer")
			  .html('<div class="checkodg">'
			    + '<input type="radio" val="A" name="n" class="klasa">' 
			    + data.odgovorA 
			    + '</div><br/><div class="checkodg"><input type="radio"'
			    + ' val="B" name="n" class="klasa">' 
			    + data.odgovorB
			    + '</div><br/><div class="checkodg"><input type="radio"'
			    + ' val="C" name="n" class="klasa">' 
			    + data.odgovorC 
			    + '</div><br/><div class="checkodg"><input type="radio"'
			    + ' val="D" name="n" class="klasa">' 
			    + data.odgovorD+'</div>');
			},
			error: function(xhr, status)
			{
				if(status!==null) 
					console.log("Error prilikom Ajax poziva: "+status);
			},
			async: false
		});
		
		//ispiši u desni div na kojem smo pitanju, težinu pitanja,
		//te koliko bodova je dosad sakupljeno

		var poruka = '<p>Nalazite se na pitanju '
			+ '<b style="color:blue">' 
			+ brojPitanja + '/15 </b>'
			+ ' Pitanje je klasificirano kao: ';
		if( tezina === 'l' ) poruka += 'lagano';
		else if( tezina === 's' ) 
			poruka += 'srednje te&#382;ine';
		else if( tezina === 't' ) 
			poruka += 'te&#353;ko';
		else 
			poruka += 'nije poznata te&#382;ina pitanja';
		poruka += '.<p>';
		poruka += '<p id="osvojeno">';
		poruka += ' Trenutno osvojeni bodovi: <b style="color:red">';
		poruka += bodovi + '</b>.</p>';
			
		$("#right").html(poruka);

		//što je ispisano na gumbu 
		//(ovdje Odaberi odgovor-tek smo postavili pitanje)
		poruka = '<input type="button" class="button"';
		poruka += ' style="background-color: green"';
		poruka += ' value="Odaberi odgovor" id="ponudiOdgovor"/>';
		$("#kontrola").html(poruka);

		//povećaj broj pitanja(td. sljedeći put smo na novom)
		++brojPitanja;
		//id trenutnog pitanja smo iskoristili
		iskoristenaPitanja.push(indeksPitanja);
		//korisnik još nije odabrao odgovor(tj.odabrao je nepostojeći)
		odabranOdgovor = "E";	
		} //ovdje je zatvoren onaj else kod: ako još nije gotovo...
	}

	//reakcija na klik na neki od ponuđenih odgovora
	$("body").on('change', 'input.klasa', function() {
		//ali samo ako je u tijeku odgovaranje na neko pitanje
		if(igraPocela !== 0)
		{
			//u value je koji je odgovor odabran(npr. A)
     			odabranOdgovor = $(this).attr("val");
			//u ovisnosti o tome promijeni gumba
			//npr. za taj A, na gumbu: Odaberi A
			$("#ponudiOdgovor")
			.attr('value','Odaberi '+odabranOdgovor)
			.css('background-color','orange')
			.css('color','black');
		}
	});

	//klik na gumb u lijevom divu (početak igre, ponudi odgovor,...)
	$("body").on('click', '#ponudiOdgovor', function() {
		//na početku, to je gumb za start
		if(igraPocela === 0)
		{
			igraPocela = 1;
			dajPitanje();
		}
		//inače traje igra, ako nije odabran niti jedan odgovor A,...,D
		//onda alertaj igrača - ne može na sljedeće pitanje bez odgovora
     		else if(odabranOdgovor === "E")
			alert('Morate odabrati neki odgovor');
		else
		{ 
			//inače, imam neki odgovor, A,...,D, vidi je li točan
			var poruka = " ";
			if(odabranOdgovor === odgovor)
			{
				//odabran je točan odgovor
				var bod = 0;
				//broj bodova ovisno o težini
				if( tezina === 'l' ) bod= 5;
				else if( tezina === 's' ) bod = 10;
				else if( tezina === 't' ) bod = 15;
				else bod = 5;
				poruka = '<p style="color:green">'
					+ 'To&#269;an odgovor! Osvojiste '
					+ bod + ' bodova!</p>';
				//povećaj mu broj bodova
				bodovi += bod;
			}
			else
			{
				//inače, odgovor je netočan, nema bodova
				poruka = '<p style="color:red">'
				 + 'Neto&#269;an odgovor! Odgovor je: '
				 + odgovor 
				 + '! Vi&#353;e sre&#263;e drugi put!</p>';
			}
			//u desni div daj gore sastavljenu poruku 
			$("#right").append(poruka);

			//završeno je odgovaranje na trenutno pitanje
			igraPocela = 0;
			//na gumb stavi natpis: Sljedeće pitanje
			$("#ponudiOdgovor")
				.attr('value',"Sljedeće pitanje")
				.css('background-color','black')
				.css('color','white');
		}
	});
});
