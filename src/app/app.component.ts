import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <nav class="navbar">
        <div class="container">
          <h1 class="navbar-brand">Dashboard de Vendas</h1>
        </div>
      </nav>
      
      <main class="main-content">
        <div class="container">
          <div class="row">
            <div class="col-12">
              <app-upload></app-upload>
            </div>
          </div>
          
          <div class="row mt-4">
            <div class="col-12">
              <app-dashboard></app-dashboard>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    
    .navbar {
      background-color: #007bff;
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .navbar-brand {
      color: white;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }
    
    .main-content {
      padding: 2rem 0;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .row {
      display: flex;
      flex-wrap: wrap;
      margin: 0 -0.5rem;
    }
    
    .col-12 {
      flex: 0 0 100%;
      max-width: 100%;
      padding: 0 0.5rem;
    }
    
    .mt-4 {
      margin-top: 1.5rem;
    }
  `]
})
export class AppComponent {
  title = 'dashboard-vendas';
}
