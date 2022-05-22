const criptoo = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#criptomonedas");
const monedaSelectfiead = document.querySelector("#moneda");
const formulari = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const busquedaOb = {
  moneda: "",
  criptomoneda: "",
};

const obtenerCriptos = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCripto();
  formulari.addEventListener("submit", subform);
  monedaSelect.addEventListener("change", valor);
  monedaSelectfiead.addEventListener("change", valor);
});

function consultarCripto() {
  fetch(
    "https://min-api.cryptocompare.com/data/top/mktcapfull?llimit=10&tsym=USD"
  )
    .then((res) => res.json())
    .then((d) => obtenerCriptos(d.Data))
    .then((cripto) => selectCripto(cripto));
}

function selectCripto(cripto) {
  cripto.forEach((e) => {
    const { FullName, Name } = e.CoinInfo;
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptoo.appendChild(option);
  });
}
// DISPLAY: {
//     USD: { PRICE },
//   },
function valor(e) {
  console.log(busquedaOb);
  busquedaOb[e.target.name] = e.target.value;
  console.log(busquedaOb);
}
function subform(e) {
  e.preventDefault();
  const { moneda, criptomoneda } = busquedaOb;
  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }

  consultarApi();
}

function mostrarAlerta(msg) {
  const existeEror = document.querySelector(".error");

  if (!existeEror) {
    const divMsj = document.createElement("div");
    divMsj.classList.add("error");

    divMsj.textContent = msg;
    formulari.appendChild(divMsj);
    setTimeout(() => {
      divMsj.remove();
    }, 3000);
  }
}

function consultarApi() {
  const { moneda, criptomoneda } = busquedaOb;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
  fetch(url)
    .then((r) => r.json())
    .then((d) => {
      cotizacionHTML(d.DISPLAY[criptomoneda][moneda]);
    });
}

function cotizacionHTML(cotizacion) {
  const { CHANGE24HOUR, PRICE, LOW24HOUR, HIGHHOUR, HIGH24HOUR, FROMSYMBOL } =
    cotizacion;

  const ptecio = document.createElement("p");
  ptecio.classList.add("precio");
  ptecio.innerHTML = `El precio es: <span>${PRICE}</span>`;
  const p = document.createElement("p");
  p.innerHTML = `Camobio en las ultimas 24hrs: <span>${CHANGE24HOUR}</span>`;

  const precioAlto = document.createElement("p");
  precioAlto.innerHTML = `El precio mas alto en las ultimas 24hrs: <span>${HIGH24HOUR}</span>`;

  const preciobajo = document.createElement("p");
  preciobajo.innerHTML = `El precio mas bajo en las ultimas 24hrs: <span>${LOW24HOUR}</span>`;
  const precioAltoh = document.createElement("p");
  precioAltoh.innerHTML = `El precio mas alto en la ultoma hora: <span>${HIGHHOUR}</span>`;
  const simbol = document.createElement("p");
  simbol.innerHTML = `<span>${FROMSYMBOL}</span>`;
  resultado.appendChild(ptecio);
  resultado.appendChild(p);
  resultado.appendChild(precioAlto);
  resultado.appendChild(preciobajo);
  resultado.appendChild(simbol);
}
