<?php
	require_once 'db.class.php';

	function sendJSONandExit($message){
		header('Content-type: application/json; charset=utf-8');
		echo json_encode($message);
		flush();
		exit(0);
	}


	if(isset($_POST['brojpitanja']))
	{
		$ukupno = 0;
		$db = DB::getConnection();
		try
		{
			$st = $db->prepare( "SELECT id FROM pitanja");
			$st->execute();
		}
		catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }
		
		while($row=$st->fetch())
			++$ukupno;
		echo $ukupno;
	}
	else if(isset($_POST['idpitanja']))
	{
		$id = intval($_POST['idpitanja'])+1;

		$db = DB::getConnection();
		try
		{
			$st = $db->prepare( "SELECT * FROM pitanja WHERE id LIKE :id ");
			$st->execute( array( 'id' => $id ) );
		}
		catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }
		
		$row=$st->fetch();

		$message = [];
		$message['pitanje'] = $row['pitanje'];
		$message['odgovorA'] = $row['odgovorA'];
		$message['odgovorB'] = $row['odgovorB'];
		$message['odgovorC'] = $row['odgovorC'];
		$message['odgovorD'] = $row['odgovorD'];
		$message['odgovor'] = $row['odgovor'];
		$message['tezina'] = $row['tezina'];
		sendJSONandExit($message);	
	}

?>