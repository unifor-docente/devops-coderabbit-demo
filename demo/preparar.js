import { readFile, writeFile, copyFile } from 'node:fs/promises';

const arquivo = new URL('../app/src/orcamento.js', import.meta.url);
const modo = process.argv[2];
const original = 'export function calcularOrcamento(precoCentavos, quantidade) {';
const assinatura = 'export function calcularOrcamento(precoCentavos, quantidade, desconto = 0) {';
const retorno = '  return { subtotalCentavos, totalCentavos: subtotalCentavos };';
const bug = `  const totalCentavos = subtotalCentavos - desconto;
  return { subtotalCentavos, totalCentavos };`;
const correcao = `  if (!Number.isInteger(desconto) || desconto < 0 || desconto > 100) {
    throw new Error('Desconto deve ser um inteiro entre 0 e 100.');
  }
  // BigInt evita perda de precisão nos valores próximos do limite seguro.
  const totalCentavos = Number(
    (BigInt(subtotalCentavos) * BigInt(100 - desconto) + 50n) / 100n,
  );
  return { subtotalCentavos, totalCentavos };`;

const conteudo = await readFile(arquivo, 'utf8');
if (modo === 'bug' && conteudo.includes(original) && conteudo.includes(retorno)) {
  await writeFile(arquivo, conteudo.replace(original, assinatura).replace(retorno, bug));
  console.log('Alteração didática aplicada. Execute npm test e confira git diff.');
} else if (modo === 'fix' && conteudo.includes(assinatura) && conteudo.includes(bug)) {
  await writeFile(arquivo, conteudo.replace(bug, correcao));
  await copyFile(new URL('./desconto.test.js.txt', import.meta.url),
    new URL('../app/test/desconto.test.js', import.meta.url));
  console.log('Correção e testes de regressão aplicados. Execute npm test.');
} else {
  throw new Error('Use bug na versão inicial ou fix na versão defeituosa; arquivo inesperado não foi alterado.');
}
