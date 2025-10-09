// dre.js — lógica de cálculo do DRE
const DreModule = (function(){
  function calculateDRE(data){
    const res = {receitaBruta:0,custos:0,despesas:0,resultado:0,ebitda:0};
    data.forEach(tx => {
      const v = Number(tx.value) || 0;
      if(/receit|income|revenue/i.test(tx.category) || /rec/i.test(tx.type)){
        res.receitaBruta += v;
      } else if(/custo|cost|costs/i.test(tx.category) || /cost|custo/i.test(tx.type)){
        res.custos += Math.abs(v);
      } else {
        if(/expense|despesa|despesas/i.test(tx.category) || /exp|despesa/i.test(tx.type)) res.despesas += Math.abs(v);
        else { if(v>=0) res.receitaBruta += v; else res.despesas += Math.abs(v); }
      }
    });
    res.resultado = res.receitaBruta - (res.custos + res.despesas);
    res.ebitda = res.resultado;
    return res;
  }

  return { calculateDRE };
})();
