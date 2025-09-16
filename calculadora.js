// calculadora.js

function arredondar(valor) {
  // arredonda sempre para cima em X,90
  let inteiro = Math.ceil(valor);
  return (inteiro - 0.10).toFixed(2);
}

function calcular() {
  const peso = parseFloat(document.getElementById("peso").value);
  const precoBruto = parseFloat(document.getElementById("precoBruto").value);
  const markup = parseFloat(document.getElementById("markup").value);

  // parâmetros fixos
  const sacolinha = 3.0;
  const frete = 2.0;
  const custoBanho = 6.53; // do seu exemplo

  // === Cálculo correto ===
  // 1) custo da peça = (preço bruto * markup)
  const custoComMarkup = precoBruto * markup;

  // 2) soma sacolinha + frete
  const precoBase = custoComMarkup + sacolinha + frete;

  // 3) custo fixo = 11% do preço base
  const custoFixo = precoBase * 0.11;

  // 4) preço de venda final arredondado
  const precoVenda = parseFloat(arredondar(precoBase + custoFixo));

  // 5) comissão da revendedora
  const comissao = precoVenda * 0.40;

  // 6) custo total = banho + bruto + sacolinha + frete + fixo + comissão
  const custoTotal = custoBanho + precoBruto + sacolinha + frete + custoFixo + comissao;

  // 7) margem
  const margem = precoVenda - custoTotal;

  // === Exibir resultados ===
  document.getElementById("pv").innerText = "Preço de Venda: R$ " + precoVenda.toFixed(2);
  document.getElementById("custoTotal").innerText = "Custo Total: R$ " + custoTotal.toFixed(2);
  document.getElementById("margem").innerText =
    "Margem: R$ " + margem.toFixed(2) + " (" + ((margem / precoVenda) * 100).toFixed(2) + "%)";
}
