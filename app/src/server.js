import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { calcularOrcamento } from './orcamento.js';

export function criarServidor() {
  return createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    const url = new URL(req.url, 'http://localhost');
    if (req.method !== 'GET' || url.pathname !== '/orcamento') {
      res.writeHead(404);
      res.end(JSON.stringify({ erro: 'Use GET /orcamento?precoCentavos=1000&quantidade=2' }));
      return;
    }
    try {
      const lerNumero = (nome, padrao) => {
        const valor = url.searchParams.get(nome);
        if (valor === null && padrao !== undefined) return padrao;
        if (valor === null || valor.trim() === '') throw new Error(`Informe ${nome}.`);
        return Number(valor);
      };
      const resultado = calcularOrcamento(
        lerNumero('precoCentavos'), lerNumero('quantidade'), lerNumero('desconto', 0),
      );
      res.end(JSON.stringify(resultado));
    } catch (erro) {
      res.writeHead(400);
      res.end(JSON.stringify({ erro: erro.message }));
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  criarServidor().listen(3000, '127.0.0.1', () => {
    console.log('Abra http://127.0.0.1:3000/orcamento?precoCentavos=1000&quantidade=2');
  });
}
