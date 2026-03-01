<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Formulario Violencia</title>
<link rel="stylesheet" href="../../assets/css/styles.css">
</head>
<body>

<div class="container">
<h2>Violencia intrafamiliar Art. 229 C.P.</h2>

    <!-- botón volver al menú principal -->
    <div style="margin-bottom:12px;">
        <button type="button" id="backToDelitos" style="background:#cfdbe9;color:#002d57;border:none;padding:8px 12px;border-radius:6px;cursor:pointer;">VOLVER</button>
    </div>

<div id="progress-container" class="progress-container">
    <div id="progress-bar" class="progress-bar"></div>
</div>
<div id="question-counter" class="question-counter">Pregunta 1 de 1</div>

<form id="mainForm" method="POST" action="guardar.php" enctype="multipart/form-data">
    <input type="hidden" name="delito" value="Homicidio">

    <div id="steps">
        <!-- paso 1: cantidad patrulleros -->
        <div class="step" data-step="1">
            <h3>Patrullero de Policía - Cantidad</h3>
            <label>Cantidad de Patrulleros de Policía:</label>
            <input type="number" id="cantidad_patru" name="cantidad_patru" min="1" required>
        </div>

        <!-- paso 2: datos patrulleros -->
        <div class="step" data-step="2">
            <h3>Datos de los Patrulleros</h3>
            <div id="patru_container"></div>
        </div>

        <!-- paso 3: Policía Judicial -->
        <div class="step" data-step="3">
            <h3>Policía Judicial</h3>
            <label>Nombres y apellidos</label>
            <input type="text" name="pj_nombre" required>
            <label>Identificación</label>
            <input type="text" name="pj_id" required>
            <label>Entidad</label>
            <select name="pj_entidad" required>
                <option value="">Seleccione</option>
                <option value="FISCALIA GENERAL DE LA NACIÓN">FISCALÍA GENERAL DE LA NACIÓN</option>
                <option value="PONAL">PONAL</option>
            </select>
            <label>Cargo</label>
            <input type="text" name="pj_cargo" required>
            <label>Teléfono/Celular</label>
            <input type="text" name="pj_telefono" required>
            <label>Correo Electrónico</label>
            <input type="email" name="pj_correo" required>
            <label>Firma (PNG)</label>
            <input type="file" name="pj_firma" accept="image/png">
        </div>

        <!-- paso 4 eliminado: el menú de actuaciones (menu2) reemplaza la selección de actor -->

        <!-- paso 5+: indiciados (iniciales) -->
        <div class="step" data-step="5" data-type="indiciados">
            <h3>Indiciados (General)</h3>
            <label>¿Hay capturados(as)?</label>
            <select name="capturados" id="capturados" required>
                <option value="">Seleccione</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
            </select>
        </div>
        <div class="step" data-step="6" data-type="indiciados">
            <h3>Capturados</h3>
            <label>¿Cuántos capturados(as)?</label>
            <input type="number" id="cantidad_capturados" name="cantidad_capturados" min="1">
            <div id="capturados_container"></div>
        </div>
        <!-- comienza formulario individual de indiciado -->
        <div class="step" data-step="7" data-type="indiciados">
            <label>Tipo de documento</label>
            <select name="ind_tipo_doc" id="ind_tipo_doc" required>
                <option value="">Seleccione</option>
                <option value="Indocumentado">Indocumentado</option>
                <option value="CC">CC (Cédula de Ciudadanía)</option>
                <option value="TI">TI (Tarjeta de Identidad)</option>
                <option value="RC">RC (Registro Civil de Nacimiento)</option>
                <option value="CE">CE (Cédula de Extranjería)</option>
                <option value="NIT">NIT (Número de Identificación Tributaria)</option>
                <option value="PA">PA (Pasaporte)</option>
                <option value="PEP/PPT">PEP/PPT (Permiso Especial/por Protección Temporal)</option>
                <option value="CD">CD (Carné Diplomático)</option>
                <option value="PEP">PEP (Permiso Especial de Permanencia)</option>
            </select>
        </div>
        <div class="step" data-step="8" data-type="indiciados">
            <label>Número de documento</label>
            <input type="text" name="ind_num_doc" id="ind_num_doc">
        </div>
        <div class="step" data-step="9" data-type="indiciados">
            <label>Lugar de expedición (país)</label>
            <input type="text" name="ind_expedicion_pais">
            <label>Departamento</label>
            <input type="text" name="ind_expedicion_depto">
            <label>Municipio</label>
            <input type="text" name="ind_expedicion_mpio">
        </div>
        <div class="step" data-step="10" data-type="indiciados">
            <label>Edad</label>
            <input type="number" name="ind_edad">
        </div>
        <div class="step" data-step="11" data-type="indiciados">
            <label>GÉNERO</label>
            <select name="ind_genero" required>
                <option value="">Seleccione</option>
                <option value="HOMBRE">Hombre</option>
                <option value="MUJER">Mujer</option>
            </select>
        </div>
        <div class="step" data-step="12" data-type="indiciados">
            <label>ORIENTACIÓN SEXUAL</label>
            <select name="ind_orientacion" id="ind_orientacion" required>
                <option value="">Seleccione</option>
                <option value="MUJER">Mujer</option>
                <option value="MUJER TRANS">Mujer Trans</option>
                <option value="HOMBRE">Hombre</option>
                <option value="HOMBRE TRANS">Hombre Trans</option>
                <option value="OTRO">Otro</option>
            </select>
            <div id="orientacion_otro_container" style="display:none; margin-top:8px;">
                <label>¿Cuál?</label>
                <input type="text" name="ind_orientacion_otro" id="ind_orientacion_otro">
            </div>
            <div id="ind_identario_container" style="display:none; margin-top:8px;">
                <label>Nombre identario (si aplica)</label>
                <input type="text" name="ind_nombre_identario" id="ind_nombre_identario">
            </div>
        </div>
        <div class="step" data-step="13" data-type="indiciados">
            <label>Fecha de nacimiento</label>
            <input type="date" name="ind_fecha_nacimiento">
        </div>
        <div class="step" data-step="14" data-type="indiciados">
            <label>Edad (reconfirmar)</label>
            <input type="number" name="ind_edad_re"> 
        </div>
        <div class="step" data-step="15" data-type="indiciados">
            <label>Lugar de nacimiento - País</label>
            <input type="text" name="ind_nacimiento_pais">
            <label>Departamento</label>
            <input type="text" name="ind_nacimiento_depto">
            <label>Municipio</label>
            <input type="text" name="ind_nacimiento_mpio">
        </div>
        <div class="step" data-step="16" data-type="indiciados">
            <label>Estado civil</label>
            <select name="ind_estado_civil" required>
                <option value="">Seleccione</option>
                <option value="Soltero(a)">Soltero(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Unión Libre">Unión Libre</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Separado(a)">Separado(a)</option>
                <option value="Viudo(a)">Viudo(a)</option>
            </select>
        </div>
        <div class="step" data-step="17" data-type="indiciados">
            <label>Nivel de escolaridad</label>
            <input type="text" name="ind_nivel_escolaridad">
        </div>
        <div class="step" data-step="18" data-type="indiciados">
            <label>Ocupación (en qué trabaja)</label>
            <input type="text" name="ind_ocupacion">
        </div>
        <div class="step" data-step="19" data-type="indiciados">
            <label>Señales particulares visibles</label>
            <input type="text" name="ind_senales">
        </div>
        <div class="step" data-step="20" data-type="indiciados">
            <h4>Información del padre</h4>
            <p class="note">Si no se tiene la respuesta de una pregunta, escriba "DESCONOCE"; si no aplica, escriba "N/A".</p>
            <label>¿Tiene información sobre su padre?</label>
            <select name="padre_tiene_info" id="padre_tiene_info" required>
                <option value="">Seleccione</option>
                <option value="SI">Sí</option>
                <option value="NO">No</option>
            </select>

            <div id="padre_detalles" style="display:none; margin-top:12px;">
                <label>¿Fallecido?</label>
                <select name="padre_fallecido" id="padre_fallecido" required>
                    <option value="">Seleccione</option>
                    <option value="SI">Sí</option>
                    <option value="NO">No</option>
                </select>
                <div id="padre_detalles_campos" style="margin-top:8px;">
                    <label>Nombres y apellidos</label><input type="text" name="padre_nombres" required>
                    <label>Identificación</label><input type="text" name="padre_id" required>
                    <label>Edad</label><input type="number" name="padre_edad" required>
                    <label>Lugar de residencia</label><input type="text" name="padre_residencia" required>
                    <label>Tel. Fijo y/o celular</label><input type="text" name="padre_telefono" required>
                    <label>Lugar de trabajo</label><input type="text" name="padre_trabajo" required>
                    <label>EPS</label><input type="text" name="padre_eps" required>
                    <label>Correo electrónico</label><input type="email" name="padre_correo" required>
                    <label>Redes sociales</label><input type="text" name="padre_redes" required>
                </div>
            </div>
        </div>
        <div class="step" data-step="21" data-type="indiciados">
            <h4>Información de la madre</h4>
            <p class="note">Si no se tiene la respuesta de una pregunta, escriba "DESCONOCE"; si no aplica, escriba "N/A".</p>
            <label>¿Tiene información sobre su madre?</label>
            <select name="madre_tiene_info" id="madre_tiene_info" required>
                <option value="">Seleccione</option>
                <option value="SI">Sí</option>
                <option value="NO">No</option>
            </select>

            <div id="madre_detalles" style="display:none; margin-top:12px;">
                <label>¿Fallecida?</label>
                <select name="madre_fallecida" id="madre_fallecida" required>
                    <option value="">Seleccione</option>
                    <option value="SI">Sí</option>
                    <option value="NO">No</option>
                </select>
                <div id="madre_detalles_campos" style="margin-top:8px;">
                    <label>Nombres y apellidos</label><input type="text" name="madre_nombres" required>
                    <label>Identificación</label><input type="text" name="madre_id" required>
                    <label>Edad</label><input type="number" name="madre_edad" required>
                    <label>Lugar de residencia</label><input type="text" name="madre_residencia" required>
                    <label>Tel. Fijo y/o celular</label><input type="text" name="madre_telefono" required>
                    <label>Lugar de trabajo</label><input type="text" name="madre_trabajo" required>
                    <label>EPS</label><input type="text" name="madre_eps" required>
                    <label>Correo electrónico</label><input type="email" name="madre_correo" required>
                    <label>Redes sociales</label><input type="text" name="madre_redes" required>
                </div>
            </div>
        </div>
        <div class="step" data-step="22" data-type="indiciados">
            <label>Dirección de residencia</label>
            <input type="text" name="ind_direccion">
        </div>
        <div class="step" data-step="23" data-type="indiciados">
            <label>Correo electrónico</label>
            <input type="email" name="ind_correo">
        </div>
        <div class="step" data-step="24" data-type="indiciados">
            <label>Redes sociales</label>
            <input type="text" name="ind_redes">
        </div>
        <div class="step" data-step="25" data-type="indiciados">
            <label>Pertenece a alguna etnia</label>
            <label><input type="radio" name="ind_etnia" value="NINGUNA">Ninguna</label>
            <label><input type="radio" name="ind_etnia" value="INDIGENA">Indígena</label>
            <label><input type="radio" name="ind_etnia" value="NEGRO">Negro/a</label>
            <label><input type="radio" name="ind_etnia" value="RAIZAL">Raizal</label>
            <label><input type="radio" name="ind_etnia" value="AFROCOLOMBIANO">Afrocolombiano</label>
            <label><input type="radio" name="ind_etnia" value="PALENQUERO">Palenquero/a</label>
            <label><input type="radio" name="ind_etnia" value="RROM">RROM</label>
        </div>
        <div class="step" data-step="26" data-type="indiciados">
            <label>Número de celular</label>
            <input type="text" name="ind_celular">
        </div>
        <div class="step" data-step="27" data-type="indiciados">
            <label>¿Tiene visa?</label>
            <select name="ind_tiene_visa" id="tiene_visa">
                <option value="">Seleccione</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
            </select>
            <div id="visa_detalle"></div>
        </div>
        <div class="step" data-step="28" data-type="indiciados">
            <label>Número de pasaporte</label>
            <input type="text" name="ind_pasaporte">
        </div>
        <div class="step" data-step="29" data-type="indiciados">
            <label>EPS</label>
            <input type="text" name="ind_eps">
        </div>
        <div class="step" data-step="30" data-type="indiciados">
            <label>Lugar de trabajo</label>
            <input type="text" name="ind_lugar_trabajo">
        </div>
        <div class="step" data-step="31" data-type="indiciados">
            <label>Alias o apodo</label>
            <input type="text" name="ind_alias">
        </div>
        <div class="step" data-step="32" data-type="indiciados">
            <label>Residencia – País, Departamento, Ciudad, Barrio</label>
            <input type="text" name="ind_res_pais" placeholder="País" required>
            <input type="text" name="ind_res_depto" placeholder="Departamento" required>
            <input type="text" name="ind_res_ciudad" placeholder="Ciudad" required>
            <input type="text" name="ind_res_barrio" placeholder="Barrio" required>
        </div>
        <div class="step" data-step="36" data-type="indiciados">
            <label>Descripción del inmueble</label>
            <input type="text" name="ind_desc_inmueble">
        </div>
        <div class="step" data-step="37" data-type="indiciados">
            <label>¿Tiene pareja?</label>
            <select name="ind_tiene_pareja" id="tiene_pareja">
                <option value="">Seleccione</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
            </select>
            <div id="pareja_detalle"></div>
        </div>
        <div class="step" data-step="38" data-type="indiciados">
            <label>¿Tiene hijos mayores de edad?</label>
            <select name="ind_tiene_hijos" id="tiene_hijos">
                <option value="">Seleccione</option>
                <option value="si">Sí</option>
                <option value="no">No</option>
            </select>
            <div id="hijos_detalle"></div>
        </div>
        <div class="step" data-step="39" data-type="indiciados">
            <label>Información del padre (ya registrada)</label>
            <p>Los datos del padre fueron capturados en la sección correspondiente.</p>
        </div>
        <div class="step" data-step="40" data-type="indiciados">
            <label>Información de la madre (ya registrada)</label>
            <p>Los datos de la madre fueron capturados en la sección correspondiente.</p>
        </div>

        <!-- pasos para víctimas -->
        <div class="step" data-step="99" data-type="victimas">
            <label>¿Hay víctimas?</label>
            <select name="vic_hay_victimas" id="vic_hay_victimas" required>
                <option value="">Seleccione</option>
                <option value="SI">Sí</option>
                <option value="NO">No</option>
            </select>
            <div id="vic_cantidad_container" style="display:none; margin-top:8px;">
                <label>¿Cuántas víctimas?</label>
                <input type="number" id="vic_cantidad" name="vic_cantidad" min="1">
                <div id="victimas_container" style="margin-top:12px"></div>
            </div>
        </div>

        <div class="step" data-step="100" data-type="victimas">
            <label>Primer nombre</label><input type="text" name="vic_primer_nombre" required>
            <label>Segundo nombre</label><input type="text" name="vic_segundo_nombre" required>
            <label>Primer apellido</label><input type="text" name="vic_primer_apellido" required>
            <label>Segundo apellido</label><input type="text" name="vic_segundo_apellido" required>
        </div>
        <div class="step" data-step="104" data-type="victimas">
            <label>Tipo de documento de identidad</label>
            <select name="vic_tipo_doc" id="vic_tipo_doc" required>
                <option value="">Seleccione</option>
                <option value="Indocumentado">Indocumentado</option>
                <option value="CC">CC (Cédula de Ciudadanía)</option>
                <option value="TI">TI (Tarjeta de Identidad)</option>
                <option value="RC">RC (Registro Civil de Nacimiento)</option>
                <option value="CE">CE (Cédula de Extranjería)</option>
                <option value="NIT">NIT (Número de Identificación Tributaria)</option>
                <option value="PA">PA (Pasaporte)</option>
                <option value="PEP/PPT">PEP/PPT (Permiso Especial/por Protección Temporal)</option>
                <option value="CD">CD (Carné Diplomático)</option>
                <option value="PEP">PEP (Permiso Especial de Permanencia)</option>
            </select>
        </div>
        <div class="step" data-step="105" data-type="victimas">
            <label>Número de documento de identidad</label>
            <input type="text" name="vic_num_doc" id="vic_num_doc" required>
        </div>
        <div class="step" data-step="111" data-type="victimas">
            <label>Lugar de expedición de documento - País</label><input type="text" name="vic_exp_pais" required>
            <label>Departamento</label><input type="text" name="vic_exp_depto" required>
            <label>Municipio</label><input type="text" name="vic_exp_mpio" required>
        </div>
        <div class="step" data-step="106" data-type="victimas">
            <label>Número de celular</label>
            <input type="text" name="vic_celular">
        </div>
        <div class="step" data-step="107" data-type="victimas">
            <label>Correo electrónico</label>
            <input type="email" name="vic_correo">
        </div>
        <div class="step" data-step="108" data-type="victimas">
            <label>Edad</label>
            <input type="number" name="vic_edad">
        </div>
        <div class="step" data-step="109" data-type="victimas">
            <label>Fecha de nacimiento</label>
            <input type="date" name="vic_fecha_nac">
        </div>
        <div class="step" data-step="110" data-type="victimas">
            <label>Lugar de nacimiento - País</label><input type="text" name="vic_nac_pais">
            <label>Departamento</label><input type="text" name="vic_nac_depto">
            <label>Municipio</label><input type="text" name="vic_nac_mpio">
        </div>
        <div class="step" data-step="112" data-type="victimas">
            <label>GÉNERO</label>
            <select name="vic_genero" required>
                <option value="">Seleccione</option>
                <option value="HOMBRE">Hombre</option>
                <option value="MUJER">Mujer</option>
            </select>
        </div>
        <div class="step" data-step="113" data-type="victimas">
            <label>Orientación sexual</label>
            <select name="vic_orientacion" id="vic_orientacion" required>
                <option value="">Seleccione</option>
                <option value="MUJER">Mujer</option>
                <option value="MUJER TRANS">Mujer Trans</option>
                <option value="HOMBRE">Hombre</option>
                <option value="HOMBRE TRANS">Hombre Trans</option>
                <option value="OTRO">Otro</option>
            </select>
            <div id="vic_orientacion_otro_container" style="display:none; margin-top:8px;">
                <label>¿Cuál?</label><input type="text" name="vic_orientacion_otro" id="vic_orientacion_otro">
            </div>
            <div id="vic_identario_container" style="display:none; margin-top:8px;">
                <label>Nombre identario (en caso de ser trans)</label><input type="text" name="vic_nombre_identario" id="vic_nombre_identario">
            </div>
        </div>
        <div class="step" data-step="114" data-type="victimas">
            <label>Profesión</label><input type="text" name="vic_profesion">
        </div>
        <div class="step" data-step="115" data-type="victimas">
            <label>Oficio</label><input type="text" name="vic_oficio">
        </div>
        <div class="step" data-step="116" data-type="victimas">
            <label>Estado Civil</label>
            <select name="vic_estado_civil" required>
                <option value="">Seleccione</option>
                <option value="Soltero(a)">Soltero(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Unión Libre">Unión Libre</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Separado(a)">Separado(a)</option>
                <option value="Viudo(a)">Viudo(a)</option>
            </select>
        </div>
        <div class="step" data-step="117" data-type="victimas">
            <label>Nivel Educativo</label><input type="text" name="vic_nivel_edu">
        </div>
        <div class="step" data-step="118" data-type="victimas">
            <label>País de residencia</label><input type="text" name="vic_res_pais">
            <label>Departamento</label><input type="text" name="vic_res_depto">
            <label>Municipio</label><input type="text" name="vic_res_mpio">
            <label>Barrio</label><input type="text" name="vic_res_barrio">
        </div>
        <div class="step" data-step="119" data-type="victimas">
            <label>Dirección de residencia</label><input type="text" name="vic_direccion">
        </div>
        <div class="step" data-step="120" data-type="victimas">
            <label>Redes sociales</label><input type="text" name="vic_redes">
        </div>
        <div class="step" data-step="121" data-type="victimas">
            <label>Relación con la víctima</label>
            <select name="vic_relacion" id="vic_relacion" required>
                <option value="">Seleccione</option>
                <option value="Expareja sentimental">Expareja sentimental</option>
                <option value="Hijo(a)">Hijo (a)</option>
                <option value="Hermano(a)">Hermano (a)</option>
                <option value="Persona sin vínculos (vecinos, grupos, barras, tribus urbanas, etc.)">Persona sin vínculos (vecinos, grupos, barras, tribus urbanas, etc.)</option>
                <option value="Otro">Otro</option>
            </select>
            <div id="vic_relacion_otro_container" style="display:none; margin-top:8px;">
                <label>Especifique</label><input type="text" name="vic_relacion_otro" id="vic_relacion_otro">
            </div>
        </div>

        <!-- representante legal para menor -->
        <div class="step" data-step="150" data-type="menores">
            <h3>Representante Legal del Menor</h3>
            <label>¿La víctima es la representante legal?</label>
            <select name="menor_rep_es_victima" id="menor_rep_es_victima" required>
                <option value="">Seleccione</option>
                <option value="SI">Sí</option>
                <option value="NO">No</option>
            </select>
            <div id="menor_rep_detalles" style="display:none; margin-top:12px;">
                <label>Parentesco / relación con el NNA</label>
                <input type="text" name="menor_rep_parentesco" required>
                <label>Nombres y Apellidos</label>
                <input type="text" name="menor_rep_nombres" required>
                <label>Tipo de documento de identificación</label>
                <select name="menor_rep_tipo_doc" id="menor_rep_tipo_doc" required>
                    <option value="">Seleccione</option>
                    <option value="Indocumentado">Indocumentado</option>
                    <option value="TI">TI (Tarjeta de Identidad)</option>
                    <option value="RC">RC (Registro Civil de Nacimiento)</option>
                    <option value="CE">CE (Cédula de Extranjería)</option>
                    <option value="NIT">NIT (Número de Identificación Tributaria)</option>
                    <option value="PA">PA (Pasaporte)</option>
                    <option value="PEP/PPT">PEP/PPT (Permiso Especial/por Protección Temporal)</option>
                    <option value="CD">CD (Carné Diplomático)</option>
                    <option value="PEP">PEP (Permiso Especial de Permanencia)</option>
                </select>
                <div id="menor_rep_num_doc_step" style="margin-top:8px;">
                    <label>Número de documento de identificación</label>
                    <input type="text" name="menor_rep_num_doc" id="menor_rep_num_doc" required>
                </div>
                <label>Teléfono</label>
                <input type="text" name="menor_rep_telefono" required>
                <label>Correo Electrónico</label>
                <input type="email" name="menor_rep_correo" required>
                <label>Dirección</label>
                <input type="text" name="menor_rep_direccion" required>
            </div>
        </div>
        <!-- datos del menor -->
        <div class="step" data-step="151" data-type="menores">
            <h3>Datos del Menor</h3>
            <label>Nombres y Apellidos</label>
            <input type="text" name="menor_nombres" required>
        </div>
        <div class="step" data-step="152" data-type="menores">
            <label>Tipo de documento de identidad</label>
            <select name="menor_tipo_doc" id="menor_tipo_doc" required>
                <option value="">Seleccione</option>
                <option value="Indocumentado">Indocumentado</option>
                <option value="TI">TI (Tarjeta de Identidad)</option>
                <option value="RC">RC (Registro Civil de Nacimiento)</option>
                <option value="CE">CE (Cédula de Extranjería)</option>
                <option value="NIT">NIT (Número de Identificación Tributaria)</option>
                <option value="PA">PA (Pasaporte)</option>
                <option value="PEP/PPT">PEP/PPT (Permiso Especial/por Protección Temporal)</option>
                <option value="CD">CD (Carné Diplomático)</option>
                <option value="PEP">PEP (Permiso Especial de Permanencia)</option>
            </select>
        </div>
        <div class="step" data-step="153" data-type="menores">
            <label>Número de documento de identidad</label>
            <input type="text" name="menor_num_doc" id="menor_num_doc" required>
        </div>
        <div class="step" data-step="154" data-type="menores">
            <label>Sexo</label>
            <select name="menor_genero" required>
                <option value="">Seleccione</option>
                <option value="HOMBRE">Hombre</option>
                <option value="MUJER">Mujer</option>
            </select>
        </div>
        <div class="step" data-step="155" data-type="menores">
            <label>Identidad de género</label>
            <select name="menor_orientacion" id="menor_orientacion" required>
                <option value="">Seleccione</option>
                <option value="MUJER">Mujer</option>
                <option value="MUJER TRANS">Mujer Trans</option>
                <option value="HOMBRE">Hombre</option>
                <option value="HOMBRE TRANS">Hombre Trans</option>
                <option value="OTRO">Otro</option>
            </select>
            <div id="menor_orientacion_otro_container" style="display:none; margin-top:8px;">
                <label>¿Cuál?</label><input type="text" name="menor_orientacion_otro" id="menor_orientacion_otro">
            </div>
            <div id="menor_identario_container" style="display:none; margin-top:8px;">
                <label>Nombre identario (si aplica)</label><input type="text" name="menor_nombre_identario" id="menor_nombre_identario">
            </div>
        </div>
        <div class="step" data-step="156" data-type="menores">
            <label>Edad</label>
            <input type="number" name="menor_edad" required>
        </div>
        <div class="step" data-step="157" data-type="menores">
            <label>Teléfono</label><input type="text" name="menor_telefono" required>
        </div>
        <div class="step" data-step="158" data-type="menores">
            <label>Correo electrónico</label><input type="email" name="menor_correo" required>
        </div>
        <div class="step" data-step="159" data-type="menores">
            <label>Dirección</label>
            <input type="text" name="menor_direccion" required>
        </div>
        <div class="step" data-step="160" data-type="menores">
            <label>Pertenece a alguna comunidad especial</label>
            <select name="menor_comunidad" id="menor_comunidad" required>
                <option value="">Seleccione</option>
                <option value="Afrodescendiente">Afrodescendiente</option>
                <option value="Afrodescendiente palenquero">Afrodescendiente palenquero</option>
                <option value="Raizal">Raizal</option>
                <option value="Gitano/Rom">Gitano / Rom</option>
                <option value="Indígena">Indígena</option>
                <option value="Pueblo/comunidad indígena">Pueblo/comunidad indígena</option>
                <option value="Requiere interpretación lingüística">Requiere interpretación lingüística</option>
                <option value="No">No</option>
            </select>
            <div id="menor_comunidad_otro_container" style="display:none; margin-top:8px;">
                <label>Especifique</label><input type="text" name="menor_comunidad_otro" id="menor_comunidad_otro">
            </div>
        </div>
        <div class="step" data-step="161" data-type="menores">
            <label>Tiene alguna discapacidad</label>
            <select name="menor_discapacidad" id="menor_discapacidad" required>
                <option value="">Seleccione</option>
                <option value="Visual">Visual</option>
                <option value="Auditiva o del lenguaje">Auditiva o del lenguaje</option>
                <option value="Sordoceguera">Sordoceguera</option>
                <option value="Física o motora">Física o motora</option>
                <option value="Mental">Mental</option>
                <option value="Cognitiva o intelectual">Cognitiva o intelectual</option>
                <option value="Múltiple">Múltiple</option>
                <option value="Otra">Otra</option>
                <option value="No">No</option>
            </select>
            <div id="menor_discapacidad_otro_container" style="display:none; margin-top:8px;">
                <label>Especifique</label><input type="text" name="menor_discapacidad_otro" id="menor_discapacidad_otro">
            </div>
        </div>

        <!-- paso para testigos (solo nombres/apellidos)
             se mostrará si actor=testigos -->
        <div class="step" data-step="200" data-type="testigos">
            <h3>Testigos</h3>
            <label>Nombres y apellidos</label>
            <input type="text" name="testigo_nombres">
        </div>

        <!-- paso final: menú con botones (menu2) -->
        <div class="step" data-step="999">
            <h3>Actuaciones disponibles</h3>
            <div class="menu2-buttons">
                <button type="button" class="menu2-action" data-action="actuacion_patru" disabled>Actuaciones Patrullero</button>
                <button type="button" class="menu2-action" data-action="relato_victima" disabled>Relato Víctima</button>
                <button type="button" class="menu2-action" data-action="datos_indiciados">Datos Indiciados</button>
                <button type="button" class="menu2-action" data-action="datos_victima">Datos Víctima</button>
                <button type="button" class="menu2-action" data-action="datos_menores">Datos Menores de edad</button>
                <button type="button" class="menu2-action" data-action="datos_testigos" disabled>Datos Testigos</button>
                <button type="button" class="menu2-action" data-action="actuaciones_pj" disabled>Actuaciones PJ</button>
            </div>

            <div style="margin-top:14px;">
                <button type="button" id="scheduleBtn">Agendar robot</button>
            </div>
        </div>

        <!-- pasos por actuación (placeholders) -->
        <div class="step" data-step="950" data-action="actuacion_patru">
            <h4>Actuaciones Patrullero</h4>
            <label>Detalle</label>
            <textarea name="actuacion_patru_detalle" rows="4"></textarea>
            <div style="margin-top:10px;"><button type="button" class="back-to-menu">Volver al menú</button></div>
        </div>
        <div class="step" data-step="951" data-action="relato_victima">
            <h4>Relato Víctima</h4>
            <label>Relato</label>
            <textarea name="relato_victima_detalle" rows="4"></textarea>
            <div style="margin-top:10px;"><button type="button" class="back-to-menu">Volver al menú</button></div>
        </div>
        <div class="step" data-step="952" data-action="datos_indiciados">
            <h4>Datos Indiciados (adicional)</h4>
            <label>Observaciones</label>
            <textarea name="datos_indiciados_detalle" rows="4"></textarea>
            <div style="margin-top:10px;"><button type="button" class="back-to-menu">Volver al menú</button></div>
        </div>
        <div class="step" data-step="953" data-action="datos_victima">
            <h4>Datos Víctima (adicional)</h4>
            <label>Observaciones</label>
            <textarea name="datos_victima_detalle" rows="4"></textarea>
            <div style="margin-top:10px;"><button type="button" class="back-to-menu">Volver al menú</button></div>
        </div>
        <div class="step" data-step="954" data-action="datos_menores">
            <h4>Datos Menores de edad</h4>
            <label>Observaciones</label>
            <textarea name="datos_menores_detalle" rows="4"></textarea>
            <div style="margin-top:10px;"><button type="button" class="back-to-menu">Volver al menú</button></div>
        </div>
        <div class="step" data-step="955" data-action="datos_testigos">
            <h4>Datos Testigos</h4>
            <label>Observaciones</label>
            <textarea name="datos_testigos_detalle" rows="4"></textarea>
            <div style="margin-top:10px;"><button type="button" class="back-to-menu">Volver al menú</button></div>
        </div>
        <div class="step" data-step="956" data-action="actuaciones_pj">
            <h4>Actuaciones PJ</h4>
            <label>Detalle</label>
            <textarea name="actuaciones_pj_detalle" rows="4"></textarea>
            <div style="margin-top:10px;"><button type="button" class="back-to-menu">Volver al menú</button></div>
        </div>
    </div>

    <div class="navigation">
        <button type="button" id="prevBtn">Anterior</button>
        <button type="button" id="nextBtn">Continuar</button>
    </div>
</form>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="../../assets/js/app.js"></script>
</body>
</html>