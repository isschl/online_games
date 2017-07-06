<?php

//ono sto se salje post-om: username, password, logout (true)
	require_once 'db.class.php';

function ispisiLoginFormu($poruka)
{
	echo '<p style="color: red" >' . $poruka . '</p>'
	.'Korisni&#269;ko ime: <input type="text" id="username" />'
	.'&#352;ifra: <input type="password" id="password" />'
	.'<input type="button" id="loginklasa1" value="Log In">'
	.'<form method="post" action="../utils/registracija.php">'
	.'Novi ste ovdje?'
	.'<input type="submit" value="Registracija" >'
	.'</form>';
}

function ispisiLogoutFormu($user)
{
	echo '<p style="color: green">Uspje&#353;no ste prijavljeni, '
		.$user.'! </p>'
		.'<input type="button" id="loginklasa2" value="Log Out" >';
	
}

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

	else if( isset ( $_POST['username'] ) && isset( $_POST['password'] ) && validate ( $_POST['username'], $_POST['password'] ) === 1 )
	{
		$_SESSION['login'] = $_POST['username'] . ',' . md5( $_POST['username'] . $secret_word );
		$username = $_POST['username'];
		$ispis = 2;	
	}
	else if ( isset( $_POST['username'] ) && isset( $_POST['password'] ) ) 
	{
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
	if( isset ( $username ) && isset( $_POST['logout'] ) )
	{
		ispisiLoginFormu('Uspje&#353;no ste odjavljeni. Login: ');
		unset( $username );
		session_unset();
		session_destroy();
	}
	else
	{
		if($ispis === 1)
			ispisiLoginFormu($poruka);
		else
			ispisiLogoutFormu($username);
	}

?>