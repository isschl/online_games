<?php
	require_once '../utils/db.class.php';

	$difficulty = $_POST['difficulty'];
	if(isset($_POST['numbers']) && isset($difficulty))
	{
		echo $difficulty;
		// echo sudoku numbers string from database
	}
?>
