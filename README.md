# TIME TO FLOURISH

Área de membros em inglês, React + Vite + TypeScript, com PWA e conteúdo integral dos sete dias fornecido no briefing.

## Rodar

Use Node.js 22.13+ ou 24.

```sh
npm install
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

O resultado de produção fica em `dist/`.

## Ajustar antes de receber compradores

| Item | Onde alterar |
| --- | --- |
| Nome da área | `src/config.ts` → `APP_NAME`; atualize também o nome no manifest em `vite.config.ts`, `index.html` e o componente `Brand` em `src/App.tsx` |
| E-mail real de suporte | `src/config.ts` → `SUPPORT_EMAIL` (configurado: lanovdigital@gmail.com) |
| PDF do bônus | `src/config.ts` → `BLUEPRINT_PDF_URL` (`#` por enquanto) |
| Prazo do bônus | `src/config.ts` → `BLUEPRINT_UNLOCK_HOURS = 48` |
| Verificação da compra | `src/services/authService.ts` → `authService.verifyPurchase(email)` |
| Conteúdo dos dias | `src/content/days.ts`, com `{name}` para o primeiro nome |
| Textos complementares | `src/content/extra.ts` |
| Logo | `public/brand/`; o logo completo é usado na entrada e nos ícones de `public/icons/` |
| Imagens | `public/images/` — 25 artes em WebP; identidade visual em `public/brand/` |

Nome do app: TIME TO FLOURISH. O logo completo fornecido é usado no centro da entrada e em todos os ícones do PWA. A versão sem texto acompanha o nome no cabeçalho. O botão Send email abre o aplicativo de e-mail para lanovdigital@gmail.com. O botão de PDF fica desativado enquanto seu link for `#`.

O login é simbólico e aceita um nome e qualquer e-mail válido, conforme o briefing. Antes de restringir acesso a compradores, integre `verifyPurchase` a uma API que faça a validação no servidor. Nunca coloque chaves de pagamento no frontend. Uma aplicação estática não protege o conteúdo baixado, o temporizador nem um link público de PDF.

No Journal, escreva e toque em Add note. Cada anotação aparece abaixo como Note 1, Note 2 etc., separada por dia e usuário, sem limite de quantidade definido pelo app. O campo é limpo após salvar; um rascunho em andamento também fica salvo no dispositivo. Textos antigos do diário são preservados como a primeira anotação de cada dia.

Dados ficam no localStorage, por e-mail e navegador: nome, progresso, diário, primeiro acesso e boas-vindas. Sair remove apenas a sessão. Um novo dispositivo tem seus próprios dados; não há sincronização ou recuperação remota. Para oferecer isso, substitua a implementação de `storage` por um backend autenticado.

## Publicar na Vercel

1. Importe esta pasta em um repositório e conecte-o à Vercel, ou importe o repositório pela interface da Vercel.
2. Escolha Vite. Instalação: `npm install`. Build: `npm run build`. Saída: `dist`.
3. Publique. `vercel.json` já contém o fallback das rotas para o app.

## Publicar na Netlify

1. Conecte o repositório. Build: `npm run build`. Saída: `dist`.
2. Publique; o arquivo `public/_redirects` já faz o fallback das rotas.
3. Alternativa: execute o build e envie a pasta `dist` pelo deploy manual.

## Instalação e offline

Em HTTPS (ou localhost), o build de produção registra o service worker. Imagens, fontes e leituras ficam no cache após a instalação inicial terminar. Android/Chrome/Edge: use Install App quando o navegador disponibilizar o prompt; há instruções como fallback. iPhone/iPad: Safari → Share → Add to Home Screen → Add. O botão é ocultado em modo standalone.

O PDF de um endereço externo depende desse endereço e não está incluído no cache. No modo `npm run dev`, o service worker de produção fica desativado; use `npm run build` e publique para testar a instalação e o cache. O teste visual foi realizado em desktop e em viewport de 390 px; a instalação nativa em aparelho físico não foi executada.

## Organização

- `src/App.tsx`: telas, navegação e interface.
- `src/styles.css` e `src/fonts.css`: estilos responsivos e fontes locais.
- `src/services/authService.ts`: autenticação simbólica e persistência.
- `src/services/journey.ts`: prazo do bônus.
- `tests/`: isolamento de perfis, retomada de dados e limite das 48 horas.
- `public/`: imagens, logo, ícones, fontes e fallback da Netlify.
- `dist/`: build pronto para hospedagem estática, incluído no ZIP.

O projeto inclui 25 imagens distintas geradas por IA e a identidade visual TIME TO FLOURISH fornecida pelo cliente. Os textos das sete leituras foram preservados integralmente; apenas a apresentação Markdown foi convertida em componentes visuais.
