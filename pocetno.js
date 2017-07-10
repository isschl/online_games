$(document).ready(function(){

	//varijable potrebne za praćenje stanja sustava

	//x koordinata centra pojedine kugle
	var centarx = new Array();
	//y koordinata centra pojedine kugle
	var centary = new Array();
	//radijus pojedine kugle
	var radijusi = new Array();
	//koliko ima kugala
	var kolicina = null;
	//boja pojedine kugle
	var boje = new Array();
	//brzina pojedine kugle
	//npr. 2 znači u svakom pozivu +ili-2 se pomakne
	var brzine = new Array();
	//širina prozora i visina prozora
	var w = null;
	var h = null;
	//smjer pojedine kugle: 1 je dolje, -1 gore
	var smjerovi = new Array();

	var stoperica = null;
	//je li pozadina bijela ili crna
	var stanje_pozadine = 1;
	
	//gdje je tekst Click... (svaki put drugo mjesto)
	var polozajTekstax = null;
	var polozajTekstay = null;

	//gdje je gumb za ulaz
	var polozajBoxax = null;
	var polozajBoxay = null;
	var sirinaBoxa = null;
	var visinaBoxa = null;
	


	$("body").on("click","#cnv",function(event)
	{
		if(stanje_pozadine === 1)
		{
			//crna pozadina i promijeni u stanje za ispis gumba ulaz
			$("body").css("background-color","black");
			stanje_pozadine = 1 - stanje_pozadine;
		}
		else
		{
			//inače već je pozadina crna i ispisan je gumba
			var ctx = this.getContext("2d");
			var rect = this.getBoundingClientRect();
			var x = event.clientX - rect.left;
			var y = event.clientY - rect.top;
			//ako je gumb kliknut odi na glavni izbornik
			if( x >= polozajBoxax && x <= polozajBoxax+sirinaBoxa && y >= polozajBoxay && y <= polozajBoxay+visinaBoxa )
			{
				window.open("glavni_izbornik","_self");
			}
			else
			{
				//vrati se u početno stanje (i bijela pozadina)
		 		$("body").css("background-color","white");
				stanje_pozadine = 1 - stanje_pozadine;
			}	
		}
	});

	function napraviCanvas()
	{
		//resetiraj stanje sustava
		centarx = new Array();
		centary = new Array();
		radijusi = new Array();
		boje = new Array();
		smjerovi = new Array();
		brzine = new Array();
		
		if(stoperica !== null) clearInterval(stoperica);	

		//canvas prilagođen dimenzijama prozora
		$("#content")
		.html('<canvas height="'+Math.floor(0.95*$(window).height())
		+'" width="'+Math.floor(0.95*$(window).width())
		+'" id="cnv"> Canvas nije podržan.'
		+'<a href="glavni_izbornik"> Ulazak na stranicu </a>'
		+'</canvas>');

		w = $("#cnv").width();
		h = $("#cnv").height();

		//broj kugli određen random(od 20 do 29 komada)
		kolicina = Math.floor(Math.random()*10+20);

		var i = null;
		for( i = 0; i < kolicina; ++i )
		{
			//radom položaji,radijusi,brzine,smjerovi kugala
			var radijus = Math.floor(Math.random()*Math.min(w,h)/20+10);
			radijusi.push(radijus);
			centarx.push(Math.floor(Math.random()*(w-2*radijus))+radijus);
			centary.push(Math.floor(Math.random()*(h-2*radijus))+radijus);
			brzine.push(Math.floor(Math.random()*3)+1);
			boje.push('rgb('+Math.floor(Math.random()*256)
				+','+Math.floor(Math.random()*256)+','
				+Math.floor(Math.random()*256)+')');

			//na početku sve padaju (kao da smo ih pustili iz ruke)
			smjerovi.push(1);
		}

		//crtaj kugle svakih 60 milisekundi
		stoperica = setInterval(crtaj,60);

		var ctx = $("#cnv").get(0).getContext("2d");		
		ctx.font = Math.floor(Math.min(w,h)/25)+"px Arial";

		//određen radom položaj teksta Click...
		polozajTekstax = Math.floor(Math.random()*w/4);
		polozajTekstay = Math.floor(Math.random()*h/2
				+ Math.floor(Math.min(w,h)/20));

		
		polozajBoxax = Math.floor(w*2/6);
		polozajBoxay = Math.floor(h*2/6);
		sirinaBoxa = Math.floor(w/3);
		visinaBoxa = Math.floor(h/3);

		}

	
		//iscrtaj na početku
		napraviCanvas();
		
		//kad se promijeni prozor, sve resetiraj(da se pripaše dimenzija)
		$(window).on("resize",napraviCanvas);


		
		function crtaj()
		{
			var ctx = $("#cnv").get(0).getContext("2d");		
			ctx.clearRect(0,0,w,h); //očisti canvas
			ctx.strokeText("Click and come to the DARK SIDE...",
					polozajTekstax, polozajTekstay);

			if( stanje_pozadine == 0 )
			{
				//napravi crveni gumba sa tekstom ULAZ
				//ali samo ako smo na tzv. dark side
				ctx.fillStyle = "red";
				ctx.fillRect( polozajBoxax,polozajBoxay,
					      sirinaBoxa,visinaBoxa);
				ctx.save();
				ctx.fillStyle = "white";
				ctx.textAlign = "center";
				ctx.font = Math.floor(Math.min(visinaBoxa/2.5,sirinaBoxa/4))
					   + "px Arial";
				ctx.fillText("ULAZ",w/2,h/2);
				ctx.restore();
			}

			for(var i = 0; i<kolicina; ++i)
			{
				//pomakni kuglu, ali ne preko ekrana!
				//dakle gledaj udaljenost središta od ruba i radijus
				if(centary[i]+radijusi[i]>=h) 
					smjerovi[i] = -1;
				else if(centary[i]-radijusi[i]<=0) 
					smjerovi[i] = 1;
				//pomakni kuglu, kolika joj je već brzina
				centary[i] += smjerovi[i]*brzine[i];

				ctx.beginPath();
				ctx.fillStyle = boje[i];
				ctx.arc(centarx[i],centary[i],
					radijusi[i],-Math.PI/2,1.5*Math.PI);
				ctx.fill();
			}

		}	
});
