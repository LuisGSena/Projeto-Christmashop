const openModalButtons = document.querySelectorAll(".open-modal");
const openModalDeleteButtons = document.querySelectorAll(".open-modal-delete");
const closeModalButton = document.querySelectorAll("#close-modal");
const closeModalDeleteButton = document.querySelector("#close-modal-delete");
const fade = document.querySelector("#fade");
const modal = document.querySelector("#modal");

const fadeDelete = document.querySelector("#fadeDelete");
const modalDelete = document.querySelector("#modalDelete");

const toggleModal = () => {
  modal.classList.toggle("hide");
  fade.classList.toggle("hide");
};
const toggleModalDelete = () => {
  modalDelete.classList.toggle("hideDelete");
  fadeDelete.classList.toggle("hideDelete");
};

openModalButtons.forEach((el) => {
  el.addEventListener("click", () => toggleModal());
});

openModalDeleteButtons.forEach((el) => {
  el.addEventListener("click", () => toggleModalDelete());
});

closeModalDeleteButton.forEach((el) => {
  el.addEventListener("click", () => toggleModalDelete());
});

[closeModalButton, fade].forEach((el) => {
  el.addEventListener("click", () => toggleModal());
});

function preencherFormulario(product_data) {
  let idProdutoForms = document.querySelectorAll("#idProdutoForm");
  let nomeProdutoForms = document.querySelectorAll("#name-edit");
  let descricaoProdutoForms = document.querySelectorAll("#descricao-edit");
  let qntdestoqueForms = document.querySelectorAll("#quantidade-edit");
  let valorunidadeForms = document.querySelectorAll("#valor-edit");
  
  idProdutoForms.forEach((el) => {
    el.value = product_data.idProduto;
  });

  nomeProdutoForms.forEach((el) => {
    el.value = product_data.nomeProduto;
  });

  descricaoProdutoForms.forEach((el) => {
    el.value = product_data.descricao;
  });

  qntdestoqueForms.forEach((el) => {
    el.value = product_data.qntdestoque;
  });

  valorunidadeForms.forEach((el) => {
    el.value = product_data.valorunidade;
  });

}

function cleanFormulario() {
  let idProdutoForm = document.querySelector("#idProdutoForm");
  let nomeProdutoForm = document.querySelector("#name-edit");
  let descricaoProdutoForm = document.querySelector("#descricao-edit");
  let qntdestoqueForm = document.querySelector("#quantidade-edit");
  let valorunidadeForm = document.querySelector("#valor-edit");

  idProdutoForm.value = "";
  nomeProdutoForm.value = "";
  descricaoProdutoForm.value = "";
  qntdestoqueForm.value = "";
  valorunidadeForm.value = "";
  toggleModal();
}

function cleanFormularioDelete() {
  let idProdutoForm = document.querySelector("#idProdutoForm");
  let nomeProdutoForm = document.querySelector("#name-edit");
  let descricaoProdutoForm = document.querySelector("#descricao-edit");
  let qntdestoqueForm = document.querySelector("#quantidade-edit");
  let valorunidadeForm = document.querySelector("#valor-edit");

  idProdutoForm.value = "";
  nomeProdutoForm.value = "";
  descricaoProdutoForm.value = "";
  qntdestoqueForm.value = "";
  valorunidadeForm.value = "";
  toggleModalDelete();
}
