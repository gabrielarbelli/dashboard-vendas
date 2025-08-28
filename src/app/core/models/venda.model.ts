export interface Venda {
  produto: string;
  quantidade: number;
  preco_unitario: number;
}

export interface VendaAgregada {
  produto: string;
  quantidade: number;
  valorTotal: number;
}

export interface RelatorioVendas {
  vendasAgregadas: VendaAgregada[];
  totalGeral: number;
  produtoMaisVendido: string;
}

