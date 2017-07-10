<?php

//za danog igrača (u sessionu) sprema rezultat u danoj igri

require_once 'db.class.php';


//spremi rezultat za user-a
function spremiRezultat($user)
{
	//kako ću spremati ako ne znam o kojoj se igri radi
	if(!isset($_GET['title'])) 
		echo 'Ne znam ime igre!';

	//kako ću spremati ako ne znam koliko bodova spremiti
	else if(!isset($_GET['score'])) 
		echo 'Nema prilaza bez bodova bazi!';

	else
	{
		//pročitaj iz get-a o koliko se bodova radi i o kojoj je igri riječ
		$igra = $_GET['title'];
		//naravno, bodovi su integeri!
		$bodovi = intval($_GET['score']);


		$db = DB::getConnection();

		//pogledaj ima li korisnik upisano već što
		//pamtim samo njegov najveći rezultat za danu igru!

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

		if($row === false)
		  { 
			//ovo mu je prvi rezultat za tu igru - spremi ga
		  try
		  {
			$st = $db->prepare( "INSERT INTO rezultati "
				. "(title,username,score) "
				. "VALUES (:title, :username, :score)");
			$st->execute(array('title' => $igra, 
				'username' => $user, 'score' => $bodovi));

			echo 'Ubacih u bazu: igra = '.$igra.', korisnik = '.
				$user.', bodovi = '.$bodovi.'.';
		  }
		  catch( PDOException $e ) 
		  {
			exit( 'Greška u bazi: ' . $e->getMessage() ); 
		  }

		}	
		else //ima već nešto pogledaj jesu li ovo veći bodovi od upisanih
		{
			if(intval($row['score']) >= $bodovi)
				echo 'Ovo ti nije najve&#263;i <em>score</em>!';
			else //bravo, bolji rezultat - spremi ga
			{
			  try
			  {
			  $st = $db->prepare( "UPDATE rezultati SET score = :score ".
			     "WHERE title LIKE :title AND username LIKE :username ");
			  $st->execute(array('score' => $bodovi, 
			     'title' => $igra, 'username' => $user));
			
			  echo 'Osvje&#382;ih bazu: igra = '.$igra.', korisnik = '.
				$user.', bodovi = <b>'.$bodovi.'</b>.';
			  }
		          catch( PDOException $e ) 
			  { 
				exit( 'Greška u bazi: ' . $e->getMessage() );
			  }
			}
		}
	}
}



session_start();
$secret_word = 'empire';
unset($username);

if( isset( $_SESSION['login'] ) ) 
{
	//pogledaj da se netko nije igrao sa sessionom
	list( $c_username, $c_hash ) = explode( ',' , $_SESSION['login'] );
		
	if( md5( $c_username . $secret_word ) === $c_hash )
	{	
		//imam korisnika, spremi mu rezultat
		$username = $c_username;
		spremiRezultat($username);
	}
	else
	{
		echo "Gre&#353ka u sessionu. Ulogirajte se opet.";
	}
}
else //nemam prijavljenog korisnika
	echo 'Ne pamti se rezultat za gostove!';

?>
