// Mapeamento padrão de milésimos por tipo de peça
const milesimosPadrao = {
  "ANEL": 3,
  "BRACELETE": 3,
  "BRINCO": 2,
  "COLAR": 3,
  "MASCULINO": 3,
  "PIERCING": 2,
  "PINGENTE": 2,
  "PULSEIRA": 3,
  "TORNOZELEIRA": 3
};

// Atualiza automaticamente os milésimos ao mudar tipo
function atualizarMilesimos() {
  const tipo = document.getElementById("tipoPeca").value;
  document.getElementById("milesimos").value = milesimosPadrao[tipo] || 3;
}

// Função principal de cálculo
function calcular() {
  // === Entradas principais ===
  const precoBruto = parseFloat(document.getElementById("precoBruto").value) || 0;
  const descontoBruto = parseFloat(document.getElementById("descontoBruto").value) || 0;
  const peso = parseFloat(document.getElementById("peso").value) || 0;
  const milesimos = parseFloat(document.getElementById("milesimos").value) || 0;
  const descontoBanho = parseFloat(document.getElementById("descontoBanho").value) || 0;

  // === Configurações ===
  const markup = parseFloat(document.getElementById("markup").value) || 1;
  const frete = parseFloat(document.getElementById("frete").value) || 0;
  const sacolinha = parseFloat(document.getElementById("sacolinha").value) || 0;

  // === Insumos editáveis ===
  const ouro = parseFloat(document.getElementById("ouro").value) || 640;     // R$/g
  const maoObra = parseFloat(document.getElementById("maoObra").value) || 3; // fator
  const vernizKg = parseFloat(document.getElementById("verniz").value) || 330; // R$/kg
  const baseKg = parseFloat(document.getElementById("base").value) || 180;   // R$/kg

  // Converter insumos por grama
  const verniz = vernizKg / 1000;
  const base = baseKg / 1000;

  // === Cálculos ===
  // Bruto
  const custoBruto = precoBruto;
  const custoBrutoDesc = custoBruto * (1 - descontoBruto / 100);

  // Banho (fórmula Excel adaptada)
  const custoBanhoUnit = ((ouro * maoObra) + (ouro * milesimos / 1000) + verniz + base) * peso;
  const custoBanhoDesc = custoBanhoUnit * (1 - descontoBanho / 100);

  // Peça com markup (usando SEM descontos)
  const custoPecaMarkup = (custoBruto + custoBanhoUnit) * markup;

  // Custos fixos (11% sobre peça com markup + frete + sacolinha)
  const custoFixos = (custoPecaMarkup + sacolinha + frete) * 0.11;

  // Preço de venda antes arredondamento
  let precoVenda = custoPecaMarkup + sacolinha + frete + custoFixos;

  // Arredondamento X,90
  precoVenda = Math.ceil(precoVenda) - 0.10;
  if (precoVenda < custoPecaMarkup) {
    precoVenda = custoPecaMarkup; // segurança
  }

  // Comissão
  const comissao = precoVenda * 0.40;

  // Custo total (para margem/lucro, considerar COM desconto)
  const custoTotal = custoBrutoDesc + custoBanhoDesc + sacolinha + frete + custoFixos + comissao;

  // Lucro
  const lucro = precoVenda - custoTotal;
  const margem = (lucro / precoVenda) * 100;

  // Classificação visual
  let classLucro = "bom", textoLucro = "Lucro bom";
  if (lucro < 50) { classLucro = "baixo"; textoLucro = "Lucro baixo"; }
  else if (lucro < 100) { classLucro = "ok"; textoLucro = "Lucro ok"; }

  let classMargem = "bom", textoMargem = "Margem boa";
  if (margem < 40) { classMargem = "baixo"; textoMargem = "Margem baixa"; }
  else if (margem < 50) { classMargem = "ok"; textoMargem = "Margem ok"; }

  // === Saída no resumo ===
  document.getElementById("custoBruto").innerText = `Custo Bruto: R$ ${custoBruto.toFixed(2)}`;
  document.getElementById("custoBrutoDesc").innerText = `Custo Bruto c/ desconto: R$ ${custoBrutoDesc.toFixed(2)}`;
  document.getElementById("custoBanho").innerText = `Custo Banho: R$ ${custoBanhoUnit.toFixed(2)}`;
  document.getElementById("custoBanhoDesc").innerText = `Custo Banho c/ desconto: R$ ${custoBanhoDesc.toFixed(2)}`;
  document.getElementById("custoTotal").innerText = `Custo Total: R$ ${custoTotal.toFixed(2)}`;
  document.getElementById("precoVenda").innerText = `Preço Venda Final: R$ ${precoVenda.toFixed(2)}`;
  document.getElementById("comissao").innerText = `Comissão (40%): R$ ${comissao.toFixed(2)}`;
  document.getElementById("lucro").innerHTML = `Lucro: <span class="${classLucro}">R$ ${lucro.toFixed(2)} (${textoLucro})</span>`;
  document.getElementById("margem").innerHTML = `Margem: <span class="${classMargem}">${margem.toFixed(2)}% (${textoMargem})</span>`;
}
