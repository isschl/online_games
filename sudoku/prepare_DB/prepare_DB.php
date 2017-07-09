<?php

require_once '../../utils/db.class.php';

$db = DB::getConnection();

try
{
	$st = $db->prepare( 
		'CREATE TABLE IF NOT EXISTS sudoku (' .
		'id int NOT NULL PRIMARY KEY AUTO_INCREMENT,' .
		'brojevi char(81) NOT NULL,' .
		'tezina varchar(1) NOT NULL)'
	);

	$st->execute();
}
catch( PDOException $e ) { exit( "PDO error #1: " . $e->getMessage() ); }

try
{
	$st = $db->prepare( 
		'ALTER TABLE sudoku CHARACTER SET utf8 COLLATE utf8_unicode_ci;'
	);

	$st->execute();
}
catch( PDOException $e ) { exit( "PDO error #2: " . $e->getMessage() ); }


echo "Napravio tablicu sudokua .<br />";

//l - lako, s - srednje, t - teško

try
{
	$st = $db->prepare( 'INSERT INTO sudoku(brojevi, tezina) VALUES (:brojevi, :tezina)' );

	$st->execute( array( 
		'brojevi' => '123456789123456789123456789123456789123456789123456789123456789123456789123456789', 
		'tezina' => 't') );
	$st->execute( array( 
		'brojevi' => '213456789123456789123456789123456789123456789123456789123456789123456789123456789', 
		'tezina' => 't') );

}
catch( PDOException $e ) { exit( "PDO error #3: " . $e->getMessage() ); }

echo "Ubacio sudokue u tablicu sudokua.<br />";

?> 
