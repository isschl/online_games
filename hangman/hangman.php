<?php
	require_once '../utils/db.class.php';

	function sendJSONandExit($message){
		header('Content-type: application/json; charset=utf-8');
		echo json_encode($message);
		flush();
		exit(0);
	}

	//ako si dobio broj riječi, vrati koliko riječi imaš u bazi
	if(isset($_POST['brojrijeci']))
	{
		$ukupno = 0;
		$db = DB::getConnection();
		try
		{
			$st = $db->prepare( "SELECT id FROM rijeci");
			$st->execute();
		}
		catch( PDOException $e ) 
		{ 
			exit( 'Greška u bazi: ' . $e->getMessage() ); 
		}
		
		while($row=$st->fetch())
			++$ukupno;
		
		//vrati broj riječi u bazi
		echo $ukupno;
	}

	//ako si dobio idrijeci vrati riječ s tim id-jem
	else if(isset($_POST['idrijeci']))
	{
		$id = intval($_POST['idrijeci']);

		$db = DB::getConnection();
		try
		{
			//dohvati riječ s tim id-jem
			$st = $db->prepare( "SELECT * FROM rijeci WHERE id LIKE :id ");
			$st->execute( array( 'id' => $id ) );
		}
		catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }
		
		$row=$st->fetch();

		$message = [];
		$message['rijec'] = $row['rijec'];
		
		sendJSONandExit($message);	
	}

?>
