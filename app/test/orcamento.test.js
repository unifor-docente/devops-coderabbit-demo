import { test } from 'node:test';
import assert from 'node:assert/strict';
import { calcularOrcamento } from '../src/orcamento.js';
import { criarServidor } from '../src/server.js';

test('calcula subtotal e total em centavos', () => {
  assert.deepEqual(calcularOrcamento(1000, 2), { subtotalCentavos: 2000, totalCentavos: 2000 });
});

test('rejeita preço, quantidade e subtotal inválidos', () => {
  for (const preco of [-1, 1.5, NaN, Infinity, '100']) {
    assert.throws(() => calcularOrcamento(preco, 1));
  }
  for (const quantidade of [0, -1, 101, 1.5, NaN, '2']) {
    assert.throws(() => calcularOrcamento(100, quantidade));
  }
  assert.throws(() => calcularOrcamento(Number.MAX_SAFE_INTEGER, 2));
});

test('API responde orçamento, entrada inválida e rota inexistente', async (t) => {
  const servidor = criarServidor();
  await new Promise(resolve => servidor.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => servidor.close(resolve)));
  const base = `http://127.0.0.1:${servidor.address().port}`;
  const resposta = await fetch(`${base}/orcamento?precoCentavos=1000&quantidade=2`);
  assert.equal(resposta.status, 200);
  assert.equal((await resposta.json()).totalCentavos, 2000);
  for (const query of ['quantidade=2', 'precoCentavos=&quantidade=2', 'precoCentavos=100&quantidade=0']) {
    assert.equal((await fetch(`${base}/orcamento?${query}`)).status, 400);
  }
  assert.equal((await fetch(`${base}/inexistente`)).status, 404);
});
