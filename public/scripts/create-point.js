//ao carregar o a página - popula os estados brasileiros
const populateUfs = () => {
  const ufSelect = document.querySelector("select[name=uf]");
  fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then((res) => res.json())
    .then((states) => {
      for (state of states) {
        ufSelect.innerHTML += `<option value='${state.id}'>${state.nome}</option>`;
      }
    });
};

populateUfs();

//popula as cidades referentes ao estado selecionado
const getCities = (event) => {
  const citySelect = document.querySelector("select[name=city]");
  const stateInput = document.querySelector("input[name=state]");
  const ufValue = event.target.value;

  const indexOfSelectedState = event.target.selectedIndex;
  stateInput.value = event.target.options[indexOfSelectedState].text;

  const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`;

  citySelect.innerHTML = '<option value="">Selecione a cidade</option>'
  citySelect.disabled = true;

  fetch(url)
    .then((res) => res.json())
    .then((cities) => {
      for (city of cities) {
        citySelect.innerHTML += `<option value='${city.nome}'>${city.nome}</option>`;
      }
    });
  citySelect.disabled = false;
};

//ao selecionar o estado - chama a função para popular as cidades
document.querySelector("select[name=uf").addEventListener("change", getCities);

//itens de coleta
const itemsToCollect = document.querySelectorAll('.items-grid li')

const collectedItems = document.querySelector('input[name=items]')
let selectedItems = []

const handleSelectedItem = event =>{
  const itemLi = event.target
  //add ou remover classe
  itemLi.classList.toggle('selected')

  const itemId = itemLi.dataset.id

  //verificar se existem itens selecionados
  //se sim, pegar os itens selecionados
  const alreadySelected = selectedItems.findIndex(item => item == itemId)
  //se já estiver selecionado, tirar da seleção
  if (alreadySelected >= 0) {
    //filtra o item desselecionado
    const filteredItems = selectedItems.filter(item => item != itemId)
    selectedItems = filteredItems
  } else {
    //se não estiver selecionado, add à seleção
    selectedItems.push(itemId)
  }
  console.log(selectedItems)
  //atualizar o campo escondido com os dados selecionados
  collectedItems.value = selectedItems
}

for (item of itemsToCollect){
  item.addEventListener('click', handleSelectedItem)
}

