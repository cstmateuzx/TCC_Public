# Frontend — BXD Tattoo Studio

Aplicação Svelte + Vite com tema escuro padronizado.

## Estrutura

```
src/
├── App.svelte              # Roteamento por store (paginaAtual)
├── app.css                 # Estilos globais e utilitários
├── styles/theme.css        # Variáveis CSS do tema
├── lib/
│   ├── api.js              # Cliente axios (base URL + cookies)
│   └── auth.js             # Logout centralizado
├── components/
│   ├── layout/
│   │   ├── AppHeader.svelte
│   │   └── PageShell.svelte
│   └── ui/
│       ├── Alert.svelte
│       └── BookingSteps.svelte
├── pages/                  # Telas por fluxo
│   ├── admin/
│   └── Agendamento/
└── stores/
    ├── navigation.js
    └── session.js
```

## Executar

```bash
npm install
npm run dev
```

Opcional: crie `.env` com `VITE_API_URL=http://localhost:3000` para apontar à API.

## CSS

- **Grid:** apenas `bootstrap-grid.min.css` (sem componentes Bootstrap que conflitavam com o tema).
- **Layout:** `styles/layout.css` (flex, espaçamento, dropdown).
- **Tema:** `app.css` + `styles/theme.css`.

Classes reutilizáveis: `page-shell`, `page-card`, `btn-bxd-primary`, `table-bxd`, `alert-bxd`, `modal-backdrop-bxd`.

## Agendamento

Estado do fluxo em `lib/booking.js` (localStorage `bxd_booking_v1`). Etapas validadas antes de avançar; confirmação chama `PUT /horarios/:id`.
