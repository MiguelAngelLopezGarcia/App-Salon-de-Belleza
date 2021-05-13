<?php

// $db = mysqli_connect('localhost', 'root', '9B*EoOxh6"1nK19r', 'appsalon');
$db = mysqli_connect('localhost','root', '9B*EoOxh6"1nK19r', 'appsalon');

if(!$db){
     echo "No se ha conectado";
     exit;
};