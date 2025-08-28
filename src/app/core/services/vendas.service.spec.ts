import { TestBed } from '@angular/core/testing';
import { VendasService } from './vendas.service';

describe('VendasService', () => {
  let service: VendasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendasService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should process CSV correctly', () => {
    const csvContent = `produto,quantidade,preco_unitario
Camiseta,3,49.90
Calça,2,99.90
Camiseta,1,49.90
Tênis,1,199.90`;

    const result = service.processarCSV(csvContent);
    expect(result.success).toBe(true);
  });

  it('should reject invalid CSV header', () => {
    const csvContent = `produto,qtd,preco
Camiseta,3,49.90`;

    const result = service.processarCSV(csvContent);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Cabeçalho do CSV inválido');
  });

  it('should aggregate sales correctly', (done) => {
    const csvContent = `produto,quantidade,preco_unitario
Camiseta,3,49.90
Calça,2,99.90
Camiseta,1,49.90`;

    service.processarCSV(csvContent);

    service.relatorio$.subscribe(relatorio => {
      if (relatorio) {
        expect(relatorio.vendasAgregadas.length).toBe(2);
        
        const camiseta = relatorio.vendasAgregadas.find(v => v.produto === 'Camiseta');
        expect(camiseta?.quantidade).toBe(4);
        expect(camiseta?.valorTotal).toBe(199.60);
        
        expect(relatorio.produtoMaisVendido).toBe('Camiseta');
        expect(relatorio.totalGeral).toBe(399.40);
        done();
      }
    });
  });

  it('should handle empty CSV', () => {
    const csvContent = `produto,quantidade,preco_unitario`;

    const result = service.processarCSV(csvContent);
    expect(result.success).toBe(false);
    expect(result.error).toContain('pelo menos uma linha de dados');
  });

  it('should handle invalid data types', () => {
    const csvContent = `produto,quantidade,preco_unitario
Camiseta,abc,49.90`;

    const result = service.processarCSV(csvContent);
    expect(result.success).toBe(false);
    expect(result.error).toContain('dados inválidos');
  });
});

