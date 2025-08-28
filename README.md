# Dashboard de Vendas

Uma aplicação Angular para análise de dados de vendas através de upload de arquivos CSV.

## Tecnologias Utilizadas

- Angular 13.x
- PrimeNG 13.0.0-rc.2
- ngx-bootstrap 6.2.0
- Bootstrap 4.6.0
- Chart.js 3.6.0

## Funcionalidades

- Upload de arquivo CSV com validação
- Processamento de dados no cliente
- Tabela interativa com vendas agregadas por produto
- Filtro por nome de produto
- Gráfico de barras com quantidades
- Modal com detalhes do produto
- Formatação monetária em Real brasileiro
- Persistência no localStorage

## Instalação

```bash
npm install
```

## Execução

```bash
ng serve
```

A aplicação estará disponível em `http://localhost:4200`

## Testes

```bash
ng test
```

## Estrutura do Projeto

```
src/
├── app/
│   ├── core/
│   │   ├── models/
│   │   └── services/
│   ├── features/
│   │   ├── dashboard/
│   │   ├── upload/
│   │   └── detalhe/
│   └── shared/
│       ├── pipes/
│       └── components/
└── assets/
```

## Formato do CSV

O arquivo deve conter as colunas: produto, quantidade, preco_unitario

Exemplo:
```
produto,quantidade,preco_unitario
Camiseta,3,49.90
Calça,2,99.90
```

## Build

```bash
ng build
```

Os arquivos de build serão gerados no diretório `dist/`.
