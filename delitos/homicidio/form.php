<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Formulario Homicidio</title>
<link rel="stylesheet" href="../../assets/css/styles.css">
</head>
<body>

<div class="container">
<h2>Formulario - Homicidio</h2>

<form method="POST" action="guardar.php">

<input type="hidden" name="delito" value="Homicidio">

<label>¿Hay indiciado capturado?</label>
<select name="hay_indiciado" id="hay_indiciado" required>
    <option value="">Seleccione</option>
    <option value="si">Sí</option>
    <option value="no">No</option>
</select>

<div id="indiciado_container"></div>

<label>¿Hay víctimas?</label>
<select name="hay_victimas" id="hay_victimas" required>
    <option value="">Seleccione</option>
    <option value="si">Sí</option>
    <option value="no">No</option>
</select>

<div id="victimas_container"></div>

<label>Tipo de actuación:</label>
<select name="tipo_actuacion" required>
    <option value="">Seleccione</option>
    <option value="Patrullero">1 - Patrullero</option>
    <option value="Judicial">2 - Policía Judicial</option>
    <option value="SPOA">3 - SPOA Manual</option>
</select>

<button type="submit">Guardar Caso</button>

</form>
</div>

<script src="../../assets/js/app.js"></script>
</body>
</html>