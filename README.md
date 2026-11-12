# Horalis

Site one-page da Horalis: ponto, férias e benefícios conectados para o DP de empresas de 50 a 300 pessoas. HTML, CSS e JavaScript estáticos, sem build.

Publicado em: https://erik-akaishi.github.io/horalis/

## Estrutura

- `index.html`: a página (SEO, Open Graph e JSON-LD no `<head>`, CSS inline)
- `assets/site.js`: calculadora, menu mobile, formulário de diagnóstico (demonstração) e posters em halftone (canvas)
- `assets/fonts`: Instrument Sans e IBM Plex Mono (woff2, auto-hospedadas)
- `assets/og-horalis.png`, `assets/logo-horalis.png`: imagem de compartilhamento e logo
- `robots.txt`, `sitemap.xml`, `llms.txt`: rastreamento, indexação e leitura por IA
- `404.html`, `.nojekyll`, favicons

## Publicar (GitHub Pages)

Settings → Pages → Source: "Deploy from a branch" → Branch: `main`, pasta `/ (root)`.

## Domínio próprio (depois)

Trocar a URL base em `index.html` (canonical, `og:url`, `og:image`, JSON-LD), `robots.txt`, `sitemap.xml`, `llms.txt` e `404.html`, e criar o arquivo `CNAME` com o domínio.

## Observação

Os números do site são estimativas sobre uma empresa-base (150 funcionários, DP de 2 pessoas). O formulário é demonstração: nenhum dado é enviado.

Construído por [Akaishi Design Studio](https://akaishidesign.com.br).
