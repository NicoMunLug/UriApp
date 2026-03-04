// multi-step navigation and helper functions
let currentStep = 0;
const form = document.getElementById('mainForm');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const progressBar = document.getElementById('progress-bar');
const counter = document.getElementById('question-counter');

// keep track of completed acciones so we can mark the menu buttons
window.completedActions = new Set();
// by default start in the normal flow (show patrullero/PJ first) and only display
// the menu once we reach that step or enter/exit an action
window.forceShowMenu2 = false;


// helper: decorate menu2 buttons with a ✅ when completed
function updateMenuMarks() {
    const btns = document.querySelectorAll('.menu2-action');
    btns.forEach(b => {
        const act = b.dataset.action;
        if (window.completedActions.has(act)) {
            if (!b.textContent.includes('✅')) {
                b.textContent = b.textContent + ' ✅';
            }
            b.classList.add('done');
        } else {
            b.classList.remove('done');
            b.textContent = b.textContent.replace(' ✅', '');
        }
    });
}

// convert text inputs to uppercase on input
document.addEventListener('input', (e) => {
    const t = e.target;
    if (!t) return;
    const tag = t.tagName.toUpperCase();
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
        // only transform for visible text-like inputs
        if (t.type === 'text' || t.type === 'search' || t.type === 'email' || tag === 'TEXTAREA') {
            t.value = t.value.toUpperCase();
        }
    }
});

function getVisibleSteps() {

    const all = Array.from(document.querySelectorAll('.step'));

    // Si estamos dentro de una acción
    if (window.openAction) {

        return all.filter(s => {
            // siempre incluir los pasos globales (sin type ni action, excepto el menú)
            if (!s.dataset.type && !s.dataset.action && s.dataset.step !== '999') return true;
            // además incluir los pasos del grupo correspondiente
            if (window.openAction === 'datos_indiciados' && s.dataset.type === 'indiciados') {
                // when we are inside indiciados, optionally hide the numero de
                // documento and expedición steps if the user picked indocumentado
                if (s.dataset.step === '8' || s.dataset.step === '9') {
                    const sel = document.getElementById('ind_tipo_doc');
                    if (sel && sel.value === 'Indocumentado') {
                        return false;
                    }
                }   
                return true;
            }
            if (window.openAction === 'datos_victima') {
                // if we're in 'multi-victim' mode, only show the initial
                // selector step (99) which contains quantity and the dynamic
                // victim blocks; hide the static victim-per-step flow.
                if (window.vicMulti) {
                    if (s.dataset.step === '99') return true;
                    // always include global steps
                    if (!s.dataset.type && !s.dataset.action && s.dataset.step !== '999') return true;
                    return false;
                }
                // normal single-victim flow: include victim steps but skip
                // doc/expedition when indocumentado
                if (s.dataset.type === 'victimas') {
                    if (s.dataset.step === '105' || s.dataset.step === '111') {
                        const selv = document.getElementById('vic_tipo_doc');
                        if (selv && selv.value === 'Indocumentado') {
                            return false;
                        }
                    }
                    return true;
                }
            }
            if (window.openAction === 'datos_menores' && s.dataset.type === 'menores') {
                // skip menor doc number when indocumentado
                if (s.dataset.step === '153') {
                    const selm = document.getElementById('menor_tipo_doc');
                    if (selm && selm.value === 'Indocumentado') {
                        return false;
                    }
                }
                return true;
            }
            if (window.openAction === 'relato_victima' && s.dataset.action === 'relato_victima') {
                return true;
            }
            // ignorar los demás tipos
            return false;
        });
    }

    // Si estamos mostrando menú
    if (window.forceShowMenu2) {
        return all.filter(s => s.dataset.step === '999');
    }

    // Flujo normal inicial
    return all.filter(s => {
        // hide document number and expedición steps if indocumentado selected
        if (s.dataset.step === '8' || s.dataset.step === '9') {
            const sel = document.getElementById('ind_tipo_doc');
            if (sel && sel.value === 'Indocumentado') {
                return false;
            }
        }
        // also for victim section
        if (s.dataset.step === '105' || s.dataset.step === '111') {
            const selv = document.getElementById('vic_tipo_doc');
            if (selv && selv.value === 'Indocumentado') {
                return false;
            }
        }
        return !s.dataset.type && !s.dataset.action;
    });
}

function showStep(idx) {
    const steps = getVisibleSteps();
    steps.forEach((s, i) => {
        s.style.display = i === idx ? 'block' : 'none';
    });

    // determine whether the menu step is now the active one
    const menuIdx = steps.findIndex(s => s.dataset.step === '999');
    const showingMenu = menuIdx === idx;

    // toggle body class that governs menu visibility (CSS rule looks for this)
    if (window.forceShowMenu2 || showingMenu) {
        document.body.classList.add('show-menu');
    } else {
        document.body.classList.remove('show-menu');
    }

    // manage inline style on the menu element too (CSS uses !important so
    // inline style takes precedence); show when forced or when it's the current
    // step, hide otherwise
    const menuElem = document.querySelector('.step[data-step="999"]');
    if (menuElem) {
        if (window.forceShowMenu2 || showingMenu) {
            menuElem.style.display = 'block';
        } else {
            menuElem.style.display = 'none';
        }
    }

    currentStep = idx;
    updateProgress();
}

function updateProgress() {
    const steps = getVisibleSteps();
    const total = steps.length;
    const percent = ((currentStep + 1) / total) * 100;
    progressBar.style.width = percent + '%';
    counter.textContent = `Pregunta ${currentStep + 1} de ${total}`;
    // navigation buttons
    prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
    nextBtn.textContent = currentStep === total - 1 ? 'Guardar' : 'Continuar';
}

function nextPrev(n) {
    const steps = getVisibleSteps();
    // validation: if going forward, check required fields in current visible step
    if (n === 1) {
        const inputs = steps[currentStep].querySelectorAll('input, select');
        for (let inp of inputs) {
            if (inp.hasAttribute('required')) {
                if (inp.type === 'radio') {
                    // ensure one in group is checked
                    const group = steps[currentStep].querySelectorAll(`input[name="${inp.name}"]`);
                    const any = Array.from(group).some(r => r.checked);
                    if (!any) {
                        group[0].focus();
                        return;
                    }
                } else if (!inp.value) {
                    inp.focus();
                    return;
                }
            }
        }
    }

    // special case for capturados=no inside the indiciados action: finish
    // the action immediately instead of showing the capturados details step.
    if (n === 1 && window.openAction === 'datos_indiciados') {
        const stepEl = steps[currentStep];
        const capSel = stepEl.querySelector('#capturados');
        if (capSel && capSel.value === 'no') {
            window.completedActions.add(window.openAction);
            window.openAction = null;
            window.forceShowMenu2 = true;
            currentStep = 0;
            window.vicMulti = false;
            showStep(0);
            updateMenuMarks();
            return;
        }
    }

    // special case for vic_hay_victimas = NO inside datos_victima: finish action
    if (n === 1 && window.openAction === 'datos_victima') {
        const stepEl = steps[currentStep];
        const vicSel = stepEl.querySelector('#vic_hay_victimas');
        if (vicSel && (vicSel.value === 'NO' || vicSel.value === 'no')) {
            window.completedActions.add(window.openAction);
            window.openAction = null;
            window.forceShowMenu2 = true;
            currentStep = 0;
            window.vicMulti = false;
            showStep(0);
            updateMenuMarks();
            return;
        }
    }

    currentStep += n;
    if (window.openAction) {
        if (currentStep >= steps.length) {

            // marcar como completada
            window.completedActions.add(window.openAction);

            // cerrar acción
            window.openAction = null;
            window.forceShowMenu2 = true;

            // reset multi-victim mode when closing any action
            window.vicMulti = false;

            // reiniciar índice
            currentStep = 0;

            showStep(0);
            updateMenuMarks();
            return;
        }
    }else {
        if (currentStep >= steps.length) {
            // reached end - maybe submit
            form.submit();
            return;
        }
    }
    if (currentStep < 0) currentStep = 0;
    showStep(currentStep);
}

nextBtn.addEventListener('click', () => nextPrev(1));
prevBtn.addEventListener('click', () => nextPrev(-1));

// dynamic generation of patrullero fields
const cantidadPatru = document.getElementById('cantidad_patru');
if (cantidadPatru) {
    cantidadPatru.addEventListener('change', function () {
        const num = parseInt(this.value) || 0;
        const container = document.getElementById('patru_container');
        container.innerHTML = '';
        for (let i = 1; i <= num; i++) {
            container.innerHTML += `
                <div class="patru-block">
                    <h4>Patrullero ${i}</h4>
                    <label>Nombres y apellidos</label>
                    <input type="text" name="patru_nombre[]" required>
                    <label>Identificación</label>
                    <input type="text" name="patru_id[]" required>
                    <label>Entidad</label>
                    <input type="text" name="patru_entidad[]" value="PONAL" readonly>
                    <label>Cargo</label>
                    <input type="text" name="patru_cargo[]" required>
                    <label>Teléfono/celular</label>
                    <input type="text" name="patru_telefono[]" required>
                    <label>Correo electrónico</label>
                    <input type="email" name="patru_correo[]" required>
                        <label>Número de patrulla de vigilancia</label>
                    <input type="text" name="patru_numero[]" required>
                    <label>CAI al que están adscritos</label>
                    <input type="text" name="patru_cai[]" required>
                </div>
            `;
        }
    });
}

// capturados
const cantidadCapt = document.getElementById('cantidad_capturados');
if (cantidadCapt) {
    cantidadCapt.addEventListener('change', function () {
        const num = parseInt(this.value) || 0;
        const container = document.getElementById('capturados_container');
        container.innerHTML = '';
        for (let i = 1; i <= num; i++) {
            container.innerHTML += `
                <div class="capturado-block">
                    <h4>Capturado ${i}</h4>
                    <label>Primer nombre</label>
                    <input type="text" name="capturado_${i}_nombre1" required>
                    <label>Segundo nombre</label>
                    <input type="text" name="capturado_${i}_nombre2">
                    <label>Primer apellido</label>
                    <input type="text" name="capturado_${i}_apellido1" required>
                    <label>Segundo apellido</label>
                    <input type="text" name="capturado_${i}_apellido2">
                </div>
            `;
        }
    });
}

// if user says there are NO capturados, handle differently depending on context
const captSelect = document.getElementById('capturados');
if (captSelect) {
    captSelect.addEventListener('change', function() {
        if (this.value === 'no') {
            // when not inside an open action we still redirect to the menu
            // (this was the original behavior before menu2 existed)
            if (!window.openAction) {
                window.openAction = null;
                window.forceShowMenu2 = true;
                const steps = getVisibleSteps();
                const idx = steps.findIndex(s => s.dataset.step === '999');
                if (idx >= 0) showStep(idx);
            } else {
                // inside an action (eg. datos_indiciados) we simply clear the
                // capturados fields and let the user continue with the rest of
                // the indiciado questions.  do NOT show the menu.
                const cont = document.getElementById('capturados_container');
                if (cont) cont.innerHTML = '';
                const cantidad = document.getElementById('cantidad_capturados');
                if (cantidad) cantidad.value = '';

                // optionally advance to next step so the user doesn't linger on
                // the now irrelevant "¿Cuántos capturados?" question
                nextPrev(1);
            }
        }
    });
}

// visa detail
const visaSelect = document.getElementById('tiene_visa');
if (visaSelect) {
    visaSelect.addEventListener('change', function() {
        const cont = document.getElementById('visa_detalle');
        cont.innerHTML = '';
        if (this.value === 'si') {
            cont.innerHTML = `
                <label>Vigencia de la visa</label>
                <input type="date" name="ind_visa_vigencia">
            `;
        }
    });
}

// pareja detail
const parejaSelect = document.getElementById('tiene_pareja');
if (parejaSelect) {
    parejaSelect.addEventListener('change', function() {
        const cont = document.getElementById('pareja_detalle');
        cont.innerHTML = '';
        if (this.value === 'si') {
            cont.innerHTML = `
                <label>Nombres y apellidos</label><input type="text" name="pareja_nombres">
                <label>Identificación</label><input type="text" name="pareja_id">
                <label>Edad</label><input type="number" name="pareja_edad">
                <label>Lugar de residencia</label><input type="text" name="pareja_residencia">
                <label>Tel. Fijo y/o celular</label><input type="text" name="pareja_telefono">
                <label>Lugar de trabajo</label><input type="text" name="pareja_trabajo">
                <label>EPS</label><input type="text" name="pareja_eps">
                <label>Correo electrónico</label><input type="email" name="pareja_correo">
                <label>Redes sociales</label><input type="text" name="pareja_redes">
            `;
        }
    });
}

// hijos detail
const hijosSelect = document.getElementById('tiene_hijos');
if (hijosSelect) {
    hijosSelect.addEventListener('change', function() {
        const cont = document.getElementById('hijos_detalle');
        cont.innerHTML = '';
        if (this.value === 'si') {
            cont.innerHTML = `
                <label>Cantidad de hijos mayores de edad</label>
                <input type="number" id="cantidad_hijos" name="cantidad_hijos" min="1">
                <div id="lista_hijos"></div>
            `;
            document.getElementById('cantidad_hijos').addEventListener('input', function () {
                const lista = document.getElementById('lista_hijos');
                lista.innerHTML = '';
                for (let i = 1; i <= this.value; i++) {
                    lista.innerHTML += `
                        <div class="hijo-block">
                            <h4>Hijo ${i}</h4>
                            <label>Nombres y apellidos</label><input type="text" name="hijo_${i}_nombres">
                            <label>Identificación</label><input type="text" name="hijo_${i}_id">
                            <label>Edad</label><input type="number" name="hijo_${i}_edad">
                            <label>Lugar de residencia</label><input type="text" name="hijo_${i}_residencia">
                            <label>Tel. fijo y/o celular</label><input type="text" name="hijo_${i}_telefono">
                            <label>Lugar de trabajo</label><input type="text" name="hijo_${i}_trabajo">
                            <label>EPS</label><input type="text" name="hijo_${i}_eps">
                            <label>Correo electrónico</label><input type="email" name="hijo_${i}_correo">
                            <label>Redes sociales</label><input type="text" name="hijo_${i}_redes">
                        </div>
                    `;
                }
            });
        }
    });
}

// actor radio change triggers recalculation of visible steps and reset index just after actor choice
const actorRadios = document.querySelectorAll('input[name="actor"]');
actorRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        // go to next step automatically
        showStep(currentStep + 1);
    });
});

// when document type changes we may need to skip or show the number step
const docTypeSelect = document.getElementById('ind_tipo_doc');
if (docTypeSelect) {
    docTypeSelect.addEventListener('change', () => {
        // recalc steps and redisplay current index; hiding/showing is done by
        // getVisibleSteps() so just call showStep again with same idx
        showStep(currentStep);
        // also clear/hide the number and expedición inputs if indocumentado
        ['8','9'].forEach(stepNum => {
            const stepEl = document.querySelector(`.step[data-step="${stepNum}"]`);
            if (docTypeSelect.value === 'Indocumentado') {
                if (stepEl) stepEl.style.display = 'none';
            } else {
                if (stepEl) stepEl.style.display = '';
            }
        });
        const numInput = document.getElementById('ind_num_doc');
        const expInputs = document.querySelectorAll('input[name="ind_expedicion_pais"], input[name="ind_expedicion_depto"], input[name="ind_expedicion_mpio"]');
        if (docTypeSelect.value === 'Indocumentado') {
            if (numInput) numInput.value = '';
            expInputs.forEach(i => i.value = '');
        }
    });
}

// victim document same behavior
const vicDocType = document.getElementById('vic_tipo_doc');
if (vicDocType) {
    vicDocType.addEventListener('change', () => {
        showStep(currentStep);
        ['105','111'].forEach(stepNum => {
            const stepEl = document.querySelector(`.step[data-step="${stepNum}"]`);
            if (vicDocType.value === 'Indocumentado') {
                if (stepEl) stepEl.style.display = 'none';
            } else {
                if (stepEl) stepEl.style.display = '';
            }
        });
        const numInput = document.getElementById('vic_num_doc');
        const expInputs = document.querySelectorAll('input[name="vic_exp_pais"], input[name="vic_exp_depto"], input[name="vic_exp_mpio"]');
        if (vicDocType.value === 'Indocumentado') {
            if (numInput) numInput.value = '';
            expInputs.forEach(i => i.value = '');
        }
    });
}

// initial question: hay víctimas? cantidad y generación de bloques
const vicHay = document.getElementById('vic_hay_victimas');
if (vicHay) {
    vicHay.addEventListener('change', () => {
        const cont = document.getElementById('vic_cantidad_container');
        if (vicHay.value === 'SI') {
            cont.style.display = 'block';
            window.vicMulti = true;
            // make quantity required
            const q = document.getElementById('vic_cantidad');
            if (q) q.setAttribute('required','required');
        } else {
            cont.style.display = 'none';
            window.vicMulti = false;
            const q = document.getElementById('vic_cantidad');
            if (q) { q.removeAttribute('required'); q.value = ''; }
            document.getElementById('victimas_container').innerHTML = '';
        }
        showStep(currentStep);
    });
}

const vicCantidad = document.getElementById('vic_cantidad');
function renderVictimBlocks(n) {
    const container = document.getElementById('victimas_container');
    container.innerHTML = '';
    for (let i = 1; i <= n; i++) {
        container.innerHTML += `
            <div class="victim-block" data-index="${i}" style="border:1px solid #e0e0e0;padding:12px;margin-bottom:10px;border-radius:6px;background:#fafafa;">
                <h4>Víctima ${i}</h4>
                <label>Primer nombre</label><input type="text" name="vic_${i}_primer_nombre" required>
                <label>Segundo nombre</label><input type="text" name="vic_${i}_segundo_nombre">
                <label>Primer apellido</label><input type="text" name="vic_${i}_primer_apellido" required>
                <label>Segundo apellido</label><input type="text" name="vic_${i}_segundo_apellido">
                <label>Tipo de documento</label>
                <select name="vic_${i}_tipo_doc" class="vic_tipo_doc_dyn" required>
                    <option value="">Seleccione</option>
                    <option value="Indocumentado">Indocumentado</option>
                    <option value="CC">CC (Cédula de Ciudadanía)</option>
                    <option value="TI">TI (Tarjeta de Identidad)</option>
                    <option value="RC">RC (Registro Civil de Nacimiento)</option>
                    <option value="CE">CE (Cédula de Extranjería)</option>
                    <option value="NIT">NIT (Número de Identificación Tributaria)</option>
                    <option value="PA">PA (Pasaporte)</option>
                    <option value="PEP/PPT">PEP/PPT</option>
                    <option value="CD">CD (Carné Diplomático)</option>
                </select>
                <div class="vic_num_doc_step">
                    <label>Número de documento</label>
                    <input type="text" name="vic_${i}_num_doc">
                </div>
                <label>Número de celular</label><input type="text" name="vic_${i}_celular">
                <label>Correo electrónico</label><input type="email" name="vic_${i}_correo">
                <label>Edad</label><input type="number" name="vic_${i}_edad">
                <label>GÉNERO</label>
                <select name="vic_${i}_genero" required>
                    <option value="">Seleccione</option>
                    <option value="HOMBRE">Hombre</option>
                    <option value="MUJER">Mujer</option>
                </select>
                <label>Orientación sexual</label>
                <select name="vic_${i}_orientacion" class="vic_orient_dyn" required>
                    <option value="">Seleccione</option>
                    <option value="MUJER">Mujer</option>
                    <option value="MUJER TRANS">Mujer Trans</option>
                    <option value="HOMBRE">Hombre</option>
                    <option value="HOMBRE TRANS">Hombre Trans</option>
                    <option value="OTRO">Otro</option>
                </select>
                <div class="vic_orient_otro_container" style="display:none;margin-top:8px;">
                    <label>¿Cuál?</label><input type="text" name="vic_${i}_orientacion_otro" class="vic_orient_otro">
                </div>
                <div class="vic_identario_container" style="display:none;margin-top:8px;">
                    <label>Nombre identario (si aplica)</label><input type="text" name="vic_${i}_nombre_identario" class="vic_identario">
                </div>
            </div>
        `;
    }
}

if (vicCantidad) {
    vicCantidad.addEventListener('input', () => {
        const n = parseInt(vicCantidad.value) || 0;
        renderVictimBlocks(n);
    });
}

// event delegation for dynamic victim orientation and doc-type behaviour
const victimasContainerRoot = document.getElementById('victimas_container');
if (victimasContainerRoot) {
    victimasContainerRoot.addEventListener('change', (e) => {
        const t = e.target;
        if (!t) return;
        // orientation selects
        if (t.classList && t.classList.contains('vic_orient_dyn')) {
            const block = t.closest('.victim-block');
            if (!block) return;
            const otroCont = block.querySelector('.vic_orient_otro_container');
            const identCont = block.querySelector('.vic_identario_container');
            const otroInput = block.querySelector('.vic_orient_otro');
            const identInput = block.querySelector('.vic_identario');
            if (t.value === 'OTRO') {
                if (otroCont) { otroCont.style.display = 'block'; if (otroInput) otroInput.setAttribute('required','required'); }
            } else { if (otroCont) { otroCont.style.display = 'none'; if (otroInput) otroInput.removeAttribute('required'); } }
            if (t.value === 'MUJER TRANS' || t.value === 'HOMBRE TRANS') {
                if (identCont) { identCont.style.display = 'block'; if (identInput) identInput.setAttribute('required','required'); }
            } else { if (identCont) { identCont.style.display = 'none'; if (identInput) identInput.removeAttribute('required'); } }
        }
        // dynamic doc-type: hide num doc if Indocumentado
        if (t.classList && t.classList.contains('vic_tipo_doc_dyn')) {
            const block = t.closest('.victim-block');
            if (!block) return;
            const numStep = block.querySelector('.vic_num_doc_step');
            const numIn = numStep ? numStep.querySelector('input') : null;
            if (t.value === 'Indocumentado') {
                if (numStep) numStep.style.display = 'none';
                if (numIn) { numIn.value = ''; numIn.removeAttribute('required'); }
            } else {
                if (numStep) numStep.style.display = '';
                if (numIn) numIn.setAttribute('required','required');
            }
        }
    });
}

// representative legal behavior
const repSelect = document.getElementById('menor_rep_es_victima');
if (repSelect) {
    repSelect.addEventListener('change', () => {
        const details = document.getElementById('menor_rep_detalles');
        if (repSelect.value === 'SI') {
            details.style.display = 'none';
            const copyField = (src, dst) => {
                const s = document.querySelector(`[name="${src}"]`);
                const d = document.querySelector(`[name="${dst}"]`);
                if (s && d) d.value = s.value;
            };
            copyField('vic_primer_nombre', 'menor_rep_nombres');
            copyField('vic_tipo_doc', 'menor_rep_tipo_doc');
            copyField('vic_num_doc', 'menor_rep_num_doc');
            copyField('vic_celular', 'menor_rep_telefono');
            copyField('vic_correo', 'menor_rep_correo');
            copyField('vic_res_barrio', 'menor_rep_direccion');
            details.querySelectorAll('input,select').forEach(i => i.removeAttribute('required'));
        } else {
            details.style.display = 'block';
            details.querySelectorAll('input,select').forEach(i => i.setAttribute('required','required'));
        }
        showStep(currentStep);
    });
}

// rep doc type rule
const repDocType = document.getElementById('menor_rep_tipo_doc');
if (repDocType) {
    repDocType.addEventListener('change', () => {
        showStep(currentStep);
        const numStep = document.getElementById('menor_rep_num_doc_step');
        const numIn = document.getElementById('menor_rep_num_doc');
        if (repDocType.value === 'Indocumentado') {
            if (numStep) numStep.style.display='none';
            if (numIn) numIn.value='';
        } else {
            if (numStep) numStep.style.display='';
        }
    });
}

// minor document rule
const menorDocType = document.getElementById('menor_tipo_doc');
if (menorDocType) {
    menorDocType.addEventListener('change', () => {
        showStep(currentStep);
        const numIn = document.getElementById('menor_num_doc');
        if (menorDocType.value === 'Indocumentado') {
            if (numIn) {
                numIn.value='';
                numIn.required=false;
            }
        } else if (numIn) {
            numIn.required=true;
        }
    });
}

// orientation and identario for minor
const menorOrient = document.getElementById('menor_orientacion');
if (menorOrient) {
    menorOrient.addEventListener('change', () => {
        const cont = document.getElementById('menor_orientacion_otro_container');
        const otro = document.getElementById('menor_orientacion_otro');
        const ident = document.getElementById('menor_identario_container');
        const identInput = document.getElementById('menor_nombre_identario');
        if (menorOrient.value === 'OTRO') {
            cont.style.display='block'; otro.setAttribute('required','required');
        } else { cont.style.display='none'; otro.removeAttribute('required'); }
        if (menorOrient.value==='MUJER TRANS' || menorOrient.value==='HOMBRE TRANS') {
            ident.style.display='block'; identInput.setAttribute('required','required');
        } else { ident.style.display='none'; identInput.removeAttribute('required'); }
    });
}

// minor community/disability
const menorCom = document.getElementById('menor_comunidad');
if (menorCom) {
    menorCom.addEventListener('change', () => {
        const cont = document.getElementById('menor_comunidad_otro_container');
        const otro = document.getElementById('menor_comunidad_otro');
        if (menorCom.value === 'Requiere interpretación lingüística' || menorCom.value === 'Otro') {
            cont.style.display='block'; otro.setAttribute('required','required');
        } else { cont.style.display='none'; otro.removeAttribute('required'); }
    });
}
const menorDisc = document.getElementById('menor_discapacidad');
if (menorDisc) {
    menorDisc.addEventListener('change', () => {
        const cont = document.getElementById('menor_discapacidad_otro_container');
        const otro = document.getElementById('menor_discapacidad_otro');
        if (menorDisc.value === 'Otra') {
            cont.style.display='block'; otro.setAttribute('required','required');
        } else { cont.style.display='none'; otro.removeAttribute('required'); }
    });
}
// orientation sexual helper for indiciado
const orientSelect = document.getElementById('ind_orientacion');
if (orientSelect) {
    orientSelect.addEventListener('change', () => {
        const cont = document.getElementById('orientacion_otro_container');
        const otroInput = document.getElementById('ind_orientacion_otro');
        const identCont = document.getElementById('ind_identario_container');
        const identInput = document.getElementById('ind_nombre_identario');
        if (orientSelect.value === 'OTRO' || orientSelect.value === 'Otro') {
            cont.style.display = 'block';
            otroInput.setAttribute('required','required');
        } else {
            cont.style.display = 'none';
            otroInput.removeAttribute('required');
        }
        if (orientSelect.value === 'MUJER TRANS' || orientSelect.value === 'HOMBRE TRANS') {
            if (identCont) { identCont.style.display = 'block'; if (identInput) identInput.setAttribute('required','required'); }
        } else { if (identCont) { identCont.style.display = 'none'; if (identInput) identInput.removeAttribute('required'); } }
    });
}

// orientation sexual helper for víctima includes identario field
const vicOrient = document.getElementById('vic_orientacion');
if (vicOrient) {
    vicOrient.addEventListener('change', () => {
        const cont = document.getElementById('vic_orientacion_otro_container');
        const otroInput = document.getElementById('vic_orientacion_otro');
        const identCont = document.getElementById('vic_identario_container');
        const identInput = document.getElementById('vic_nombre_identario');
        if (vicOrient.value === 'OTRO' || vicOrient.value === 'Otro') {
            cont.style.display = 'block';
            otroInput.setAttribute('required','required');
        } else {
            cont.style.display = 'none';
            otroInput.removeAttribute('required');
        }
        if (vicOrient.value === 'MUJER TRANS' || vicOrient.value === 'HOMBRE TRANS') {
            identCont.style.display = 'block';
            identInput.setAttribute('required','required');
        } else {
            identCont.style.display = 'none';
            identInput.removeAttribute('required');
        }
    });
}

// relación con la víctima helper
const relacionSelect = document.getElementById('vic_relacion');
if (relacionSelect) {
    relacionSelect.addEventListener('change', () => {
        const cont = document.getElementById('vic_relacion_otro_container');
        const otro = document.getElementById('vic_relacion_otro');
        if (relacionSelect.value === 'Otro') {
            cont.style.display = 'block';
            otro.setAttribute('required','required');
        } else {
            cont.style.display = 'none';
            otro.removeAttribute('required');
        }
    });
}

// parent information helpers
function setupParentSection(prefix) {
    const infoSelect = document.getElementById(prefix + '_tiene_info');
    const detallesDiv = document.getElementById(prefix + '_detalles');
    const fallecidoSel = document.getElementById(prefix + '_fallecido');

    if (infoSelect && detallesDiv) {
        infoSelect.addEventListener('change', () => {
            if (infoSelect.value === 'SI') {
                detallesDiv.style.display = 'block';
                // enable all inner inputs and selects
                detallesDiv.querySelectorAll('input, select').forEach(i => {
                    if (i.name !== prefix + '_tiene_info') {
                        i.disabled = false;
                        i.readOnly = false;
                        if (i.tagName === 'INPUT' || i.tagName === 'SELECT') i.value = '';
                        if (i.matches('input,select')) i.setAttribute('required', 'required');
                    }
                });
            } else if (infoSelect.value === 'NO') {
                detallesDiv.style.display = 'none';
                fillParentUnknown(prefix);
            }
            showStep(currentStep);
        });
    }
    if (fallecidoSel) {
        fallecidoSel.addEventListener('change', () => {
            parentFallecidoChanged(prefix);
        });
    }
}

setupParentSection('padre');
setupParentSection('madre');

// menu2 action buttons: open the corresponding action step
document.addEventListener('click', function(e) {

    const btn = e.target.closest && e.target.closest('.menu2-action');
    if (btn) {
        // permitimos únicamente indiciados y víctima
        // allow every action button (we'll ignore those without corresponding steps)
        // previously only indiciados/victima were permitted
        // mensajes/otros botones still do nothing due to absence of matching steps

        // Abrimos la acción seleccionada
        window.openAction = btn.dataset.action;

        // IMPORTANTE: ocultar menú mientras estemos dentro
        window.forceShowMenu2 = false;

        // Reiniciar índice
        currentStep = 0;

        const steps = getVisibleSteps();

        // try to find a step that explicitly matches this action (action-summary blocks)
        let idx = steps.findIndex(s => s.dataset.action === window.openAction);
        // if not found, fall back to the old group-based logic (data-type blocks)
        if (idx === -1) {
            if (window.openAction === 'datos_indiciados') {
                idx = steps.findIndex(s => s.dataset.type === 'indiciados');
            } else if (window.openAction === 'datos_victima') {
                idx = steps.findIndex(s => s.dataset.type === 'victimas');
            } else if (window.openAction === 'datos_menores') {
                idx = steps.findIndex(s => s.dataset.type === 'menores');
            } else if (window.openAction === 'datos_testigos') {
                idx = steps.findIndex(s => s.dataset.type === 'testigos');
            } else if (window.openAction === 'relato_victima') {
                // explicitly find relato_victima steps
                idx = steps.findIndex(s => s.dataset.action === 'relato_victima');
            } else if (window.openAction === 'actuaciones_pj') {
                // if there are specific PJ action steps, prefer them
                idx = steps.findIndex(s => s.dataset.action === 'actuaciones_pj' || s.dataset.type === 'pj');
            }
        } else {
            // If we found an action-summary step but there's also a data-type block
            // for the same concept (e.g. detailed 'menores' fields), prefer the data-type step.
            if (window.openAction === 'datos_menores') {
                const typeIdx = steps.findIndex(s => s.dataset.type === 'menores');
                if (typeIdx >= 0) idx = typeIdx;
            } else if (window.openAction === 'datos_testigos') {
                const typeIdx = steps.findIndex(s => s.dataset.type === 'testigos');
                if (typeIdx >= 0) idx = typeIdx;
            }
        }

        if (idx >= 0) {
            // prefer the detailed data-type victim steps over the action-summary
            if (window.openAction === 'datos_victima') {
                const typeIdx = steps.findIndex(s => s.dataset.type === 'victimas');
                if (typeIdx >= 0) idx = typeIdx;
            }
            showStep(idx);
        }

        return;
    }

    const back = e.target.closest && e.target.closest('.back-to-menu');
    if (back) {
        window.openAction = null;
        window.forceShowMenu2 = true;
        document.body.classList.add('show-menu');
        currentStep = 0;
        // reset any multi-victim mode when returning to menu
        window.vicMulti = false;
        showStep(0);
        return;
    }

});

// botón volver al menú principal (cambiar delito)
const backToDelitos = document.getElementById('backToDelitos');
if (backToDelitos) {
    backToDelitos.addEventListener('click', () => {
        // confirmar si hay datos ingresados
        if (confirm('¿Desea volver y cambiar de delito? Se perderán los datos no guardados.')) {
            window.location.href = '../../index.html';
        }
    });
}

// helper to fill fields for a parent if they have no info
function fillParentUnknown(prefix) {
    const details = document.getElementById(prefix + '_detalles');
    if (details) {
        // first handle fallecido select separately
        const fall = details.querySelector(`select[name="${prefix}_fallecido"]`);
        if (fall) {
            fall.value = 'DESCONOCE';
            fall.readOnly = true;
            fall.removeAttribute('required');
        }
        const inputs = details.querySelectorAll('input');
        inputs.forEach(i => {
            i.value = 'DESCONOCE';
            i.readOnly = true;
            i.removeAttribute('required');
        });
    }
}

// helper to handle the fallecido logic inside a parent details container
function parentFallecidoChanged(prefix) {
    const sel = document.getElementById(prefix + '_fallecido');
    const campos = document.getElementById(prefix + '_detalles_campos');
    if (!sel || !campos) return;
    const inputs = campos.querySelectorAll('input');
    if (sel.value === 'SI') {
        // leave only nombres editable, rest N/A and readonly
        inputs.forEach(i => {
            if (i.name === prefix + '_nombres') {
                i.readOnly = false;
                i.setAttribute('required', 'required');
                i.value = '';
            } else {
                i.value = 'N/A';
                i.readOnly = true;
                i.removeAttribute('required');
            }
        });
    } else if (sel.value === 'NO') {
        // enable all and clear N/A
        inputs.forEach(i => {
            i.readOnly = false;
            i.setAttribute('required', 'required');
            if (i.value === 'N/A') i.value = '';
        });
    }
}

// schedule robot and download pdf
const scheduleBtn = document.getElementById('scheduleBtn');
const messageDiv = document.createElement('div');
messageDiv.id = 'message';
document.querySelector('.container').appendChild(messageDiv);

if (scheduleBtn) {
    scheduleBtn.addEventListener('click', () => {
        messageDiv.className = 'alert';
        messageDiv.textContent = 'Por favor espere mientras se obtiene respuesta, los formatos serán descargados en breves';
        setTimeout(() => {
            generatePDF();
            messageDiv.textContent = 'Descarga iniciada.';
        }, 1000);
    });
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;
    const formData = new FormData(form);
    let lastSection = '';
    for (let [key, value] of formData.entries()) {
        let section = '';
        if (key.startsWith('patru_')) section = 'PATRULLEROS';
        else if (key.startsWith('pj_')) section = 'POLICÍA JUDICIAL';
        else if (key.startsWith('ind_')) section = 'INDICIADO(S)';
        else if (key.startsWith('vic_')) section = 'VÍCTIMAS';
        else if (key.startsWith('testigo_')) section = 'TESTIGOS';
        else if (key.startsWith('padre_')) section = 'PADRE';
        else if (key.startsWith('madre_')) section = 'MADRE';
        else if (key.startsWith('pareja_')) section = 'PAREJA';
        else if (key.startsWith('hijo_')) section = 'HIJOS';
        else if (key.startsWith('menor_rep_')) section = 'REPRESENTANTE LEGAL';
        else if (key.startsWith('menor_')) section = 'MENOR';
        else if (key.startsWith('actuacion') || key.startsWith('relato') || key.startsWith('datos_') || key.startsWith('actuaciones_')) section = 'ACTUACIONES';
        if (section && section !== lastSection) {
            y += 5;
            doc.setFontSize(12);
            doc.text(section, 10, y);
            y += 7;
            doc.setFontSize(10);
            lastSection = section;
        }
        doc.text(`${key}: ${value}`, 10, y);
        y += 7;
        if (y > 280) { doc.addPage(); y = 10; }
    }
    doc.save('datos.pdf');
}

// ===== RELATO VÍCTIMA: Lógica de preguntas condicionales =====

// Auto-grow textareas
function setupAutoGrowTextareas() {
    const autoGrowAreas = document.querySelectorAll('textarea.auto-grow');
    autoGrowAreas.forEach(textarea => {
        const resizeTextarea = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        };
        textarea.addEventListener('input', resizeTextarea);
        // adjust on page load
        resizeTextarea();
    });
}
setupAutoGrowTextareas();

// Relato: Ha denunciado previamente?
const relatoDenunciado = document.getElementById('relato_ha_denunciado');
if (relatoDenunciado) {
    relatoDenunciado.addEventListener('change', function() {
        const container = document.getElementById('relato_denuncias_previas');
        if (this.value === 'si') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Tiene hijos?
const relatoHijos = document.getElementById('relato_tiene_hijos');
if (relatoHijos) {
    relatoHijos.addEventListener('change', function() {
        const container = document.getElementById('relato_hijos_container');
        if (this.value === 'si') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Cantidad de hijos - generar campos dinámicos
const relatoCantHijos = document.getElementById('relato_cantidad_hijos');
if (relatoCantHijos) {
    relatoCantHijos.addEventListener('change', function() {
        const num = parseInt(this.value) || 0;
        const detailContainer = document.getElementById('relato_hijos_detalle');
        detailContainer.innerHTML = '';
        for (let i = 1; i <= num; i++) {
            detailContainer.innerHTML += `
                <div style="border:1px solid #ccc; padding:10px; margin-top:10px; border-radius:6px; background:#fafafa;">
                    <label>Hijo(a) ${i} - Nombre</label>
                    <input type="text" name="relato_hijo_${i}_nombre">
                    <label>Edad</label>
                    <input type="number" name="relato_hijo_${i}_edad" min="0">
                </div>
            `;
        }
    });
}

// Relato: Tipo de maltrato - mostrar "otro" cuando se selecciona el checkbox OTRO
const relatoMaltratosCheckboxes = document.querySelectorAll('input[name="relato_tipo_maltrato"]');
if (relatoMaltratosCheckboxes.length > 0) {
    relatoMaltratosCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            // Verificar si está marcado el checkbox de OTRO
            const otroMarcado = Array.from(relatoMaltratosCheckboxes).some(cb => cb.value === 'OTRO' && cb.checked);
            const otroDiv = document.getElementById('relato_maltrato_otro');
            if (otroMarcado) {
                otroDiv.style.display = 'block';
            } else {
                otroDiv.style.display = 'none';
            }
        });
    });
}

// Relato: Tipo de arma - mostrar detalles
const relatoArma = document.getElementById('relato_tipo_arma');
if (relatoArma) {
    relatoArma.addEventListener('change', function() {
        const detallesDiv = document.getElementById('relato_arma_detalles');
        if (this.value !== '' && this.value !== 'sin_arma') {
            detallesDiv.style.display = 'block';
        } else {
            detallesDiv.style.display = 'none';
        }
    });
}

// Relato: Atención recibida?
const relatoAtencion = document.getElementById('relato_atencion_recibida');
if (relatoAtencion) {
    relatoAtencion.addEventListener('change', function() {
        const container = document.getElementById('relato_atencion_detalles');
        if (this.value === 'si') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Incapacidad o dictamen?
const relatoIncapacidad = document.getElementById('relato_incapacidad');
if (relatoIncapacidad) {
    relatoIncapacidad.addEventListener('change', function() {
        const container = document.getElementById('relato_incapacidad_detalles');
        if (this.value === 'si') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Maltrato anterior?
const relatoMaltratoAnterior = document.getElementById('relato_maltrato_anterior');
if (relatoMaltratoAnterior) {
    relatoMaltratoAnterior.addEventListener('change', function() {
        const container = document.getElementById('relato_maltrato_anterior_detalles');
        if (this.value === 'si') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Conductas psicológicas?
const relatoConducatasPsico = document.querySelectorAll('select[name="relato_conductas_psicologicas"]');
if (relatoConducatasPsico.length > 0) {
    relatoConducatasPsico[0].addEventListener('change', function() {
        const container = document.getElementById('relato_conductas_psico_detalles');
        if (this.value === 'si') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Discapacidad?
const relatoDiscapacidad = document.getElementById('relato_discapacidad');
if (relatoDiscapacidad) {
    relatoDiscapacidad.addEventListener('change', function() {
        const container = document.getElementById('relato_discapacidad_detalles');
        if (this.value === 'si') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Consume sustancias?
const relatoSustancias = document.getElementById('relato_consume_sustancias');
if (relatoSustancias) {
    relatoSustancias.addEventListener('change', function() {
        const container = document.getElementById('relato_sustancias_detalles');
        if (this.value === 'si') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Rehabilitación?
const relatoRehabilitacion = document.querySelectorAll('select[name="relato_rehabilitacion"]');
if (relatoRehabilitacion.length > 0) {
    relatoRehabilitacion[0].addEventListener('change', function() {
        const container = document.getElementById('relato_rehabilitacion_detalles');
        if (this.value === 'si') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Enfermedad mental?
const relatoEnfermedad = document.getElementById('relato_enfermedad_mental');
if (relatoEnfermedad) {
    relatoEnfermedad.addEventListener('change', function() {
        const container = document.getElementById('relato_enfermedad_detalles');
        if (this.value === 'si') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Hay testigos?
const relatoTestigos = document.querySelectorAll('select[name="relato_hay_testigos"]');
if (relatoTestigos.length > 0) {
    relatoTestigos[0].addEventListener('change', function() {
        const container = document.getElementById('relato_testigos_detalles');
        if (this.value === 'si') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Tiene evidencias?
const relatoEvidencias = document.querySelectorAll('select[name="relato_tiene_evidencias"]');
if (relatoEvidencias.length > 0) {
    relatoEvidencias[0].addEventListener('change', function() {
        const container = document.getElementById('relato_evidencias_detalles');
        if (this.value === 'si') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Algo más que agregar?
const relatoAlgoMas = document.getElementById('relato_algo_mas');
if (relatoAlgoMas) {
    relatoAlgoMas.addEventListener('change', function() {
        const container = document.getElementById('relato_final_container');
        if (this.value === 'si') {
            container.style.display = 'block';
            // re-setup auto-grow for newly visible textarea
            const textarea = document.getElementById('relato_algo_mas_detalle');
            if (textarea) {
                const resizeTextarea = () => {
                    textarea.style.height = 'auto';
                    textarea.style.height = textarea.scrollHeight + 'px';
                };
                textarea.addEventListener('input', resizeTextarea);
                resizeTextarea();
            }
        } else {
            container.style.display = 'none';
        }
    });
}

// Relato: Copiar denuncia completa con formato P/R (usando event delegation)
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'relato_copy_btn') {
        const formData = new FormData(form);
        let output = '';
        
        const preguntas = {
            'relato_descripcion': 'Descripción de los hechos',
            'relato_donde': '¿Dónde ocurrieron los hechos?',
            'relato_fecha_hora': '¿En qué fecha y hora ocurrieron los hechos?',
            'relato_autor': '¿Quién fue el autor de los hechos?',
            'relato_ubicacion_denunciado': '¿Dónde se ubica el denunciado?',
            'relato_ha_denunciado': '¿Ha denunciado previamente a la persona que cometió el delito?',
            'relato_detalles_previas': 'Detalles de denuncias previas',
            'relato_parentesco': '¿Qué parentesco o relación tiene con la persona que va a denunciar?',
            'relato_tiene_hijos': '¿Tiene hijos con la persona que va a denunciar?',
            'relato_cantidad_hijos': 'Cantidad de hijos',
            'relato_tipo_maltrato': '¿Qué tipo de maltrato ha recibido?',
            'relato_maltrato_otro_tipo': 'Tipo de maltrato - Especifique',
            'relato_maltrato_explicacion': 'Explicación del maltrato',
            'relato_lesiones': 'Describa las lesiones causadas',
            'relato_tipo_arma': '¿Con qué se produjo la agresión?',
            'relato_arma_caracteristicas': 'Características del arma',
            'relato_atencion_recibida': '¿Ha recibido atención médica, psicológica, social u otra?',
            'relato_atencion_detalle': '¿Cuál, dónde y cuándo?',
            'relato_incapacidad': '¿Cuenta con incapacidad o dictamen médico o psicológico?',
            'relato_incapacidad_detalle': 'Detalles de incapacidad o dictamen',
            'relato_maltrato_anterior': '¿Con anterioridad se ha presentado esta u otra clase de maltrato?',
            'relato_maltrato_anterior_detalle': 'Detalles de maltrato anterior',
            'relato_conductas_psicologicas': '¿Le ha intimidado, manipulado, humillado o aislado?',
            'relato_conductas_psico_detalle': 'Detalles de conductas psicológicas',
            'relato_manutension': '¿Quién asume la manutención económica de la víctima?',
            'relato_discapacidad': '¿Tiene alguna condición de discapacidad?',
            'relato_discapacidad_tipo': 'Tipo de discapacidad',
            'relato_consume_sustancias': '¿El denunciado consume sustancias alucinógenas o alcohólicas?',
            'relato_sustancia_tipo': 'Tipo de sustancia',
            'relato_rehabilitacion': '¿Ha sido tratado en algún centro de rehabilitación?',
            'relato_rehabilitacion_detalle': 'Centro de rehabilitación - Detalles',
            'relato_enfermedad_mental': '¿El denunciado sufre de alguna enfermedad mental?',
            'relato_enfermedad_tratamiento': 'Tratamiento por enfermedad mental',
            'relato_hay_testigos': '¿Existen testigos de los hechos?',
            'relato_testigos_info': 'Información de testigos',
            'relato_tiene_evidencias': '¿Tiene algún elemento o evidencia?',
            'relato_evidencias_info': 'Elementos o evidencias',
            'relato_algo_mas': '¿Tiene algo más que desee agregar?',
            'relato_algo_mas_detalle': 'Información adicional'
        };
        
        for (let [key, value] of formData.entries()) {
            if (preguntas[key] && value.trim()) {
                output += `P/${preguntas[key]}\n`;
                output += `R/${value}\n\n`;
            }
        }
        
        // También agregar campos de hijos dinámicos
        let hijoNum = 1;
        while (document.querySelector(`input[name="relato_hijo_${hijoNum}_nombre"]`)) {
            const nombre = document.querySelector(`input[name="relato_hijo_${hijoNum}_nombre"]`).value;
            const edad = document.querySelector(`input[name="relato_hijo_${hijoNum}_edad"]`).value;
            if (nombre || edad) {
                output += `P/Hijo(a) ${hijoNum} - Nombre\n`;
                output += `R/${nombre || 'NO ESPECIFICADO'}\n\n`;
                output += `P/Hijo(a) ${hijoNum} - Edad\n`;
                output += `R/${edad || 'NO ESPECIFICADO'}\n\n`;
            }
            hijoNum++;
        }
        
        // Mostrar el textarea con el contenido formateado
        const outputArea = document.getElementById('relato_formatted_output');
        outputArea.value = output;
        outputArea.style.display = 'block';
        
        // Copiar al portapapeles
        outputArea.select();
        document.execCommand('copy');
        
        // Mostrar mensaje de confirmación
        const messageDiv = document.getElementById('relato_copy_message');
        messageDiv.textContent = '✓ Denuncia completa copiada al portapapeles';
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
});

// initialize first step
showStep(0);
updateMenuMarks();

// ensure parent sections honour any preselected values (e.g. when navigating back)
['padre','madre'].forEach(prefix => {
    const sel = document.getElementById(prefix + '_tiene_info');
    if (sel) sel.dispatchEvent(new Event('change'));
    const fal = document.getElementById(prefix + '_fallecido');
    if (fal) fal.dispatchEvent(new Event('change'));
});
// also trigger document-type handlers
if (docTypeSelect) docTypeSelect.dispatchEvent(new Event('change'));
if (vicDocType) vicDocType.dispatchEvent(new Event('change'));
if (repSelect) repSelect.dispatchEvent(new Event('change'));
if (repDocType) repDocType.dispatchEvent(new Event('change'));
if (menorDocType) menorDocType.dispatchEvent(new Event('change'));
// orientation and relation
if (orientSelect) orientSelect.dispatchEvent(new Event('change'));
if (vicOrient) vicOrient.dispatchEvent(new Event('change'));
if (menorOrient) menorOrient.dispatchEvent(new Event('change'));
if (relacionSelect) relacionSelect.dispatchEvent(new Event('change'));
if (menorCom) menorCom.dispatchEvent(new Event('change'));
if (menorDisc) menorDisc.dispatchEvent(new Event('change'));

