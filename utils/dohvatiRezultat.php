<?php

//za trenutno prijavljenog korisnika pogledaj rezultat u danoj igri

require_once 'db.class.php';


function dohvatiRezultat($user)
{
	//moraš dati ime igre - kako inače znam što gledati u bazi?
	if(!isset($_GET['title'])) 
		echo 'Ne znam ime igre!';
	else
	{
		//dohvati iz get-a ime igre
		$igra = $_GET['title'];

		$db = DB::getConnection();

		try
		{
			$st = $db->prepare( "SELECT score FROM rezultati ".
			"WHERE username LIKE :korisnik ".
			"AND title LIKE :naziv");
			$st->execute(array('korisnik' => $user, 'naziv' => $igra));
		}
		catch( PDOException $e ) 
		{ 
			exit( 'Greška u bazi: ' . $e->getMessage() ); 
		}
	
		$row = $st->fetch();

		if($row === false) //nema niti jedan rezultat tog korisnika u igri
			echo 'Ovaj korisnik('.$user.') nema rezultat u igri: '.$igra;
		else
			echo $row['score'];
	}
}

	//pokreni session i pogledaj tko je (i je li uopće) prijavljen
	session_start();
	$secret_word = 'empire';
	unset($username);

	if( isset( $_SESSION['login'] ) ) 
	{
		//provjeri da se netko nije igrao sa sessionom
		list( $c_username, $c_hash )
			= explode( ',' , $_SESSION['login'] );
		if( md5( $c_username . $secret_word ) === $c_hash )
		{	
			//sve ok, dohvati rezultat za prijavljenog korisnika
			$username = $c_username;
			dohvatiRezultat($username);
		}
		else
		{
			//nije ok - netko se igrao sa sessionom
			echo "Gre&#353ka u sessionu. Ulogirajte se opet.";
		}
	}
	else	//ako nitko nije prijavljen, onda nema  ni rezultata!
		echo 'Ne pamti se rezultat za gostove!';
?>
