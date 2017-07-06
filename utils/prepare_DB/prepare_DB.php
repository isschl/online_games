<?php

require_once '../db.class.php';

$db = DB::getConnection();

try
{
	$st = $db->prepare( 
		'CREATE TABLE IF NOT EXISTS userList (' .
		'username varchar(20) NOT NULL PRIMARY KEY,' .
		'password varchar(255) NOT NULL,' .
		'email varchar(40) NOT NULL,' .
		'hasregistered varchar(5) NOT NULL,' .
		'regseq varchar(10) NOT NULL)'
	);

	$st->execute();
}
catch( PDOException $e ) { exit( "PDO error #1: " . $e->getMessage() ); }

echo "Napravio tablicu userList .<br />";

try
{
	$st = $db->prepare( 
		'CREATE TABLE IF NOT EXISTS igre(' .
		'id int NOT NULL PRIMARY KEY AUTO_INCREMENT,' .
		'author varchar(20) NOT NULL,' .
		'title varchar(50) NOT NULL,' .
		'opis varchar(255) NOT NULL,' .
		'rated int NOT NULL)'
	);

	$st->execute();
}
catch( PDOException $e ) { exit( "PDO error #2: " . $e->getMessage() ); }

echo "Napravio tablicu igre.<br />";

try
{
	$st = $db->prepare( 
		'CREATE TABLE IF NOT EXISTS rezultati(' .
		'title varchar(50) NOT NULL,' .
		'username varchar(20) NOT NULL,' .
		'score int NOT NULL)'
	);

	$st->execute();
}
catch( PDOException $e ) { exit( "PDO error #3: " . $e->getMessage() ); }

echo "Napravio tablicu rezultati.<br />";

try
{
	$st = $db->prepare( 'INSERT INTO userList(username, password, email, hasregistered, regseq) VALUES (:username, :password, :email, :hasregistered, :regseq)' );

	$st->execute( array( 'username' => 'Pero',  'password' => password_hash( 'perinasifra', PASSWORD_DEFAULT ),  'email' => 'pero@gmail.com',  'hasregistered' => 'jeste', 'regseq' => 'zkm' ) );
	$st->execute( array( 'username' => 'Mirko', 'password' => password_hash( 'mirkovasifra', PASSWORD_DEFAULT ), 'email' => 'mirko@gmail.com', 'hasregistered' => 'jeste', 'regseq' => 'hnk' ) );
	$st->execute( array( 'username' => 'Slavko','password' => password_hash( 'slavkovasifra', PASSWORD_DEFAULT ),'email' => 'slavko@gmail.com','hasregistered' => 'jeste', 'regseq' => 'lol' ) );
	$st->execute( array( 'username' => 'Ana',   'password' => password_hash( 'aninasifra', PASSWORD_DEFAULT ),   'email' => 'ana@gmail.com',   'hasregistered' => 'nije',  'regseq' => 'ups' ) );
	$st->execute( array( 'username' => 'Maja',  'password' => password_hash( 'majinasifra', PASSWORD_DEFAULT ),  'email' => 'maja@gmail.com',  'hasregistered' => 'nije',  'regseq' => 'ijk' ) );
}
catch( PDOException $e ) { exit( "PDO error #4: " . $e->getMessage() ); }

echo "Ubacio korisnike u tablicu UserList.<br />";

try
{
	$st = $db->prepare( 'INSERT INTO igre(author, title, opis, rated) VALUES (:author, :title, :opis, :rated)' );

	$st->execute( array( 'author' => 'Mesar Ivo', 'title' => 'Cool igra 1', 'opis' => 'Cilj igre je... neki...', 'rated' => 0 ) );
	$st->execute( array( 'author' => 'Padre Mirko', 'title' => 'Vremenska prognoza', 'opis' => 'Pokliktati sve na ekranu', 'rated' => 0 ) );
}
catch( PDOException $e ) { exit( "PDO error #5: " . $e->getMessage() ); }

echo "Ubacio teme u tablicu igre.<br />";


try
{
	$st = $db->prepare( 'INSERT INTO rezultati(title, username, score) VALUES (:title, :username, :score)' );

	$st->execute( array( 'title' => 'Cool igra 1', 'username' => 'Slavko', 'score' => 10) );
	$st->execute( array( 'title' => 'Vremenska prognoza', 'username' => 'Pero', 'score' => 12) );
	$st->execute( array( 'title' => 'Vremenska prognoza', 'username' => 'Slavko', 'score' => 11) );
}
catch( PDOException $e ) { exit( "PDO error #6: " . $e->getMessage() ); }

echo "Ubacio postove u tablicu rezultati.<br />";

?> 
