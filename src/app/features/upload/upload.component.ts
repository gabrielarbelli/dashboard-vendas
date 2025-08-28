import { Component } from '@angular/core';
import { VendasService } from '../../core/services/vendas.service';

@Component({
  selector: 'app-upload',
  template: `
    <div class="upload-container">
      <div class="upload-area" 
           [class.dragover]="isDragOver"
           (dragover)="onDragOver($event)"
           (dragleave)="onDragLeave($event)"
           (drop)="onDrop($event)">
        <i class="pi pi-cloud-upload" style="font-size: 3rem; color: #6c757d;"></i>
        <h3>Upload do arquivo CSV</h3>
        <p>Arraste e solte o arquivo aqui ou clique para selecionar</p>
        <input type="file" 
               #fileInput
               accept=".csv"
               (change)="onFileSelected($event)"
               style="display: none;">
        <button type="button" 
                class="btn btn-primary"
                (click)="fileInput.click()">
          Selecionar Arquivo
        </button>
      </div>
      
      <div *ngIf="errorMessage" class="alert alert-danger mt-3" role="alert">
        <i class="pi pi-exclamation-triangle"></i>
        {{ errorMessage }}
      </div>
      
      <div *ngIf="successMessage" class="alert alert-success mt-3" role="alert">
        <i class="pi pi-check"></i>
        {{ successMessage }}
      </div>
    </div>
  `,
  styles: [`
    .upload-container {
      max-width: 600px;
      margin: 0 auto;
    }
    
    .upload-area {
      border: 2px dashed #dee2e6;
      border-radius: 8px;
      padding: 3rem 2rem;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .upload-area:hover,
    .upload-area.dragover {
      border-color: #007bff;
      background-color: #f8f9fa;
    }
    
    .upload-area h3 {
      margin: 1rem 0 0.5rem 0;
      color: #495057;
    }
    
    .upload-area p {
      color: #6c757d;
      margin-bottom: 1.5rem;
    }
    
    .btn {
      padding: 0.5rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
    }
    
    .btn-primary {
      background-color: #007bff;
      color: white;
    }
    
    .btn-primary:hover {
      background-color: #0056b3;
    }
    
    .alert {
      padding: 0.75rem 1rem;
      border-radius: 4px;
      border: 1px solid transparent;
    }
    
    .alert-danger {
      color: #721c24;
      background-color: #f8d7da;
      border-color: #f5c6cb;
    }
    
    .alert-success {
      color: #155724;
      background-color: #d4edda;
      border-color: #c3e6cb;
    }
    
    .alert i {
      margin-right: 0.5rem;
    }
  `]
})
export class UploadComponent {
  isDragOver = false;
  errorMessage = '';
  successMessage = '';

  constructor(private vendasService: VendasService) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.processFile(files[0]);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  private processFile(file: File): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!file.name.toLowerCase().endsWith('.csv')) {
      this.errorMessage = 'Por favor, selecione um arquivo CSV válido.';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const csvContent = e.target?.result as string;
      const result = this.vendasService.processarCSV(csvContent);
      
      if (result.success) {
        this.successMessage = 'Arquivo processado com sucesso!';
      } else {
        this.errorMessage = result.error || 'Erro ao processar arquivo.';
      }
    };

    reader.onerror = () => {
      this.errorMessage = 'Erro ao ler o arquivo.';
    };

    reader.readAsText(file);
  }
}

