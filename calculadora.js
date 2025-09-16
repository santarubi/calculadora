// === Tabela padrão de milésimos ===
const milesimosPadrao = {
  ANEL: 3, BRACELETE: 3, BRINCO: 2, COLAR: 3, MASCULINO: 3,
  PIERCING: 2, PINGENTE: 2, PULSEIRA: 3, TORNOZELEIRA: 3
};

function atualizarMilesimos(){
  const tipo = document.getElementById("tipoPeca").value;
  document.getElementById("milesimos").value = milesimosPadrao[tipo] ?? 3;
}

// arredonda sempre para X,90
function arredondarX90(valor){
  const inteiro = Math.floor(valor);
  const candidato = inteiro + 0.90;
  return Number((valor <= candidato ? candidato : inteiro + 1 + 0.90).toFixed(2));
}

const n  = v => (isNaN(v) ? 0 : v);
const br = v => Number(v).toLocaleString("pt-BR",{minimumFractionDigits:2, maximumFractionDigits:2});

function calcular(){
  // Entradas
  const precoBruto    = n(parseFloat(document.getElementById("precoBruto").value));
  const descontoBruto = n(parseFloat(document.getElementById("descontoBruto").value)); // %
  const peso          = n(parseFloat(document.getElementById("peso").value));          // g
  const milesimos     = n(parseFloat(document.getElementById("milesimos").value));     // ex: 3
  const descontoBanho = n(parseFloat(document.getElementById("descontoBanho").value)); // %

  const markup    = n(parseFloat(document.getElementById("markup").value));
  const frete     = n(parseFloat(document.getElementById("frete").value));
  const sacolinha = n(parseFloat(document.getElementById("sacolinha").value));

  // Insumos (IMPORTANTE: OURO em R$/KG; Verniz/Base em R$/KG)
  const ouroKg   = n(parseFloat(document.getElementById("ouro").value));   // ex: 640
  const maoObra  = n(parseFloat(document.getElementById("maoObra").value)); // ex: 3
  const vernizKg = n(parseFloat(document.getElementById("verniz").value)); // ex: 330
  const baseKg   = n(parseFloat(document.getElementById("base").value));   // ex: 180

  // Converte para R$/g onde necessário
  const ouroTermMO   = (ouroKg * maoObra) / 1000;                  // R$/g
  const ouroTermMil  = (ouroKg * milesimos) / 1000;                // R$/g
  const vernizPorG   =  vernizKg / 1000;                           // R$/g
  const basePorG     =  baseKg   / 1000;                           // R$/g

  // Banho (SEM desconto)
  const custoBanhoPorG = ouroTermMO + ouroTermMil + vernizPorG + basePorG;
  const banhoSemDesc   = custoBanhoPorG * peso;                    // R$/peça
  const banhoComDesc   = banhoSemDesc * (1 - descontoBanho/100);   // COM desconto

  // Bruto
  const brutoSemDesc = precoBruto;
  const brutoComDesc = precoBruto * (1 - descontoBruto/100);

  // Markup SEM desconto (regra sua)
  const custoPecaMarkup = (brutoSemDesc + banhoSemDesc) * markup;

  // Custo fixo = 11% sobre (peça com markup + frete + sacolinha)
  const custoFixo = (custoPecaMarkup + frete + sacolinha) * 0.11;

  // PV (X,90)
  const pvAntes = custoPecaMarkup + frete + sacolinha + custoFixo;
  const pvFinal = arredondarX90(pvAntes);

  // Comissão
  const comissao = pvFinal * 0.40;

  // Custo total para margem/lucro (usa COM desconto)
  const custoTotal = brutoComDesc + banhoComDesc + frete + sacolinha + custoFixo + comissao;

  // Lucro/Margem
  const lucro     = pvFinal - custoTotal;
  const margemPct = pvFinal > 0 ? (lucro / pvFinal) * 100 : 0;

  // Semáforos
  const classeLucro  = (lucro >= 100) ? "bom" : (lucro >= 50 ? "ok" : "baixo");
  const classeMargem = (margemPct >= 50) ? "bom" : (margemPct >= 40 ? "ok" : "baixo");

  // Saída
  document.getElementById("custoBruto").innerText     = `Custo Bruto: R$ ${br(brutoSemDesc)}`;
  document.getElementById("custoBrutoDesc").innerText = `C/ desconto: R$ ${br(brutoComDesc)}`;
  document.getElementById("custoBanho").innerText     = `Custo Banho: R$ ${br(banhoSemDesc)}`;
  document.getElementById("custoBanhoDesc").innerText = `C/ desconto: R$ ${br(banhoComDesc)}`;
  document.getElementById("custoTotal").innerText     = `Custo Total (desc + fixo + comissão): R$ ${br(custoTotal)}`;
  document.getElementById("precoVenda").innerText     = `Preço Venda (X,90): R$ ${br(pvFinal)}`;
  document.getElementById("comissao").innerText       = `Comissão (40%): R$ ${br(comissao)}`;
  document.getElementById("lucro").innerHTML          = `Lucro: <span class="${classeLucro}">R$ ${br(lucro)}</span>`;
  document.getElementById("margem").innerHTML         = `Margem: <span class="${classeMargem}">${margemPct.toFixed(2)}%</span>`;
}
