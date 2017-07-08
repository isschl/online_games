$(document).ready(function(){
	
	var ukupnoPitanja = 0;
	var igraPocela = 0;
	var brojPitanja = 0;
	var bodovi = 0;
	var iskoristenaPitanja = new Array();
	var odgovor = " ";
	var tezina = " ";
	var odabranOdgovor = "E";

	pocetno();
	
	$("body").on("click","#loginklasa2",pocetno);

	function saznajBrojPitanja()
	{
		$.ajax(
		{
			url : "upitnik.php",
			data : { brojpitanja : "saznaj" },
			type: "POST",
			success: function(data)
			{
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

	function ispuniTablicu(){
		$.ajax(
		{
		url : "../utils/dohvatiListu.php",
		data : { title : "Upitnik" },
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

	function ispuniLijevo(){
	var sadrzaj = '<p>Highscores</p>';
	sadrzaj += '<table><tr><th>r.br.</th>';
	sadrzaj += '<th>Ime igrača</th><th>Bodovi</th>';
	sadrzaj += '<tr id="prvi"></tr>';
	sadrzaj += '<tr id="drugi"></tr>';
	sadrzaj += '<tr id="treci"></tr>';
	sadrzaj += '<tr id="cetvrti"></tr>';
	sadrzaj += '<tr id="peti"></tr>';
	sadrzaj += '</table>';
	sadrzaj += '<input type="button" class="button" value="Start the game" id="start"/>';
	$("#left").html(sadrzaj);
	ispuniTablicu();
	}

	function pocetno(){
	ispuniLijevo();
	$("#right").html('<p>Za početak kliknite na <em style="color:green">Start the game</em>.</p>');
	$("#start").css("background-color","#4CAF50");
	}
	
	$("body")
	.on("mouseenter","#start",function(){
		$("#start").css("background-color","blue");})
	.on("mouseleave","#start",function(){
		$("#start").css("background-color","#4CAF50");})
	.on("click","#start",function(){
		$("#left").html('<div id="question"></div><div id="answer"></div><div id="kontrola"></div>');
		igraPocela = 1;
		brojPitanja = 1;
		bodovi = 0;
		iskoristenaPitanja = new Array();
		dajPitanje();
	});

	saznajBrojPitanja();

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


	$("body").on("click","#btn1",function(){
	$.ajax(
	{
		url : "../utils/dohvatiRezultat.php",
		data : { title : "Upitnik" },
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

	function dajPitanje()
	{
		if(brojPitanja > 15) 
		{
			var poruka = '<p> Čestitam, ukupno ste osvojili ';
			poruka += '<b style="color:red">'+bodovi+' bodova.</b></p>';
			poruka += '<input type="button" value="Moj najbolji rezultat" id="btn1" />';
			poruka += '<p id="MojRezultat"> </p>';
			poruka += '<button id="btn2">';
			poruka += 'Spremi rezultat!</button> <p id="PorukaRezultat"></p>';
			$("#right").html(poruka);
			ispuniLijevo();
			$("#start").css("background-color","#4CAF50");
		}
		else {
	
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
				.html('<div class="checkodg"><input type="radio" val="A" name="n" class="klasa">' +
				data.odgovorA + '</div><br/><div class="checkodg"><input type="radio" val="B" name="n" class="klasa">' +
				data.odgovorB + '</div><br/><div class="checkodg"><input type="radio" val="C" name="n" class="klasa">' +
				data.odgovorC + '</div><br/><div class="checkodg"><input type="radio" val="D" name="n" class="klasa">' +
				data.odgovorD+'</div>');
			},
			error: function(xhr, status)
			{
				if(status!==null) 
					console.log("Error prilikom Ajax poziva: "+status);
			},
			async: false
		});
		
		var poruka = '<p>Nalazite se na pitanju ';
		poruka += '<b style="color:blue">' + brojPitanja + '/' + ukupnoPitanja + '</b>';
		poruka += ' Pitanje je klasificirano kao: ';
		if( tezina === 'l' ) poruka += 'lagano';
		else if( tezina === 's' ) poruka += 'srednje te&#382;ine';
		else if( tezina === 't' ) poruka += 'te&#353;ko';
		else poruka += 'nije poznata te&#382;ina pitanja';
		poruka += '.<p>';
		poruka += '<p id="osvojeno"> Trenutno osvojeni bodovi: <b style="color:red">';
		poruka += bodovi + '</b>.</p>';
			
		$("#right").html(poruka);

		poruka = '<input type="button" class="button"';
		poruka += ' style="background-color: green"';
		poruka += ' value="Odaberi odgovor" id="ponudiOdgovor"/>';
		$("#kontrola").html(poruka);

		++brojPitanja;
		iskoristenaPitanja.push(indeksPitanja);
		odabranOdgovor = "E";	
	}
	}

	$("body").on('change', 'input.klasa', function() {
		if(igraPocela !== 0){
     		odabranOdgovor = $(this).attr("val");
		$("#ponudiOdgovor")
		.attr('value','Odaberi '+odabranOdgovor)
		.css('background-color','orange')
		.css('color','black');
		}
	});

	$("body").on('click', '#ponudiOdgovor', function() {
		if(igraPocela === 0)
		{
			igraPocela = 1;
			dajPitanje();
		}
     		else if(odabranOdgovor === "E")
			alert('Morate odabrati neki odgovor');
		else
		{ 
			var poruka = " ";
			if(odabranOdgovor === odgovor)
			{
				bod = 0;
				if( tezina === 'l' ) bod= 5;
				else if( tezina === 's' ) bod = 10;
				else if( tezina === 't' ) bod = 15;
				else bod = 5;
				poruka = '<p style="color:green">';
				poruka += 'To&#269;an odgovor! Osvojiste ';
				poruka += bod + ' bodova!</p>';
				bodovi += bod;
			}
			else
			{
				poruka = '<p style="color:red">';
				poruka += 'Neto&#269;an odgovor! Odgovor je: ';
				poruka += odgovor + '! Vi&#353;e sre&#263;e drugi put!</p>';
			}
			$("#right").append(poruka);
			igraPocela = 0;
			$("#ponudiOdgovor")
				.attr('value',"Sljedeće pitanje")
				.css('background-color','black')
				.css('color','white');
		}
	});
});
