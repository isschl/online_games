<?php

require_once '../../utils/db.class.php';

$db = DB::getConnection();

try
{
	$st = $db->prepare( 
		'CREATE TABLE IF NOT EXISTS rijeci (' .
		'id int NOT NULL PRIMARY KEY AUTO_INCREMENT,' .
		'rijec varchar(20) NOT NULL)'
	);

	$st->execute();
}
catch( PDOException $e ) { exit( "PDO error #1: " . $e->getMessage() ); }

try
{
	$st = $db->prepare( 
		'ALTER TABLE pitanja CHARACTER SET utf8 COLLATE utf8_unicode_ci;'
	);

	$st->execute();
}
catch( PDOException $e ) { exit( "PDO error #2: " . $e->getMessage() ); }


echo "Napravio tablicu pitanja .<br />";

//l - lako, s - srednje, t - teško

try
{
	$st = $db->prepare( 'INSERT INTO rijeci(rijec) VALUES (:rijec)' );

	$rijecnik = array('terminator','biblija','makroekonomija',
	'vrtuljak','ministarstvo','akademija','jahta','stolica','pivo',
	'fakultet','kirurg','odgovor','kiparstvo');

	foreach($rijecnik as $key => $value)
		$st->execute( array( 'rijec' => $value) );

}
catch( PDOException $e ) { exit( "PDO error #3: " . $e->getMessage() ); }

echo "Ubacio pitanja u tablicu pitanja.<br />";

?> 
