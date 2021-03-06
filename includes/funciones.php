<?php

function obtenerServicios() : array {
    try {
        //Insertar una conexión
        require 'database.php';

        // Escribir el código SQL
        $sql = "SELECT * FROM servicios;";

        $consulta = mysqli_query($db, $sql);

        //Array vacío
        $servicios = [];
        $i = 0;

        //Obtener los resultados
        while ($row = mysqli_fetch_assoc($consulta)) {
            $servicios[$i]['id'] = $row['id'];
            $servicios[$i]['nombre'] = $row['nombre'];
            $servicios[$i]['precio'] = $row['precio'];

            $i++;
        };

        return $servicios;

    } catch (\Throwable $th) {
        //throw $th;
        var_dump($th);
    };
};

obtenerServicios();