<?php
	require_once '../utils/db.class.php';

	$difficulty = $_POST['difficulty'];
	if(isset($_POST['numbers']) && isset($difficulty))
	{
		echo $difficulty;
		// nabaviti puno sudoku stringova...
		// TODO: echo random sudoku numbers string from database WHERE tezina == $difficulty
		$db = DB::getConnection();
		try
		{
			$st = $db->prepare( "SELECT brojevi FROM sudoku");
			$st->execute();
		}
		catch( PDOException $e ) { exit( 'Greška u bazi: ' . $e->getMessage() ); }
		
		$row=$st->fetch();
		echo $row;
	}
?>
