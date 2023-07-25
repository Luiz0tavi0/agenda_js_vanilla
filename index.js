import LocalStorageCRUD from "./crudAgenda.js";
const storage = new LocalStorageCRUD("agenda");
const tabelaContatos = document.querySelector(".table");
renderListaContatos();

const form = {
  indexInForm: null,
  formularioContato: document.getElementById("formContato"),
  inputNomeContato: document.getElementById("nomeContato"),
  inputTelefoneContato: document.getElementById("foneContato"),
  inputEnderecoContato: document.getElementById("enderecoContato"),
  btnCancel: document.getElementById("btn_cancel"),
  btnOk: document.getElementById("btn_ok"),
  allInputs: Array.from(document.querySelectorAll("input")),
  mode: "new",
  setMode: function (mode) {
    this.mode = mode; //"edit" : "new";
    console.log("Modo alterado para:", this.mode);
  },
  formData: function getFormValues() {
    return {
      name: form.inputNomeContato.value,
      fone: form.inputTelefoneContato.value,
      endereco: form.inputEnderecoContato.value,
    };
  },
  fillForm: function () {
    const contato = storage.getById(form.indexInForm);
    form.inputNomeContato.value = contato.name;
    form.inputTelefoneContato.value = contato.fone;
    form.inputEnderecoContato.value = contato.endereco;
  },
};

function deleteContato() {
  storage.delete(form.indexInForm);
}

tabelaContatos.addEventListener("click", function (event) {
  const row = event.target.closest(".table-row:not(.header-row)");
  if (row) {
    const id = Number(row.id.split("_")[1]);
    // console.log("ID:", id);
    form.indexInForm = id;
    form.fillForm();
    const deleteIcon = event.target.closest(".delete-icon");
    const editIcon = event.target.closest(".edit-icon");
    if (deleteIcon) {
      deleteContato(id);
      renderListaContatos();
    }
    if (editIcon) {
      form.setMode("edit");
      mudaStatusBotaoSalvar(false);
    }
  }
});

function checkInputs() {
  const nomeContato = form.inputNomeContato;
  const telefoneContato = form.inputTelefoneContato;
  const enderecoContato = form.inputEnderecoContato;

  if (nomeContato.value === "")
    setErrorFor(nomeContato, "O nome não deve ser vazio");
  else setValidFor(nomeContato);
  if (telefoneContato.value === "")
    setErrorFor(telefoneContato, "O telefone não deve ser vazio.");
  else setValidFor(telefoneContato);
  if (enderecoContato.value === "")
    setErrorFor(enderecoContato, "O endereço não deve ser vazio.");
  else setValidFor(enderecoContato);

  const activeButton = !!document.querySelectorAll(".error-validation").length;
  mudaStatusBotaoSalvar(activeButton);
}

form.allInputs.forEach((inputTextField) => {
  inputTextField.addEventListener("input", (e) => {
    checkInputs();
  });
});

form.formularioContato.addEventListener("submit", (e) => {
  e.preventDefault();
  // Checa se é um novo registro ou atualização.
  
  if (form.mode === "new") addNovoContato();
  else atualizaContato();
});

function mudaStatusBotaoSalvar(status) {
  form.btnOk.disabled = status;
  // console.log("mudaStatusBotaoSalvar", status);
}
function atualizaContato() {
  storage.update(form.indexInForm, form.formData());
  renderListaContatos();
}

function addNovoContato() {
  storage.create(form.formData());
  resetForm();
  renderListaContatos();
}

form.btnCancel.addEventListener("click", (e) => {
  // console.log("botão CANCEL clicado");
  resetForm();
  resetErrors();
});

const resetForm = () => {
  form.formularioContato.reset();
  form.setMode("new");
  mudaStatusBotaoSalvar(true);
};
const resetErrors = () => {
  form.allInputs.forEach((inputElement) => {
    setValidFor(inputElement);
  });
};
function setErrorFor(element, msg) {
  const inputFieldset = element.closest("fieldset");
  inputFieldset.querySelector("small").innerText = msg;
  inputFieldset.classList.add("error-validation");
}
function setValidFor(element) {
  // console.log("setValidFor: ", element);
  const inputFieldset = element.closest("fieldset");
  inputFieldset.classList.remove("error-validation");
}

function createRowContato(contato) {
  const rowStr = `<div class="table-row" id="tblRowId_${contato.id}">
 <div class="table-cell min-cell">${contato.id}</div>
 <div class="table-cell">${contato.name}</div>
 <div class="table-cell medium-cell">${contato.fone}</div>
 <div class="table-cell large-cell">${contato.endereco}</div>
 <div class="table-cell min-cell contact-edit">
  <span class="edit-icon"> <i class="fas fa-edit"></i></span>
  <span class="delete-icon"><i class="fa fa-trash" aria-hidden="true"></i></span>
 </div>
</div>`;

  // const range = document.createRange();
  // const fragment = range.createContextualFragment(rowStr);
  // const tblRow = fragment.firstElementChild;

  return rowStr;
}
function cleanTableRows() {
  // tabelaContatos = document.querySelector(".table");
  const tableRows = tabelaContatos.querySelectorAll(
    "div.table-row:not(.header-row)"
  );
  for (let row of tableRows) {
    // console.log(row);
    tabelaContatos.removeChild(row);
  }
}

function renderListaContatos() {
  cleanTableRows();

  let contatoRow = "";
  for (let contato of storage.getAll()) {
    contatoRow += createRowContato(contato);
  }
  tabelaContatos.insertAdjacentHTML("beforeend", contatoRow);
}
