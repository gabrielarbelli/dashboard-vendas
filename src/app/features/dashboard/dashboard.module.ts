import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';

// ngx-bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';

import { DashboardComponent } from './dashboard.component';
import { DetalheComponent } from '../detalhe/detalhe.component';
import { UploadComponent } from '../upload/upload.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { CurrencyBrPipe } from '../../shared/pipes/currency-br.pipe';

@NgModule({
  declarations: [
    DashboardComponent,
    DetalheComponent,
    UploadComponent,
    PageHeaderComponent,
    CurrencyBrPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ChartModule,
    ModalModule.forRoot()
  ],
  exports: [
    DashboardComponent,
    UploadComponent,
    PageHeaderComponent
  ]
})
export class DashboardModule { }

