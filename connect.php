<?php
$full_name =$_POST["full_name"];
$email_id =$_POST["email_id"];
$message =$_POST["message"];

#connec database

$conn = new mysqli("localhost","root","","My_portfolio");
if ($conn->connect_error) {
    die("Connection Failed  : ". $conn->connect_error);

}else{
    $stmt = $conn->prepare( "insert into registration(full_name, email_id, messsage) values(?, ?, ?)");
    $stmt->bind_param("sss", $full_name, $email_id, $message);
    $stmt->execute();
    echo ".........Registration Successfully...........";
    $stmt->close();
    $conn->close();
}


?>