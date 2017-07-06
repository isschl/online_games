<?php
	require_once 'db.class.php';

function dohvatiRezultat($user)
{
	if(!isset($_GET['title'])) echo 'Ne znam ime igre!';
	else
	{
		$igra = $_GET['title'];
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
			echo 'Ovaj korisnik('.$user.') nema rezultat u igri: '.$igra;
		else
			echo $row['score'];
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
			dohvatiRezultat($username);
		}
		else
		{
			echo "Gre&#353ka u sessionu. Ulogirajte se opet.";
		}
	}
	else
		echo 'Ne pamti se rezultat za gostove!';
?>