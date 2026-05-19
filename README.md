# Oficina da Bike Web

Projeto Angular inicial seguindo os padrões definidos para o front-end da Oficina da Bike.

## Stack

- Angular standalone
- Angular Material
- Reactive Forms
- JWT Access Token + Refresh Token
- Guards, Interceptors e controle de permissões
- Estrutura por domínio em `features`

## Estrutura

```text
src/app
├── core
│   ├── auth
│   ├── guards
│   ├── interceptors
│   └── layout
├── shared
│   ├── components
│   └── directives
└── features
    ├── auth
    └── produto
```

## Como executar

```bash
npm install
npm start
```

Acesse:

```text
http://localhost:4200
```

## Login

A tela de login já está criada. Enquanto o backend não estiver integrado, use:

```text
Entrar com sessão mock local
```

## Produto

O módulo de produto foi criado como modelo para os próximos CRUDs, contendo:

- Listagem
- Filtros
- Tabela
- Cadastro
- Edição
- Formulário reutilizável
- Services separados em query e command
- Dialog de confirmação para inativação
- Snackbar de sucesso/erro

## Integração com backend

Os services estão com mock local. Para integrar com o backend, remova os `of(...)` e habilite as chamadas HTTP já deixadas comentadas.

Endpoints esperados:

```text
/api/query/produtos
/api/core/produtos
/api/auth/login
```
