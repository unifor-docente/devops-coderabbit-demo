export function calcularOrcamento(precoCentavos, quantidade) {
  if (!Number.isSafeInteger(precoCentavos) || precoCentavos < 0) {
    throw new Error('Preço deve ser um inteiro não negativo em centavos.');
  }
  if (!Number.isSafeInteger(quantidade) || quantidade < 1 || quantidade > 100) {
    throw new Error('Quantidade deve ser um inteiro entre 1 e 100.');
  }
  const fator = 100 - desconto;
  const parteInteira = Math.floor(subtotalCentavos / 100);
  const resto = subtotalCentavos % 100;
  const totalCentavos =
  parteInteira * fator + Math.floor((resto * fator + 50) / 100);
  if (!Number.isSafeInteger(subtotalCentavos)) {
    throw new Error('Subtotal excede o limite suportado.');
  }
  return { subtotalCentavos, totalCentavos: subtotalCentavos };
}
