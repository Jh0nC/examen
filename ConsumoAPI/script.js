/* page control for crud */
/* index.html */
/* consumo y renderizado de api de peajes */
const APIpeajesURL = 'https://www.datos.gov.co/resource/7gj8-j6i3.json';

async function GetTollInfo() {
  var tolls = await fetch(APIpeajesURL).catch(err => console.log(err));
  return tolls.json();
}

async function renderOptionTolls() {
  const tollsOption = await document.querySelector('#tollbox-input');
  var tolls = await GetTollInfo();
  var seenPeajes = new Set(); // Conjunto para almacenar los peajes ya vistos
  tolls.forEach(toll => {
    const peajeKey = `${toll.idpeaje}-${toll.peaje}`;
    if (seenPeajes.has(peajeKey)) {
      return;
    }
    seenPeajes.add(peajeKey);
    let option = `<option value="${toll.peaje}">${toll.peaje}</option>`;
    tollsOption.innerHTML += option;
  });
}
renderOptionTolls();

/* form control to post */
async function createPago() {
  // vars
  var vehiclePlate = document.querySelector('#plate-input').value;
  var tollName = document.querySelector('#tollbox-input').value;
  var idCategory = document.querySelector('#category-tollbox-input').value;
  var registrationDate = new Date();
  var currentToll = await fetch(`${APIpeajesURL}?peaje=${tollName}&idcategoriatarifa=${idCategory}`).catch(err => console.log(err));
  var currentTollJson = await currentToll.json();
  var value = parseFloat(currentTollJson[0].valor);
  var pago = {
    vehiclePlate: vehiclePlate,
    tollName: tollName,
    idCategory: idCategory,
    registrationDate: registrationDate.toISOString(),
    value: value,
  };
  console.log(pago);
  await CreatePago(pago);
  location.reload(); // Reload the page to see the new record
}

/* registros.html */
/* Render / list */
const tbodyRecord = document.querySelector('#tbody-records');
const modals = document.querySelector('#modals');

async function listRecords() {
  var records = await GetPagos();
  records.forEach(record => {
    tbodyRecord.innerHTML += `
    <tr>
      <th scope="row">${record.id}</th>
      <td>${record.vehiclePlate}</td>
      <td>${record.tollName}</td>
      <td class="for-category">${record.idCategory}</td>
      <td>${record.registrationDate}</td>
      <td>${record.value}</td>
      <td class="d-flex gap-3">
        <button type="button" class="btn btn-outline-info w-auto shadow" data-bs-toggle="modal" data-bs-target="#modal-${record.id}">Editar</button>
        <button class="btn btn-outline-danger w-auto shadow" onclick="deletePago(${record.id})">Eliminar</button>
      </td>
    </tr>
    `;
    modals.innerHTML += `
    <div class="modal fade" id="modal-${record.id}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modalLabel-${record.id}" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="modalLabel-${record.id}">Editar Pago</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form id="edit-form-${record.id}">
              <div class="mb-3">
                <label for="edit-plate-${record.id}" class="form-label">Placa</label>
                <input type="text" class="form-control" id="edit-plate-${record.id}" value="${record.vehiclePlate}">
              </div>
              <div class="mb-3">
                <label for="edit-toll-${record.id}" class="form-label">Peaje</label>
                <input type="text" class="form-control" id="edit-toll-${record.id}" value="${record.tollName}">
              </div>
              <div class="mb-3">
                <label for="edit-category-${record.id}" class="form-label">Categoría</label>
                <input type="text" class="form-control" id="edit-category-${record.id}" value="${record.idCategory}">
              </div>
              <div class="mb-3">
                <label for="edit-value-${record.id}" class="form-label">Valor</label>
                <input type="text" class="form-control" id="edit-value-${record.id}" value="${record.value}">
              </div>
              <button type="button" class="btn btn-primary" onclick="updatePago(${record.id})">Guardar cambios</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    `;
  });
}
listRecords();

/* --------- HTTP Methods ------------ */
async function GetPagos() {
  var pagos = await fetch('http://localhost:5219/pagos').catch(err => console.log(err));
  return pagos.json();
}

async function GetPagoById(id) {
  var pago = await fetch(`http://localhost:5219/pago/${id}`).catch(err => console.log(err));
  return pago.json();
}

async function CreatePago(newPago) {
  await fetch('http://localhost:5219/pagos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newPago)
  })
    .then(response => response.json())
    .then(data => console.log("Created Pago:", data))
    .catch(error => console.error(error));
}

async function UpdatePago(id) {
  var vehiclePlate = document.querySelector(`#edit-plate-${id}`).value;
  var tollName = document.querySelector(`#edit-toll-${id}`).value;
  var idCategory = document.querySelector(`#edit-category-${id}`).value;
  var value = document.querySelector(`#edit-value-${id}`).value;

  var pagoUpdate = {
    vehiclePlate: vehiclePlate,
    tollName: tollName,
    idCategory: idCategory,
    value: parseFloat(value)
  };

  await fetch(`http://localhost:5219/pagos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(pagoUpdate)
  })
    .then(response => response.json())
    .then(data => console.log("Updated Pago:", data))
    .catch(error => console.error(error));
  location.reload(); // Reload the page to see the updated record
}

async function DeletePago(id) {
  await fetch(`http://localhost:5219/pagos/${id}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(data => console.log("Deleted Pago:", data))
    .catch(error => console.error(error));
  location.reload();
}
