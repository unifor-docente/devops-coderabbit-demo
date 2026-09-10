import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularOrcamento } from '../src/orcamento.js';

test('desconto de 10% em R$ 20,00 resulta em R$ 18,00', () => {
  assert.equal(calcularOrcamento(1000, 2, 10).totalCentavos, 1800);
});

test('aceita limites e arredonda meio centavo para cima', () => {
  assert.equal(calcularOrcamento(1000, 2, 0).totalCentavos, 2000);
  assert.equal(calcularOrcamento(1000, 2, 100).totalCentavos, 0);
  assert.equal(calcularOrcamento(101, 1, 50).totalCentavos, 51);
  assert.equal(calcularOrcamento(0, 1, 10).totalCentavos, 0);
});

test('rejeita desconto fora do contrato', () => {
  for (const desconto of [-1, 101, 1.5, NaN, Infinity, '10', null]) {
    assert.throws(() => calcularOrcamento(1000, 2, desconto));
  }
});
