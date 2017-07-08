<?php
	require_once '../utils/db.class.php';

	function sendJSONandExit($message){
		header('Content-type: application/json; charset=utf-8');
		echo json_encode($message);
		flush();
		exit(0);
	}


	if(isset($_POST['brojrijeci']))
	{
		$ukupno = 0;
		$db = DB::getConnection();
		try
		{
			$st = $db->prepare( "SELECT id FROM rijeci");
			$st->execute();
		}
		catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }
		
		while($row=$st->fetch())
			++$ukupno;
		echo $ukupno;
	}
	else if(isset($_POST['idrijeci']))
	{
		$id = intval($_POST['idrijeci']);

		$db = DB::getConnection();
		try
		{
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
