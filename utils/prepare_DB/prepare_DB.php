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
		'CREATE TABLE IF NOT EXISTS rezultati(' .
		'title varchar(50) NOT NULL,' .
		'username varchar(20) NOT NULL,' .
		'score int NOT NULL)'
	);

	$st->execute();
}
catch( PDOException $e ) { exit( "PDO error #2: " . $e->getMessage() ); }

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
catch( PDOException $e ) { exit( "PDO error #3: " . $e->getMessage() ); }

echo "Ubacio korisnike u tablicu UserList.<br />";

try
{
	$st = $db->prepare( 'INSERT INTO rezultati(title, username, score) VALUES (:title, :username, :score)' );

	$st->execute( array( 'title' => 'Cool igra 1', 'username' => 'Slavko', 'score' => 10) );
	$st->execute( array( 'title' => 'Vremenska prognoza', 'username' => 'Pero', 'score' => 12) );
	$st->execute( array( 'title' => 'Vremenska prognoza', 'username' => 'Slavko', 'score' => 11) );
}
catch( PDOException $e ) { exit( "PDO error #4: " . $e->getMessage() ); }

echo "Ubacio rezultate u tablicu rezultati.<br />";

try
{
	$st = $db->prepare( 
		'CREATE TABLE IF NOT EXISTS rijeci (' .
		'id int NOT NULL PRIMARY KEY AUTO_INCREMENT,' .
		'rijec varchar(20) NOT NULL)'
	);

	$st->execute();
}
catch( PDOException $e ) { exit( "PDO error #5: " . $e->getMessage() ); }

try
{
	$st = $db->prepare( 
		'ALTER TABLE rijeci CHARACTER SET utf8 COLLATE utf8_unicode_ci;'
	);

	$st->execute();
}
catch( PDOException $e ) { exit( "PDO error #6: " . $e->getMessage() ); }


echo "Napravio tablicu rijeci .<br />";

try
{
	$st = $db->prepare( 'INSERT INTO rijeci(rijec) VALUES (:rijec)' );

	$rijecnik = array('terminator','biblija','makroekonomija',
	'vrtuljak','ministarstvo','akademija','jahta','stolica','pivo',
	'fakultet','kirurg','odgovor','kiparstvo');

	foreach($rijecnik as $key => $value)
		$st->execute( array( 'rijec' => $value) );

}
catch( PDOException $e ) { exit( "PDO error #7: " . $e->getMessage() ); }

echo "Ubacio rijeci u tablicu rijeci.<br />";

try
{
	$st = $db->prepare( 
		'CREATE TABLE IF NOT EXISTS pitanja (' .
		'id int NOT NULL PRIMARY KEY AUTO_INCREMENT,' .
		'pitanje varchar(255) NOT NULL,' .
		'odgovorA varchar(50) NOT NULL,' .
		'odgovorB varchar(50) NOT NULL,' .
		'odgovorC varchar(50) NOT NULL,' .
		'odgovorD varchar(50) NOT NULL,' .
		'odgovor varchar(1) NOT NULL,' .
		'tezina varchar(1) NOT NULL)'
	);

	$st->execute();
}
catch( PDOException $e ) { exit( "PDO error #8: " . $e->getMessage() ); }

try
{
	$st = $db->prepare( 
		'ALTER TABLE pitanja CHARACTER SET utf8 COLLATE utf8_unicode_ci;'
	);

	$st->execute();
}
catch( PDOException $e ) { exit( "PDO error #9: " . $e->getMessage() ); }


echo "Napravio tablicu pitanja .<br />";

//l - lako, s - srednje, t - teško

try
{
	$st = $db->prepare( 'INSERT INTO pitanja(pitanje, odgovorA, odgovorB, odgovorC, odgovorD, odgovor, tezina) '.
	'VALUES (:pitanje, :odgovorA, :odgovorB, :odgovorC, :odgovorD, :odgovor, :tezina)' );

	$st->execute( array( 
		'pitanje' => 'Tko je terminator u Terminatoru?',  
		'odgovorA' => 'Bruce Willis',  
		'odgovorB' => 'Harrison Ford',
		'odgovorC' => 'Michael J. Fox', 
		'odgovorD' => 'Arnold Schwarzenegger', 
		'odgovor' => 'D', 
		'tezina' => 'l') );
	$st->execute( array( 
		'pitanje' => 'Tko je smjestio Crvenkapici?',  
		'odgovorA' => 'vuk',  
		'odgovorB' => 'baka',
		'odgovorC' => 'zeko', 
		'odgovorD' => 'majka', 
		'odgovor' => 'C', 
		'tezina' => 'l' ) );
	$st->execute( array( 
		'pitanje' => 'Koliko ima Teletubbiesa?',  
		'odgovorA' => '1',  
		'odgovorB' => '2',
		'odgovorC' => '3', 
		'odgovorD' => '4', 
		'odgovor' => 'D', 
		'tezina' => 'l') );
	$st->execute( array( 
		'pitanje' => 'Za&#353;to je Nazoru trebala krava?',  
		'odgovorA' => 'zbog mlijeka',  
		'odgovorB' => 'zbog sira i vrhnja',
		'odgovorC' => 'zbog mesa', 
		'odgovorD' => 'lak&#353;e je u dobrom dru&#353;tvu', 
		'odgovor' => 'A', 
		'tezina' => 'l') );
	$st->execute( array( 
		'pitanje' => 'U pjesmi Stjepana Jimmy Stani&#263;a, kobila Suzy &#353;e&#263;e po ...',  
		'odgovorA' => 'autocesti Zagreb - Split',  
		'odgovorB' => 'filozofskom fakultetu',
		'odgovorC' => 'pruzi', 
		'odgovorD' => 'botani&#269;kom vrtu', 
		'odgovor' => 'C', 
		'tezina' => 'l') );


	$st->execute( array( 
		'pitanje' => 'Kad smo kod toga tko &#353;to mrzi, Indiana Jones &#263;e re&#263;i: '.
		'Why did it have to be ...',  
		'odgovorA' => 'Nazis?',  
		'odgovorB' => 'snakes?',
		'odgovorC' => 'blood?', 
		'odgovorD' => 'aliens?', 
		'odgovor' => 'B', 
		'tezina' => 's') );
	$st->execute( array( 
		'pitanje' => 'Tko je od navedenih ro&#273;en 1912?',  
		'odgovorA' => 'Carl Friedrich Gauss',  
		'odgovorB' => 'Albert Einstein',
		'odgovorC' => 'Rene Descartes', 
		'odgovorD' => 'Alan Turing', 
		'odgovor' => 'D', 
		'tezina' => 's') );
	$st->execute( array( 
		'pitanje' => 'Tko je nakon pravne bitke od 5 godina, ipak dobio nagradu Kiklop?',  
		'odgovorA' => 'Mate Mi&#353;o Kova&#269;',  
		'odgovorB' => 'Nives Celzijus',
		'odgovorC' => 'Ava Karabati&#263;', 
		'odgovorD' => '&#272;elo Had&#382;iselimovi&#263;', 
		'odgovor' => 'B', 
		'tezina' => 's') );
	$st->execute( array( 
		'pitanje' => 'Bo&#382;anstvena komedija Dante Alighierija je:',  
		'odgovorA' => 'roman',  
		'odgovorB' => 'epski spjev',
		'odgovorC' => 'pjesma u prozi', 
		'odgovorD' => 'novela', 
		'odgovor' => 'B', 
		'tezina' => 's') );
	$st->execute( array( 
		'pitanje' => 'The Scream slika je:',  
		'odgovorA' => 'Leonarda da Vincija',  
		'odgovorB' => 'Claudea Moneta',
		'odgovorC' => 'Edvarda Muncha', 
		'odgovorD' => 'Pietera Bruegela', 
		'odgovor' => 'C', 
		'tezina' => 's') );


	$st->execute( array( 
		'pitanje' => 'Kakv okus ma&#269;ke ne osje&#263;aju?',  
		'odgovorA' => 'kiseo',  
		'odgovorB' => 'papren',
		'odgovorC' => 'sladak', 
		'odgovorD' => 'gorak', 
		'odgovor' => 'C', 
		'tezina' => 't') );
	$st->execute( array( 
		'pitanje' => 'U seriji Bitange i princeze, Hrvatska ulazi u rat sa ...',  
		'odgovorA' => 'Slovenijom',  
		'odgovorB' => 'Ma&#273;arskom',
		'odgovorC' => 'Srbijom', 
		'odgovorD' => 'Italijom', 
		'odgovor' => 'A', 
		'tezina' => 't') );
	$st->execute( array( 
		'pitanje' => 'Koje godine je ro&#273;en Sylvester Stallone?',
		'odgovorA' => '1946',  
		'odgovorB' => '1938',
		'odgovorC' => '1954', 
		'odgovorD' => '1951', 
		'odgovor' => 'A', 
		'tezina' => 't') );
	$st->execute( array( 
		'pitanje' => 'Dugo se smatralo da je Gepard najbr&#382;a kopnena &#382;ivotinja na svijetu, no'.
		'nedavno istra&#382;ivanje je pokazalo da je to: ',  
		'odgovorA' => 'kalifornijska grinja',  
		'odgovorB' => 'ju&#382;nokorejska &#382;aba',
		'odgovorC' => 'prerijski crni pas', 
		'odgovorD' => 'lakonogi mi&#353;', 
		'odgovor' => 'A', 
		'tezina' => 't' ) );
	$st->execute( array( 
		'pitanje' => 'U Ve&#269;ernjoj &#353;koli &#381;eljka Pervana, Ante &#268;ulo na pitanje tko je napisao Crvenkapicu odgovara: ',
		'odgovorA' => 'Mi&#353;o Kova&#269;',  
		'odgovorB' => 'bra&#263;a Grani&#263;',
		'odgovorC' => 'To neki napisao?', 
		'odgovorD' => 'Hans Andresing', 
		'odgovor' => 'B', 
		'tezina' => 't' ) );
}
catch( PDOException $e ) { exit( "PDO error #10: " . $e->getMessage() ); }

echo "Ubacio pitanja u tablicu pitanja.<br />";

?> 
