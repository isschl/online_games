<?php

//ono sto se salje post-om: username, password, logout (true)
	
require_once 'db.class.php';

//ispisuje login formu s odgovarajucom porukom
function ispisiLoginFormu($poruka)
{
	echo '<p style="color: red" >'
	. $poruka . '</p><label for="username">'
	.' Korisni&#269;ko ime: </label> '
        .' <input type="text" id="username" /> <label for="password">'
	.' &#352;ifra: </label> <input type="password" id="password" />'
	.'<input type="button" id="loginklasa1" value="Log In">'
	.'<form style="display: inline-block" '
	.'method="post" action="../utils/registracija.php">'
	.'<label for="reg"> Novi ste ovdje? </label>'
	.'<input type="submit" id="reg" value="Registracija" >'
	.'</form>';
}

//ispisuje poruku uspješno prijavljen i daje gumb za logout i za gledanje svog profila
function ispisiLogoutFormu($user)
{
	echo '<label for="loginklasa2" style="color: green">Uspje&#353;no ste prijavljeni, '
		.$user.'! </label>'
		.'<input type="button" id="loginklasa2" value="Log Out" >'
		.'<input type="button" id="mojprofil" value="Moj profil" >';
	
}

//provjerava odgovaraju li username i sifra onima u bazi
function validate( $user, $pass )
{	
	$db = DB::getConnection();
	try
	{
		$st = $db->prepare( "SELECT * FROM userList WHERE username LIKE :username ");
		$st->execute( array( 'username' => $user ) );
	} catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }

	if( $st->rowCount() !== 1 )
	{
		return 0;
	}
	
	foreach( $st->fetchAll() as $row )
	{
 		$hash = $row['password'];
		if( password_verify( $pass, $hash ) )
		{
			if( $row['hasregistered'] === 'jeste' )
				return 1;
			else
				return 2;
		}	
	}
	return 0;
}


	session_start();

	$secret_word = 'empire';
	$poruka = 'Prijavljeni ste kao gost. Ulogirajte se:';
	$ispis = 1;

	unset($username);

	if( isset( $_SESSION['login'] ) ) 
	{
		//provjeri igra li se itko sa sessionom
		list( $c_username, $c_hash )
			= explode( ',' , $_SESSION['login'] );
		if( md5( $c_username . $secret_word ) === $c_hash )
		{	
			$username = $c_username;
			$ispis = 2;
		}
		else
		{
			$ispis = 1;
			$poruka = "Gre&#353ka u sessionu. Ulogirajte se opet.";
		}
	}

	else if( isset ( $_POST['username'] ) && isset( $_POST['password'] ) 
		&& validate ( $_POST['username'], $_POST['password'] ) === 1 )
	{
		//ako imamo i username i pass i ispravni su
		$_SESSION['login'] = $_POST['username'] . ',' 
			. md5( $_POST['username'] . $secret_word );
		$username = $_POST['username'];
		$ispis = 2;	
	}
	else if ( isset( $_POST['username'] ) && isset( $_POST['password'] ) ) 
	{
		//imamo i user i pass ali neispravni - gornji validate u if-u nije prošao
		if( $_POST['username'] === '' && $_POST['password'] === '' )
			$ispis = 1;
		else 
		{	
			$ispis = 1;
			if(validate ( $_POST['username'], $_POST['password'] ) === 2)	
			   $poruka = "Gre&#353;ka - korisnik nije potvrdio registraciju.";
			else
			   $poruka = "Gre&#353;ka - krivi username i/ili password. ";
		}
	}


	//ako smo saznali da je netko bio u sessionu i sad se odjavljuje
	if( isset ( $username ) && isset( $_POST['logout'] ) )
	{
		ispisiLoginFormu('Uspje&#353;no ste odjavljeni. Login: ');
		unset( $username );
		session_unset();
		session_destroy();
	}
	else //ovisno o vrijednosti ispisa od koda gore ispisi login ili logout formu
	{
		if($ispis === 1)
			ispisiLoginFormu($poruka);
		else
			ispisiLogoutFormu($username);
	}

?>
