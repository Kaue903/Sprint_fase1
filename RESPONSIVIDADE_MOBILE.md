# 📱 Responsividade Mobile — O que foi feito

Resumo rápido das mudanças. Nenhum CSS original foi removido — só foram adicionados arquivos novos (`mobile-*.css`) carregados depois dos originais, mais 1 linha de `<link>` em cada HTML. Em `painel-usuario.html` também foi adicionado 1 link de navegação (ver abaixo).

## Arquivos novos
- `frontend/css/mobile-index.css` → site público (`index.html`)
- `frontend/css/mobile-login.css` → login (`login.html`)
- `frontend/css/mobile-dashboard.css` → painel admin (`dashboard.html`)
- `frontend/css/mobile-painel.css` → painel do usuário (`painel-usuario.html`)

## Principais correções por página

**index.html (site público)**
- Logo e menu colapsado com visual próprio no mobile (fundo, espaçamento, botões full-width)
- Botões de filtro do catálogo (Disponíveis/Alugados, Tipo) com rolagem horizontal suave em telas pequenas, sem quebrar feio
- Imagens dos cards reduzidas de 400px → 220px de altura no mobile (menos scroll)
- Botão flutuante "voltar ao topo": corrigido um bug de CSS (herdava padding do `.btn-primary` e ficava oval em vez de redondo)
- Footer, avaliações e hero com espaçamentos ajustados

**login.html**
- O `body` tinha `overflow:hidden`, o que cortava o card em telas baixas (ex: teclado aberto). Liberado scroll vertical quando necessário
- Padding ajustado para celulares bem pequenos (< 400px)

**dashboard.html (admin)**
- A tabela já tinha um modo "card" no mobile, mas faltavam os rótulos dos campos (mostrava só os valores, sem saber o que era o quê) — adicionado `data-label` em cada célula + CSS correspondente
- **Bug real corrigido**: havia uma regra antiga `.tabela-admin{min-width:700px}` que continuava ativa mesmo no modo card, empurrando os valores pra fora da tela (apareciam só os rótulos, em branco). Removida no mobile.
- Cabeçalho, cards de estatística e linhas de reserva/interesse ajustados para não quebrar em telas pequenas

**painel-usuario.html (painel do usuário)**
- **Problema real encontrado**: a sidebar inteira (incluindo o link "Ver site público") fica escondida no mobile, e não havia nenhum substituto — o usuário ficava sem esse atalho. Foi adicionado um ícone de globo no topo (visível só no mobile) que leva para `/`
- Topbar reorganizado: padding reduzido, nome do usuário e título "Wave Club" escondidos progressivamente conforme a tela fica menor (< 400px e < 360px) pra nada cortar
- Filtros, cards do catálogo e cards de "Minhas Solicitações" ajustados para telas pequenas
- Modal de aluguel testado e ajustado para não cortar em telas pequenas

## Testes realizados
Testado com navegador headless em 320px, 360px, 375px, 390px e 414px (cobre desde o iPhone SE até Android grandes), incluindo estados com dados reais simulados (catálogo, tabela admin, solicitações, modal de aluguel) — não só a tela vazia/de erro.
