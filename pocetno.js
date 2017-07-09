$(document).ready(function(){
	var centarx = new Array();
	var centary = new Array();
	var radijusi = new Array();
	var kolicina = null;
	var boje = new Array();
	var brzine = new Array();
	var w = null;
	var h = null;
	var smjerovi = new Array();

	var stoperica = null;
	var stanje_pozadine = 1;
	
	var polozajTekstax = null;
	var polozajTekstay = null;

	var polozajBoxax = null;
	var polozajBoxay = null;
	var sirinaBoxa = null;
	var visinaBoxa = null;
	


	$("body").on("click","#cnv",function(event)
	{
		if(stanje_pozadine === 1)
		{
			$("body").css("background-color","black");
			stanje_pozadine = 1 - stanje_pozadine;
		}
		else
		{
			var ctx = this.getContext("2d");
			var rect = this.getBoundingClientRect();
			var x = event.clientX - rect.left;
			var y = event.clientY - rect.top;
			if( x >= polozajBoxax && x <= polozajBoxax+sirinaBoxa && y >= polozajBoxay && y <= polozajBoxay+visinaBoxa )
			{
				window.open("glavni_izbornik","_self");
			}
			else
			{
		 		$("body").css("background-color","white");
				stanje_pozadine = 1 - stanje_pozadine;
			}	
		}
	});

	function napraviCanvas()
	{
		centarx = new Array();
		centary = new Array();
		radijusi = new Array();
		boje = new Array();
		smjerovi = new Array();
		brzine = new Array();
		
		if(stoperica !== null) clearInterval(stoperica);	

		$("#content")
		.html('<canvas height="'+Math.floor(0.95*$(window).height())
		+'" width="'+Math.floor(0.95*$(window).width())
		+'" id="cnv"> Canvas nije podržan.'
		+'<a href="glavni_izbornik"> Ulazak na stranicu </a>'
		+'</canvas>');

		w = $("#cnv").width();
		h = $("#cnv").height();

		kolicina = Math.floor(Math.random()*10+20);

		var i = null;
		for( i = 0; i < kolicina; ++i )
		{
			var radijus = Math.floor(Math.random()*Math.min(w,h)/20+10);
			radijusi.push(radijus);
			centarx.push(Math.floor(Math.random()*(w-2*radijus))+radijus);
			centary.push(Math.floor(Math.random()*(h-2*radijus))+radijus);
			brzine.push(Math.floor(Math.random()*3)+1);
			boje.push('rgb('+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+','+Math.floor(Math.random()*256)+')');
			smjerovi.push(1);
		}

		stoperica = setInterval(crtaj,60);

		var ctx = $("#cnv").get(0).getContext("2d");		
		ctx.font = Math.floor(Math.min(w,h)/25)+"px Arial";

		polozajTekstax = Math.floor(Math.random()*w/4);
		polozajTekstay = Math.floor(Math.random()*h/2+Math.floor(Math.min(w,h)/20));

		
		polozajBoxax = Math.floor(w*2/6);
		polozajBoxay = Math.floor(h*2/6);
		sirinaBoxa = Math.floor(w/3);
		visinaBoxa = Math.floor(h/3);

		}

	
		napraviCanvas();
		$(window).on("resize",napraviCanvas);


		function crtaj()
		{
			var ctx = $("#cnv").get(0).getContext("2d");		
			ctx.clearRect(0,0,w,h);
			ctx.strokeText("Click and come to the DARK SIDE...", polozajTekstax, polozajTekstay);

			if( stanje_pozadine == 0 )
			{
				ctx.fillStyle = "red";
				ctx.fillRect(polozajBoxax,polozajBoxay,sirinaBoxa,visinaBoxa);
				ctx.save();
				ctx.fillStyle = "white";
				ctx.textAlign = "center";
				ctx.font = Math.floor(Math.min(visinaBoxa/2.5,sirinaBoxa/4))  + "px Arial";
				ctx.fillText("ULAZ",w/2,h/2);
				ctx.restore();
			}

			for(var i = 0; i<kolicina; ++i)
			{
				if(centary[i]+radijusi[i]>=h) 
					smjerovi[i] = -1;
				else if(centary[i]-radijusi[i]<=0) 
					smjerovi[i] = 1;
				centary[i] += smjerovi[i]*brzine[i];

				ctx.beginPath();
				ctx.fillStyle = boje[i];
				ctx.arc(centarx[i],centary[i],radijusi[i],-Math.PI/2,1.5*Math.PI);
				ctx.fill();
			}

		}	
});
