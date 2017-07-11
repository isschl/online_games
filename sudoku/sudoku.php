<?php
	$difficulty = $_POST['difficulty'];
	if(isset($_POST['numbers']) && isset($difficulty))
	{
		$file = new SplFileObject($difficulty . ".txt");
		$line_number = rand(0,10000);
		$file->seek($line_number);
		echo $file->current();
	}
?>
