/*======================================================================================================================
                                    Staza functionality implementation
======================================================================================================================*/

/*===============================================  GLOBAL VARIABLES  =================================================*/
var container;
var highscores = [];

// add and fill canvas element
var Canvas_width;
var Canvas_height;
var Canvas;
var ctx;
var pocetna_pozicija = [5,200];
var trenutna_pozicija;
var vrijeme_zadnjeg_poteza, vrijeme_pocetka, vrijeme_kraja;
var dozvoljen_potez = false; // potez nije dozvoljen dok ne prođe bar 2 sekunde od prethodnog poteza

var stanje_bez_kruznice;
var zadnjih16pozicija = []; // možda i manje ako ih dosad nije bilo 16

var upper_points = [[0,162], [115,64], [195,43], [206,31], [266,48], [296,88], [293,116], [320,189], [313,205], [284,212], [264,230], [351,291], [377,297],
					[398,289], [406,187], [420,158], [464,137], [497,134], [512,123], [559,116], [580,119], [595,137], [601,206], [632,229], [648,223], [712,120],
					[748,96], [768,70], [792,65], [822,80], [833,141], [863,193], [874,197], [889,228], [917,246], [945,247], [968,225], [1027,61], [1052,40],
					[1084,37], [1104,43], [1144,89], [1165,136], [1164,164], [1164,164], [1124,194], [1101,198], [1093,210], [1095,228], [1121,247], [1145,253],
					[1181,237], [1200,216]];

var lower_points = [[0,225], [120,114], [160,92], [198,88], [207,77], [271,87], [284,109], [251,231], [263,282], [313,319], [371,327], [429,309], [458,266],
					[456,235], [426,212], [435,179], [495,155], [544,163], [586,228], [643,268], [708,273], [745,246], [749,201], [723,150], [724,128], [761,109],
					[789,111], [810,137], [819,165], [835,177], [875,257], [919,287], [975,290], [997,257], [997,239], [1006,224], [1022,166], [1053,102], [1056,77],
					[1077,64], [1092,74], [1110,149], [1072,200], [1069,225], [1078,249], [1123,279], [1200,253]];

if (upper_points[0][0]!==0 || upper_points[upper_points.length-1][0]!==1200 || lower_points[0][0]!==0 || lower_points[lower_points.length-1][0]!==1200)
	throw("Greška! Put ne ide od lijevog do desnog ruba.");
	
var staza = lower_points.concat(upper_points.reverse());
staza.push(staza[0]);

var vrijeme_zadnjeg_poteza;

function drawMenu()
{
    // clear container's current content
    container.empty();
    // append 4 menu buttons
    container.append("<div id='play' class='menuButtons' onclick='drawPlay()'>" + "IGRAJ</div>");
    container.append("<div id='highscores' class='menuButtons' onclick='drawHighscores()'>" + "REZULTATI</div>");
	container.append("<div id='help' class='menuButtons' onclick='drawHelp()'>" + "POMOĆ</div>");
}

function drawPlay()
{
    // clear container's current content
    container.empty();
	
	// add and fill canvas element
	Canvas_width = 1200;
	Canvas_height = 400;
	Canvas = $("<canvas width='" + Canvas_width + "' height='" + Canvas_height + " id='staza_canvas' style='display: block; margin: 0 auto;'></canvas>");
	ctx = Canvas.get(0).getContext("2d");

	Canvas.appendTo(container);
	nacrtajStazu();
	
	zadnjih16pozicija = [];
	vrijeme_pocetka = Date.now();
	pomakni_na_poziciju(pocetna_pozicija);
	ctx.beginPath();
    ctx.arc(trenutna_pozicija[0], trenutna_pozicija[1], 4, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
	
	// when mouse button is clicked and held
    Canvas.on('mousedown', function(e)
    {
	  var x = e.offsetX;
	  var y = e.offsetY;
	  var dx,dy;
	  dx = x-trenutna_pozicija[0];
	  dy = y-trenutna_pozicija[1];
	  if (kvadrat(dx)+kvadrat(dy)<230) // u krugu radijusa 15
	  {
		  obradiKlik(x,y);
	  }
    });
	
	//
	Canvas.on('mousemove', function(e)
	{
	  var x = e.offsetX;
	  var y = e.offsetY;
	  var dx,dy;
	  dx = x-trenutna_pozicija[0];
	  dy = y-trenutna_pozicija[1];
	  ctx.putImageData(stanje_bez_kruznice,0,0);
	  
	  ctx.beginPath();
	  ctx.arc(trenutna_pozicija[0], trenutna_pozicija[1], 15, 0, 2 * Math.PI, false);
      ctx.strokeStyle = dozvoljen_potez ? "#0000FF" : '#FF0000';
      ctx.stroke();
	  
	  if (kvadrat(dx)+kvadrat(dy)<230) // u krugu radijusa 15
	  {
		  var norma = Math.sqrt(kvadrat(dx)+kvadrat(dy));
		  ctx.beginPath();
		  ctx.moveTo(trenutna_pozicija[0],trenutna_pozicija[1]);
		  ctx.lineTo(trenutna_pozicija[0]+15*dx/norma,trenutna_pozicija[1]+15*dy/norma);
		  ctx.strokeStyle = '#0000FF';
		  ctx.stroke();
	  }
	})

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "Povratak</div>");
}

function drawHighscores()
{
    // clear container's current content
    container.empty();

    crtajTablicu();

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "back to menu</div>");
}

function crtajTablicu()
{
	container.empty();
	
	var sadrzaj = '<table><tr><th>r.br.</th>';
	sadrzaj += '<th>Ime igrača</th><th>Bodovi</th></tr>';
	sadrzaj += '<tr id="prvi"></tr>';
	sadrzaj += '<tr id="drugi"></tr>';
	sadrzaj += '<tr id="treci"></tr>';
	sadrzaj += '<tr id="cetvrti"></tr>';
	sadrzaj += '<tr id="peti"></tr>';
	sadrzaj += '</table>';
	container.html(sadrzaj);
	ispuniTablicu();
	
	// append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "back to menu</div>");
}

function ispuniTablicu()
{
	$.ajax(
	{
		url : "../utils/dohvatiListu.php",
		data : { title : "Staza" },
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
	
function drawSettings()
{
    // clear container's current content
    container.empty();

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "back to menu</div>");
}

function drawHelp()
{
    // clear container's current content
    container.empty();
	
	container.append("<div id='helpText'></div>");
    var str = "Prijeđi put u što kraćem vremenu krećući se ravnim linijama.<br />"+
			  "Smjer sljedeće linije odabire se klikom unutar plavog kruga.<br />"+
			  "Između poteza treba proći barem 2 sekunde (prije toga je krug crven) <br />";
    $("#helpText").append(str);

    // append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "back to menu</div>");
}

$(document).ready( function()
{
    container = $("#gameContainer");
    drawMenu();
});

function nacrtajStazu()
{
	ctx.rect(0, 0, Canvas_width, Canvas_height);
	ctx.fillStyle = "#CCFFCC";
	ctx.fill();
	
	ctx.beginPath();
	ctx.moveTo(staza[0][0], staza[0][1]);
	for (var i=1; i<staza.length; ++i)
		ctx.lineTo(staza[i][0], staza[i][1]);
	ctx.strokeStyle = "black";
	ctx.stroke();
	
	ctx.fillStyle = "#FFFFFF";
	ctx.beginPath();
	ctx.moveTo(staza[0][0], staza[0][1]);
	for (var i=1; i<staza.length; ++i)
		ctx.lineTo(staza[i][0], staza[i][1]);
	ctx.closePath();
	ctx.fill();
}

/*mičemo točku za jediničnu dužinu u odgovarajućem smjeru dok ona ne izađe iz staze*/
function obradiKlik (x,y)
{
	if (x===trenutna_pozicija[0] && y===trenutna_pozicija[1])
		return;
	
	var dx = x-trenutna_pozicija[0];
	var dy = y-trenutna_pozicija[1];
	
	var norma = Math.sqrt(kvadrat(dx)+kvadrat(dy));
	var jx = dx/norma;
	var jy = dy/norma;
	var jxcijeli;
	var jycijeli;
	
	var tx=trenutna_pozicija[0], ty=trenutna_pozicija[1];
	
	jxcijeli = Math.round(tx+5*jx);
	jycijeli = Math.round(ty+5*jy);
	if (je_u_stazi(jxcijeli,jycijeli))
	{
		tx += 5*jx;
		ty += 5*jy;
		while(true)
		{
			jxcijeli = Math.round(tx+jx);
			jycijeli = Math.round(ty+jy);
			if (!je_u_stazi(jxcijeli,jycijeli))
				break;
			tx += jx;
			ty += jy;
		}
	}
	tx = Math.round(tx);
	ty = Math.round(ty);
	
	if ((tx!==trenutna_pozicija[0] || ty!==trenutna_pozicija[1]) && dozvoljen_potez===true)
	{
		pomakni_na_poziciju([jxcijeli,jycijeli]);
		if (jxcijeli === 1200)
			gameOver();
	}
	
	//console.log(trenutna_pozicija);
}

/* staza je zapravo mnogokut, saznajemo je li točka u stazi na način da nađemo najbližu rubnu točku i po njoj sve odredimo (ovisno o tome
 je li to točka na liniji ili unutar neke stranice) */
function je_u_stazi (x,y)
{
	if (x<=0 || x>=1200)
		return false;
	
	var najblize = nadi_najblizi (x, y);
	var a,b,c,dx1,dy1,dx2,dy2,i;
	
	if (najblize.najmanja_udaljenost<Number.EPSILON)
	{
		//console.log("[1] "+najblize.najblizi_indeks+"  "+staza[najblize.najblizi_indeks]+"  "+staza[najblize.najblizi_indeks+1]);
		return false;
	}
	else if (najblize.rub!==false)
	{
		i = najblize.rub;
		if (i===0)
			a = staza[staza.length-1];
		else
			a = staza[i-1];
		b = staza[i];
		if (i===staza.length-1)
			c = staza[0];
		else
			c = staza[i+1];
		
		dx1 = b[0]-a[0];
		dy1 = b[1]-a[1];
		dx2 = c[0]-a[0];
		dy2 = c[1]-a[1];
		
		//console.log("[2] "+najblize.najblizi_indeks+"  a="+a+"  b="+b+"  c="+c+"  dx1="+dx1+"  dy1="+dy1+"  dx2="+dx2+"  dy2="+dy2);
		return (dx1*dy2-dy1*dx2>0);
	}
	else
	{
		i = najblize.najblizi_indeks;
		a = staza[i];
		b = [x,y];
		c = staza[i+1];
		
		dx1 = b[0]-a[0];
		dy1 = b[1]-a[1];
		dx2 = c[0]-a[0];
		dy2 = c[1]-a[1];
		
		//console.log("[3] "+najblize.najblizi_indeks+"  a="+a+"  b="+b+"  c="+c+"  dx1="+dx1+"  dy1="+dy1+"  dx2="+dx2+"  dy2="+dy2);
		return (dx1*dy2-dy1*dx2>0);
	}
}

function nadi_najblizi (x, y)
{
	var udaljenost;
	var min_udaljenost = 1200;
	var mini = false;
	var min_rub=false;
	var rub;
	var dx1,dy1,dx2,dy2;
	for (i=0; i<staza.length-1; ++i)
	{
		dx1 = x - staza[i][0];
		dy1 = y - staza[i][1];
		dx2 = staza[i+1][0] - staza[i][0];
		dy2 = staza[i+1][1] - staza[i][1];
		if (dx1*dx2+dy1*dy2<0)
		{
			udaljenost = Math.sqrt(kvadrat(dx1)+kvadrat(dy1)); // najbliža točka dužine je točka niz[i]
			rub = i;
		}
		else
		{
			dx1 = x - staza[i+1][0];
			dy1 = y - staza[i+1][1];
			dx2 = staza[i][0] - staza[i+1][0];
			dy2 = staza[i][1] - staza[i+1][1];
			if (dx1*dx2+dy1*dy2<0)
			{
				udaljenost = Math.sqrt(kvadrat(dx1)+kvadrat(dy1)); // najbliža točka dužine je točka niz[i+1]
				rub = i+1;
			}
			else
			{
				udaljenost = Math.abs(dx1*dy2-dx2*dy1)/Math.sqrt(kvadrat(dx2)+kvadrat(dy2)); // računamo udaljenost dužine od pravca
				rub = false;
			}
		}
		if (udaljenost<min_udaljenost)
		{
			mini = i;
			min_udaljenost = udaljenost;
			min_rub = rub;
		}
	}
	return{
		najblizi_indeks: mini,
		najmanja_udaljenost: min_udaljenost,
		rub: min_rub
	};
}

function pomakni_na_poziciju(nova_pozicija)
{
	trenutna_pozicija = nova_pozicija;
	nacrtajStazu();
	
	zadnjih16pozicija.push(trenutna_pozicija);
	if (zadnjih16pozicija.length > 16)
		zadnjih16pozicija.shift();
	var rg=0x00;
	for (i=zadnjih16pozicija.length-2; i>=0; --i)
	{
		ctx.beginPath();
		ctx.moveTo(zadnjih16pozicija[i+1][0],zadnjih16pozicija[i+1][1]);
		ctx.lineTo(zadnjih16pozicija[i][0],zadnjih16pozicija[i][1]);
		ctx.strokeStyle=getHexColor(rg,rg,0xFF);
		ctx.stroke();
		rg += 0x11;
	}
	
	stanje_bez_kruznice = ctx.getImageData(0,0,1200,400);
	
	ctx.beginPath();
    ctx.arc(trenutna_pozicija[0], trenutna_pozicija[1], 15, 0, 2 * Math.PI, false);
    ctx.strokeStyle = '#FF0000';
    ctx.stroke();
	
	vrijeme_zadnjeg_poteza = Date.now();
	dozvoljen_potez = false;
	setTimeout(function()
	{
		ctx.beginPath();
		ctx.arc(trenutna_pozicija[0], trenutna_pozicija[1], 15, 0, 2 * Math.PI, false);
		ctx.strokeStyle = '#0000FF';
		ctx.stroke();
		dozvoljen_potez = true;
	},2000);
}

function getHexColor(r,g,b)
{
    return "#"+('000000'+((r*0x10000+g*0x100+b)>>>0).toString(16)).slice(-6);
}

function kvadrat(x)
{
	return x*x;
}

function gameOver()
{
	vrijeme_kraja = Date.now();
	var trajanje_igre = vrijeme_kraja-vrijeme_pocetka;
	var bodovi = Math.max(0,Math.round(1000-trajanje_igre/100));
	
	container.empty();
	container.append("<div id='gameOver''>" + "GOTOVO <br />"+
					"trajanje igre: "+trajanje_igre/1000+" s <br />"+
					"broj bodova: "+bodovi+"<br />");
	$.ajax(
	{
		url : " ../utils/dohvatiRezultat.php ",
		data : { title : "Staza" },
		success: function(data)
		{
			$("#gameOver").append("moj najbolji rezultat: "+data);
		},
		error: function(xhr, status)
		{
		if(status!==null)
			console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
	});
	container.append("</div>");
	
	container.append("<div id='saveResult' onclick='saveResult("+bodovi+")'> Spremi rezultat </div>");
	
	// append back to menu button
    container.append("<div id='back' onclick='drawMenu()'>" + "Povratak</div>");
}

function saveResult(bodovi)
{
	$.ajax(
	{
		url : "../utils/spremiRezultat.php ",
		data : { title : "Staza", score : bodovi },
		success: function(data)
		{
			console.log(data);
			container.empty();
			container.append("<div id='gameOver''>" + data + "</div>");
			container.append("<div id='back' onclick='drawMenu()'>" + "Povratak</div>");
		},	
		error: function(xhr, status)
		{
		if(status!==null)
		console.log("Error prilikom Ajax poziva: "+status);
		},
		async: false
	});
}