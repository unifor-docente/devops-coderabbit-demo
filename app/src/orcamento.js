export function calcularOrcamento(precoCentavos, quantidade, desconto = 0) {
  if (!Number.isSafeInteger(precoCentavos) || precoCentavos < 0) {
    throw new Error('Preço deve ser um inteiro não negativo em centavos.');
  }
  if (!Number.isSafeInteger(quantidade) || quantidade < 1 || quantidade > 100) {
    throw new Error('Quantidade deve ser um inteiro entre 1 e 100.');
  }
  const subtotalCentavos = precoCentavos * quantidade;
  if (!Number.isSafeInteger(subtotalCentavos)) {
    throw new Error('Subtotal excede o limite suportado.');
  }
  const totalCentavos = subtotalCentavos - desconto;
  return { subtotalCentavos, totalCentavos };
}
