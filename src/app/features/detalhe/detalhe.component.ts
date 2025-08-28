import { Component, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { VendaAgregada } from '../../core/models/venda.model';

@Component({
  selector: 'app-detalhe',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Detalhes do Produto</h4>
      <button type="button" 
              class="btn-close" 
              aria-label="Close"
              (click)="fechar()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    
    <div class="modal-body">
      <div *ngIf="produto" class="produto-detalhes">
        <div class="row">
          <div class="col-md-6">
            <h5>Nome do Produto</h5>
            <p class="produto-nome">{{ produto.produto }}</p>
          </div>
          <div class="col-md-6">
            <h5>Quantidade Total</h5>
            <p class="quantidade">{{ produto.quantidade }} unidades</p>
          </div>
        </div>
        
        <div class="row mt-3">
          <div class="col-md-6">
            <h5>Valor Total</h5>
            <p class="valor-total">{{ produto.valorTotal | currencyBr }}</p>
          </div>
          <div class="col-md-6">
            <h5>Valor Médio por Unidade</h5>
            <p class="valor-medio">{{ getValorMedio() | currencyBr }}</p>
          </div>
        </div>
        
        <div class="row mt-3">
          <div class="col-12">
            <h5>Participação no Total</h5>
            <div class="progress">
              <div class="progress-bar" 
                   [style.width.%]="getPercentualParticipacao()"
                   role="progressbar">
                {{ getPercentualParticipacao().toFixed(1) }}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="modal-footer">
      <button type="button" 
              class="btn btn-secondary"
              (click)="fechar()">
        Fechar
      </button>
    </div>
  `,
  styles: [`
    .produto-detalhes h5 {
      color: #495057;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .produto-nome {
      font-size: 1.1rem;
      font-weight: 500;
      color: #007bff;
    }
    
    .quantidade,
    .valor-total,
    .valor-medio {
      font-size: 1.1rem;
      font-weight: 500;
      color: #28a745;
    }
    
    .progress {
      height: 25px;
      background-color: #e9ecef;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .progress-bar {
      background-color: #007bff;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      transition: width 0.3s ease;
    }
    
    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      font-weight: bold;
      color: #000;
      opacity: 0.5;
      cursor: pointer;
    }
    
    .btn-close:hover {
      opacity: 0.75;
    }
    
    .btn {
      padding: 0.375rem 0.75rem;
      border: 1px solid transparent;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: 400;
    }
    
    .btn-secondary {
      color: #6c757d;
      background-color: #6c757d;
      border-color: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover {
      background-color: #5a6268;
      border-color: #545b62;
    }
  `]
})
export class DetalheComponent {
  @Input() produto?: VendaAgregada;
  @Input() totalGeral: number = 0;

  constructor(public modalRef: BsModalRef) {}

  fechar(): void {
    this.modalRef.hide();
  }

  getValorMedio(): number {
    if (!this.produto || this.produto.quantidade === 0) return 0;
    return this.produto.valorTotal / this.produto.quantidade;
  }

  getPercentualParticipacao(): number {
    if (!this.produto || this.totalGeral === 0) return 0;
    return (this.produto.valorTotal / this.totalGeral) * 100;
  }
}

