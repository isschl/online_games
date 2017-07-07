<?php
	require_once 'db.class.php';

function spremiRezultat($user)
{
	if(!isset($_GET['title'])) echo 'Ne znam ime igre!';
	else if(!isset($_GET['score'])) echo 'Nema prilaza bez bodova bazi!';
	else
	{
		$igra = $_GET['title'];
		$bodovi = intval($_GET['score']);
		$db = DB::getConnection();
		try
		{
			$st = $db->prepare( "SELECT score FROM rezultati ".
			"WHERE username LIKE :korisnik ".
			"AND title LIKE :naziv");
			$st->execute(array('korisnik' => $user, 'naziv' => $igra));
		}
		catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }
	
		$row = $st->fetch();
		if($row === false)
		{ //ovo mu je prvi rezultat za tu igru - spremi ga
		try
		{
			$st = $db->prepare( "INSERT INTO rezultati (title,username,score) ".
			"VALUES (:title, :username, :score)");
			$st->execute(array('title' => $igra, 'username' => $user, 'score' => $bodovi));
			echo 'Ubacih u bazu: igra = '.$igra.', korisnik = '.
				$user.', bodovi = '.$bodovi.'.';
		}
		catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }
	

		}	
		else
		{
			if(intval($row['score']) >= $bodovi)
				echo 'Ovo ti nije najve&#263;i <em>score</em>!';
			else //bravo, bolji rezultat - spremi ga
			{
			try
			{
			$st = $db->prepare( "UPDATE rezultati SET score = :score ".
			"WHERE title LIKE :title AND username LIKE :username ");
			$st->execute(array('score' => $bodovi, 'title' => $igra, 'username' => $user));
			
			echo 'Osvje&#382;ih bazu: igra = '.$igra.', korisnik = '.
				$user.', bodovi = <b>'.$bodovi.'</b>.';
			}
		catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }
			}
		}
	}
}
	session_start();
	$secret_word = 'empire';
	unset($username);

	if( isset( $_SESSION['login'] ) ) 
	{
		list( $c_username, $c_hash )
			= explode( ',' , $_SESSION['login'] );
		if( md5( $c_username . $secret_word ) === $c_hash )
		{	
			$username = $c_username;
			spremiRezultat($username);
		}
		else
		{
			echo "Gre&#353ka u sessionu. Ulogirajte se opet.";
		}
	}
	else
		echo 'Ne pamti se rezultat za gostove!';
?>
