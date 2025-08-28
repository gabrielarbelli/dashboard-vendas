import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Venda, VendaAgregada, RelatorioVendas } from '../models/venda.model';

@Injectable({
  providedIn: 'root'
})
export class VendasService {
  private vendasSubject = new BehaviorSubject<Venda[]>([]);
  private relatorioSubject = new BehaviorSubject<RelatorioVendas | null>(null);

  vendas$ = this.vendasSubject.asObservable();
  relatorio$ = this.relatorioSubject.asObservable();

  constructor() {
    this.carregarDoLocalStorage();
  }

  processarCSV(csvContent: string): { success: boolean; error?: string } {
    try {
      const lines = csvContent.trim().split('\n');
      
      if (lines.length < 2) {
        return { success: false, error: 'Arquivo CSV deve conter pelo menos uma linha de dados além do cabeçalho' };
      }

      const header = lines[0].toLowerCase().trim();
      const expectedHeader = 'produto,quantidade,preco_unitario';
      
      if (header !== expectedHeader) {
        return { success: false, error: 'Cabeçalho do CSV inválido. Esperado: produto,quantidade,preco_unitario' };
      }

      const vendas: Venda[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split(',');
        if (parts.length !== 3) {
          return { success: false, error: `Linha ${i + 1}: formato inválido` };
        }

        const produto = parts[0].trim();
        const quantidade = parseInt(parts[1].trim());
        const preco_unitario = parseFloat(parts[2].trim());

        if (!produto || isNaN(quantidade) || isNaN(preco_unitario)) {
          return { success: false, error: `Linha ${i + 1}: dados inválidos` };
        }

        vendas.push({ produto, quantidade, preco_unitario });
      }

      this.vendasSubject.next(vendas);
      this.gerarRelatorio(vendas);
      this.salvarNoLocalStorage(vendas);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erro ao processar arquivo CSV' };
    }
  }

  private gerarRelatorio(vendas: Venda[]): void {
    const agregacao = new Map<string, VendaAgregada>();

    vendas.forEach(venda => {
      const key = venda.produto;
      if (agregacao.has(key)) {
        const existing = agregacao.get(key)!;
        existing.quantidade += venda.quantidade;
        existing.valorTotal += venda.quantidade * venda.preco_unitario;
      } else {
        agregacao.set(key, {
          produto: venda.produto,
          quantidade: venda.quantidade,
          valorTotal: venda.quantidade * venda.preco_unitario
        });
      }
    });

    const vendasAgregadas = Array.from(agregacao.values());
    const totalGeral = vendasAgregadas.reduce((sum, venda) => sum + venda.valorTotal, 0);
    
    const produtoMaisVendido = vendasAgregadas.reduce((max, venda) => 
      venda.quantidade > max.quantidade ? venda : max
    ).produto;

    const relatorio: RelatorioVendas = {
      vendasAgregadas,
      totalGeral,
      produtoMaisVendido
    };

    this.relatorioSubject.next(relatorio);
  }

  filtrarPorProduto(filtro: string): Observable<VendaAgregada[]> {
    return new Observable(observer => {
      this.relatorio$.subscribe(relatorio => {
        if (relatorio) {
          const filtrado = relatorio.vendasAgregadas.filter(venda =>
            venda.produto.toLowerCase().includes(filtro.toLowerCase())
          );
          observer.next(filtrado);
        }
      });
    });
  }

  private salvarNoLocalStorage(vendas: Venda[]): void {
    localStorage.setItem('vendas', JSON.stringify(vendas));
  }

  private carregarDoLocalStorage(): void {
    const vendas = localStorage.getItem('vendas');
    if (vendas) {
      try {
        const vendasParsed = JSON.parse(vendas);
        this.vendasSubject.next(vendasParsed);
        this.gerarRelatorio(vendasParsed);
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage');
      }
    }
  }
}

