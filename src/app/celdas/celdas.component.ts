import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-celdas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './celdas.component.html',
  styleUrl: './celdas.component.css'
})
export class CeldasComponent {
  //Habilitar que reciba datos desde un componente padre  en este caso en el componente padre es el Tablero y el hijo que recibe es el componente de celdas
  @Input() value: string | null = null; // se habilita que sea o un string o un null y el =null es para que inicie con el valor de null
}
