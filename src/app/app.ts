import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { SharedModule } from './shared/shared.module';  
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, SharedModule],
  templateUrl: './app.html',  
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('interchangeable-parts-frontend');
}
