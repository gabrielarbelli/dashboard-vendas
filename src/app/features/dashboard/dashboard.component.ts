import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { VendasService } from '../../core/services/vendas.service';
import { VendaAgregada, RelatorioVendas } from '../../core/models/venda.model';
import { DetalheComponent } from '../detalhe/detalhe.component';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-container">
      <app-page-header 
        title="Dashboard de Vendas"
        subtitle="Relatório interativo de vendas por produto">
      </app-page-header>
      
      <div *ngIf="!relatorio" class="no-data">
        <div class="text-center">
          <i class="pi pi-chart-bar" style="font-size: 4rem; color: #6c757d;"></i>
          <h3>Nenhum dado disponível</h3>
          <p>Faça o upload de um arquivo CSV para visualizar o dashboard</p>
        </div>
      </div>
      
      <div *ngIf="relatorio" class="dashboard-content">
        <!-- Resumo -->
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="card summary-card">
              <div class="card-body">
                <h5 class="card-title">Total Geral</h5>
                <p class="card-text total-value">{{ relatorio.totalGeral | currencyBr }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card summary-card">
              <div class="card-body">
                <h5 class="card-title">Produto Mais Vendido</h5>
                <p class="card-text total-value">{{ relatorio.produtoMaisVendido }}</p>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card summary-card">
              <div class="card-body">
                <h5 class="card-title">Total de Produtos</h5>
                <p class="card-text product-count">{{ relatorio.vendasAgregadas.length }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Filtro -->
        <div class="row mb-3">
          <div class="col-md-6">
            <div class="p-field">
              <label for="filtro">Filtrar por produto:</label>
              <input type="text" 
                     id="filtro"
                     pInputText 
                     [(ngModel)]="filtro"
                     (input)="aplicarFiltro()"
                     placeholder="Digite o nome do produto..."
                     class="form-control">
            </div>
          </div>
        </div>
        
        <!-- Tabela -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5>Vendas por Produto</h5>
              </div>
              <div class="card-body">
                <p-table [value]="vendasFiltradas" 
                         [paginator]="true" 
                         [rows]="10"
                         [sortField]="'valorTotal'"
                         [sortOrder]="-1"
                         responsiveLayout="scroll">
                  <ng-template pTemplate="header">
                    <tr>
                      <th pSortableColumn="produto">
                        Produto <p-sortIcon field="produto"></p-sortIcon>
                      </th>
                      <th pSortableColumn="quantidade">
                        Quantidade <p-sortIcon field="quantidade"></p-sortIcon>
                      </th>
                      <th pSortableColumn="valorTotal">
                        Valor Total <p-sortIcon field="valorTotal"></p-sortIcon>
                      </th>
                      <th>Ações</th>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="body" let-venda>
                    <tr>
                      <td>{{ venda.produto }}</td>
                      <td>{{ venda.quantidade }}</td>
                      <td>{{ venda.valorTotal | currencyBr }}</td>
                      <td>
                        <button type="button" 
                                class="btn btn-sm btn-outline-primary"
                                (click)="abrirDetalhes(venda)"
                                [attr.aria-label]="'Ver detalhes do produto ' + venda.produto">
                          <i class="pi pi-eye"></i> Detalhes
                        </button>
                      </td>
                    </tr>
                  </ng-template>
                  <ng-template pTemplate="emptymessage">
                    <tr>
                      <td colspan="4" class="text-center">Nenhum produto encontrado</td>
                    </tr>
                  </ng-template>
                </p-table>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Gráfico -->
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5>Gráfico de Quantidades por Produto</h5>
              </div>
              <div class="card-body">
                <p-chart type="bar" 
                         [data]="chartData" 
                         [options]="chartOptions"
                         width="100%"
                         height="400px">
                </p-chart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1rem;
    }
    
    .no-data {
      text-align: center;
      padding: 4rem 2rem;
      color: #6c757d;
    }
    
    .no-data h3 {
      margin: 1rem 0 0.5rem 0;
    }
    
    .summary-card {
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    
    .summary-card:hover {
      transform: translateY(-2px);
    }
    
    .summary-card .card-title {
      color: #6c757d;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .total-value {
      color: #28a745;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0;
    }
    
    .best-product {
      color: #007bff;
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
    }
    
    .product-count {
      color: #17a2b8;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0;
    }
    
    .card {
      border: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      font-weight: 600;
    }
    
    .p-field label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
    }
    
    .btn {
      padding: 0.25rem 0.5rem;
      border: 1px solid transparent;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
    }
    
    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
    
    .btn-outline-primary {
      color: #007bff;
      border-color: #007bff;
      background-color: transparent;
    }
    
    .btn-outline-primary:hover {
      color: #fff;
      background-color: #007bff;
      border-color: #007bff;
    }
  `]
})
export class DashboardComponent implements OnInit {
  relatorio: RelatorioVendas | null = null;
  vendasFiltradas: VendaAgregada[] = [];
  filtro = '';
  chartData: any;
  chartOptions: any;
  modalRef?: BsModalRef;

  constructor(
    private vendasService: VendasService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.vendasService.relatorio$.subscribe(relatorio => {
      this.relatorio = relatorio;
      if (relatorio) {
        this.vendasFiltradas = [...relatorio.vendasAgregadas];
        this.atualizarGrafico();
      }
    });

    this.configurarGrafico();
  }

  aplicarFiltro(): void {
    if (!this.relatorio) return;
    
    if (!this.filtro.trim()) {
      this.vendasFiltradas = [...this.relatorio.vendasAgregadas];
    } else {
      this.vendasFiltradas = this.relatorio.vendasAgregadas.filter(venda =>
        venda.produto.toLowerCase().includes(this.filtro.toLowerCase())
      );
    }
    this.atualizarGrafico();
  }

  abrirDetalhes(produto: VendaAgregada): void {
    const initialState = {
      produto: produto,
      totalGeral: this.relatorio?.totalGeral || 0
    };

    this.modalRef = this.modalService.show(DetalheComponent, {
      initialState,
      class: 'modal-lg'
    });
  }

  private configurarGrafico(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Quantidade de Produtos Vendidos'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    };
  }

  private atualizarGrafico(): void {
    if (!this.vendasFiltradas.length) {
      this.chartData = {
        labels: [],
        datasets: []
      };
      return;
    }

    const sortedData = [...this.vendasFiltradas].sort((a, b) => b.quantidade - a.quantidade);
    
    this.chartData = {
      labels: sortedData.map(v => v.produto),
      datasets: [
        {
          label: 'Quantidade',
          data: sortedData.map(v => v.quantidade),
          backgroundColor: '#007bff',
          borderColor: '#0056b3',
          borderWidth: 1
        }
      ]
    };
  }
}

