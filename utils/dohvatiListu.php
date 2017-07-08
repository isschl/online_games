<?php
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
	$imeIgre = $_POST['title'];
	$db = DB::getConnection();
	try
	{
		$st = $db->prepare( "SELECT * FROM rezultati WHERE title LIKE :title ORDER BY score DESC");
		$st->execute( array( 'title' => $imeIgre ) );
	}
	catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }
	
	$broj = 0;
	$anonimni = array('AnonimnaLisica','AnonimnaGazela','AnonimniTarzan','AnonimniVuk','AnonimniPatak','AnonimnaPanda');
	shuffle($anonimni);
	$indeks = 0;	
	$message = [];

	while($row = $st->fetch())
	{
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