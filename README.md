# Prática — revisão de código com IA usando CodeRabbit

**Encontro 2 · GitHub Flow, pull requests e qualidade · 45–60 minutos.**

Objetivo: executar uma API simples, propor uma funcionalidade em um PR, analisar a revisão do CodeRabbit e validar a correção com testes. Este exemplo apoia a aula; a escolha da aplicação do projeto integrador continua livre.

> Toda saída de IA é hipótese até ser validada por teste, execução ou revisão humana.

## 1. Executar a aplicação (5 min)

Clone este repositório com `git clone https://github.com/unifor-docente/devops-coderabbit-demo.git` e entre nele com `cd devops-coderabbit-demo`.

Pré-requisitos: Git, Node.js 24 ou superior e uma conta GitHub. O GitHub CLI (`gh`) é opcional. Execute a partir da raiz deste repositório:

```sh
cd app
npm test
npm start
```

Não é necessário instalar pacotes. Abra no navegador:

<http://127.0.0.1:3000/orcamento?precoCentavos=1000&quantidade=2>

Resposta inicial: `{"subtotalCentavos":2000,"totalCentavos":2000}`. Encerre com Ctrl+C antes de reiniciar após alterações.

### Regras de negócio

- Valores monetários são inteiros em centavos. Preço é não negativo.
- Quantidade é um inteiro de 1 a 100; o subtotal deve caber em um inteiro seguro de JavaScript.
- A versão inicial calcula apenas preço × quantidade. O parâmetro de desconto já é encaminhado pela API, mas só será implementado no PR.
- Nova funcionalidade: desconto **percentual inteiro entre 0 e 100**, padrão zero.
- O desconto incide sobre o subtotal. Arredondar o total para o centavo mais próximo, com meio centavo para cima.
- Entrada inválida deve resultar em HTTP 400.

## 2. Publicar a base e conectar o CodeRabbit (10 min)

A branch `main` contém a versão inicial desta prática. O PR da demonstração deve conter a mudança de desconto em relação a essa base, para que a revisão se concentre nela.

1. Entre em [CodeRabbit](https://app.coderabbit.ai/) usando **Login with GitHub**.
2. Selecione a organização `unifor-docente` e instale/autorize o aplicativo GitHub do CodeRabbit. Se necessário, o proprietário da organização deve concluir a instalação.
3. Em **Only select repositories**, selecione `devops-coderabbit-demo` e conclua **Install & Authorize** ou **Save**.
4. Confirme no painel do CodeRabbit que o repositório está conectado e as revisões estão habilitadas. Confira a disponibilidade de revisão detalhada e eventuais limites do plano da conta antes da aula.

O arquivo [`.coderabbit.yaml`](.coderabbit.yaml), na raiz do repositório, configura português e revisão automática de PRs prontos para revisão. Criar esse arquivo não instala o aplicativo. Não é necessário adicionar uma chave de API ao workflow: a integração de revisão usa o GitHub App. O [workflow de testes](.github/workflows/testes.yml) executa a aplicação de forma independente.

Para prática em equipes, cada equipe pode usar um fork e instalar o CodeRabbit nele. Abra o PR no próprio fork conectado ao aplicativo.

Referências oficiais: [instalação no GitHub](https://docs.coderabbit.ai/platforms/github-com), [configuração YAML](https://docs.coderabbit.ai/getting-started/yaml-configuration) e [revisão automática](https://docs.coderabbit.ai/configuration/auto-review).

## 3. Abrir o PR de demonstração (10 min)

Com a base já publicada e o diretório de trabalho limpo, execute da raiz:

```sh
git switch main
git pull --ff-only
git switch -c pratica/coderabbit-desconto
cd app
npm run demo:bug
npm test
git diff
git add src/orcamento.js
git commit -m "feat: adicionar desconto ao orçamento"
git push -u origin pratica/coderabbit-desconto
```

O script modifica somente a função de orçamento. Os testes iniciais passam porque ainda não verificam desconto. No GitHub, clique em **Compare & pull request**, escolha `main` como base e abra um PR **sem ser draft**. Use este texto:

```text
Título: feat: adicionar desconto percentual ao orçamento

Implementa desconto percentual no cálculo do orçamento.
Aceite: desconto inteiro de 0 a 100; 10% de desconto sobre 2000 centavos
deve resultar em 1800 centavos. Entrada inválida deve retornar HTTP 400.
Validação inicial: npm test passou. Solicito revisão da regra e da cobertura.
Contexto: PR didático para a prática de revisão com IA.
```

## 4. Mostrar a revisão com IA (10 min)

Abra a conversa e os arquivos alterados do PR. Observe o resumo e os comentários do usuário/bot CodeRabbit. Se a revisão não iniciar, publique um comentário no PR:

```text
@coderabbitai review
```

Escolha um apontamento e responda pedindo um exemplo de entrada e saída esperada. Compare a observação com o contrato acima; a IA pode não encontrar todos os problemas e pode sugerir mudanças desnecessárias. Não trate o roteiro como garantia dos comentários que aparecerão.

Reinicie `npm start` e abra:

<http://127.0.0.1:3000/orcamento?precoCentavos=1000&quantidade=2&desconto=10>

O código defeituoso retorna **1990**, mas o correto é **1800**. Experimente também `desconto=-10` e `desconto=101`: deveriam retornar HTTP 400.

Se o bot não responder, confira instalação no repositório correto, status não draft, habilitação das revisões e limites no painel. Enquanto isso, reproduza os defeitos localmente; registre a revisão externa como pendente, sem apresentar a análise local como resposta do CodeRabbit.

## 5. Reproduzir, corrigir e atualizar o mesmo PR (10–15 min)

Dentro de `app`, adicione primeiro os testes de regressão:

```sh
cp ../demo/desconto.test.js.txt test/desconto.test.js
npm test
```

Os três novos testes devem falhar na versão defeituosa. Discuta o diagnóstico e implemente a correção com a turma. Para usar a solução pronta do professor, ainda na versão defeituosa:

```sh
npm run demo:fix
npm test
git add src/orcamento.js test/desconto.test.js
git commit -m "fix: validar desconto e calcular percentual com regressão"
git push
```

O script da solução espera o trecho defeituoso original; se a turma já o alterou, conclua a correção manualmente. Ele também copia os testes de regressão fornecidos.

Acompanhe a nova revisão e o check de testes no mesmo PR. Se necessário, solicite outra revisão com `@coderabbitai review`. Só faça merge após testes verdes e revisão humana. Não faça merge da versão propositalmente defeituosa.

## Evidências e discussão

- Link do PR com a revisão real do CodeRabbit.
- Um apontamento aceito ou rejeitado, com justificativa e reprodução.
- Teste que falhava antes e passa depois; link do check de CI.
- Commit da correção e decisão humana sobre o merge.

Perguntas: por que a CI inicial ficou verde? O bot identificou todos os defeitos? Como distinguir preferência de estilo de erro funcional? Quem responde pela alteração aprovada?

## Notas do professor

Os defeitos preparados são: subtrair o número do desconto como centavos, não validar seu intervalo/tipo e não aplicar a regra de arredondamento percentual. Os artefatos de demonstração e este roteiro ficam visíveis no repositório; trata-se de uma demonstração guiada, não de um benchmark cego da IA.

Faça uma execução completa antes da aula para confirmar acesso ao aplicativo e tempo de resposta. Para repetir, crie outra branch a partir da versão inicial ou reverta a funcionalidade por um PR próprio. Não reaplique o gerador sobre uma versão já corrigida.
