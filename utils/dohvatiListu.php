<?php

/* radimo ljestvicu najboljih 5 igrača u danoj igri
   ideja: ako je dan naziv igre, dohvati sve rezultate za tu igru
   ali u padajućem poretku(DESC) - prvih 5 je najboljih 5!
   Što ako ih nema 5 za danu igru - vidi komentar u kodu na tom mjestu. */


require_once 'db.class.php';


function sendJSONandExit($message)
{
	header('Content-type: application/json; charset=utf-8');
	echo json_encode($message);
	flush();
	exit(0);
}


if(isset($_POST['title']))
{
	//pročitaj iz posta za koju igru tražiš rezultate
	$imeIgre = $_POST['title'];

	$db = DB::getConnection();

	try
	{
		$st = $db->prepare( "SELECT * FROM rezultati "
			. "WHERE title LIKE :title ORDER BY score DESC");
		$st->execute( array( 'title' => $imeIgre ) );
	}
	catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }
	
	//brojim do 5 - toliko igrača i rezultata trebam
	$broj = 0;

	/* ako nema toliko (5) igrača za tu igru, tada se vraćaju anonimne životinje
	ideja došla od google docs-a, ime je Anonimna + slučajan string koji
	predstavlja neku životinju, a broj bodova je naravno 0 */

	$anonimni = array('AnonimnaLisica','AnonimnaGazela','AnonimniTarzan',
			'AnonimniVuk','AnonimniPatak','AnonimnaPanda');

	//ispremiješaj životinje, uzimam ih po redu (kolko treba)
	shuffle($anonimni); 

	//uzimam životinje od početka, kolko treba, dakle od indeksa 0
	$indeks = 0;
	
	$message = [];
	while($row = $st->fetch())
	{
		//dok ne dobiješ 5 igrača, idi redom po rezultatima
		if( $broj === 0 )
		{
			$message['prviIgrac'] = $row['username'];
			$message['prviBodovi'] = $row['score'];
		}
		else if( $broj === 1 )
		{
			$message['drugiIgrac'] = $row['username'];
			$message['drugiBodovi'] = $row['score'];
		}
		else if( $broj === 2 )
		{
			$message['treciIgrac'] = $row['username'];
			$message['treciBodovi'] = $row['score'];
		}
		else if( $broj === 3 )
		{
			$message['cetvrtiIgrac'] = $row['username'];
			$message['cetvrtiBodovi'] = $row['score'];
		}
		else if( $broj === 4 )
		{
			$message['petiIgrac'] = $row['username'];
			$message['petiBodovi'] = $row['score'];
		}
		else break;
		++$broj;
	}

	//ostatk nadopuni anonimnim životinjama
	while($broj < 5)
	{
		if( $broj === 0 )
		{
			$message['prviIgrac'] = $anonimni[$indeks];
			$message['prviBodovi'] = 0;
		}
		else if( $broj === 1 )
		{
			$message['drugiIgrac'] = $anonimni[$indeks];
			$message['drugiBodovi'] = 0;
		}
		else if( $broj === 2 )
		{
			$message['treciIgrac'] = $anonimni[$indeks];
			$message['treciBodovi'] = 0;
		}
		else if( $broj === 3 )
		{
			$message['cetvrtiIgrac'] = $anonimni[$indeks];
			$message['cetvrtiBodovi'] = 0;
		}
		else if( $broj === 4 )
		{
			$message['petiIgrac'] = $anonimni[$indeks];
			$message['petiBodovi'] = 0;
		}
		else break;
		++$broj;
		++$indeks;
	}

	sendJSONandExit($message);

}

?>
