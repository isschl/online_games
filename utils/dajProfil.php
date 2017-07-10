<?php

require_once 'db.class.php';

function dohvatiMjesto($username, $title)
{
	$db = DB::getConnection();
	try
	{
		$st = $db->prepare( "SELECT * FROM rezultati WHERE title LIKE :title ORDER BY score DESC");
		$st->execute( array( 'title' => $title ) );
	}
	catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }
	
	$mjesto = 0;
	
	while($row = $st->fetch())
	{
		++$mjesto;
		if( $row['username'] === $username )
			break;
	}
	return $mjesto . '.';
}


function napraviTablicu($username)
{
	$poruka = '<table style="color:white; border:2px solid white;'
		. ' text-align:center; ">'
		. '<tr><th colspan="3" style="font-size: 150%;">Moj profil</th></tr>'
		. '<tr><td>Username</td>'
		. '<td colspan="2" style="color:rgb(210, 255, 77)">'
		. $username . '</td></tr>';	

	$db = DB::getConnection();
	try
	{
		$st = $db->prepare( "SELECT * FROM userList WHERE username LIKE :username ");
		$st->execute( array( 'username' => $username ) );
	} catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }

	if( $st->rowCount() !== 1 )
	{
		echo '<p style="color:red">Greška u bazi!</p>';
	}
	
 	$row = $st->fetch();
	$poruka .= '<tr><td>e-mail adresa</td>'
		. '<td colspan="2" style="color:rgb(210, 255, 77)">'
		. $row['email'] . '</td></tr>'
		.'<tr><td colspan="3"><b style="color:rgb(255, 255, 153); font-size: 150%">'
		.'Moji rezultati</b></td></tr>';

	try
	{
		$st = $db->prepare( "SELECT * FROM rezultati ".
		"WHERE username LIKE :korisnik ");
		$st->execute(array('korisnik' => $username));
	}
	catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }
	
	$row = $st->fetch();
	if($row === false)
	{
		$poruka .= '<tr><td colspan="3" style="color:red">'
			. 'Nemate spremljenih rezultata!</td></tr></table>';
		echo $poruka;
	}
	else
	{
		$poruka .= '<tr><td><b>Naziv igre</b></td>'
			. '<td><b>Najbolji rezultat</b></td>'
			. '<td><b>Mjesto na ljestvici</b></td>';
		do{
			$poruka .= '<tr style="color:rgb(210, 255, 77)"><td>' 
				. $row['title'] . '</td><td>'
				. $row['score'] . '</td><td style="color:rgb(179, 255, 255)">'
				. dohvatiMjesto($username, $row['title'])
				. '</td></tr>';
		
		}while($row = $st->fetch());

		$poruka .= '</table>';
		echo $poruka;
	}
}



if( !isset( $_POST['kontakt'] ) )
{
	echo '<p style="color: red"> Neka greška - tko me kontaktira?</p>';
}
else
{
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
			napraviTablicu($username);
		}
		else
		{
			echo '<p style="color: red"> Greška - ponovi login! </p>';
		}
	}
	else
	{
		echo '<p style="color: red"> Napravi login - onda mogu podatci! </p>';
	}
}


?>