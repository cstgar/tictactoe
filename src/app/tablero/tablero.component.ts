import { Component, OnInit } from '@angular/core';
import { CeldasComponent } from '../celdas/celdas.component';
import { CommonModule } from '@angular/common';
import {VoiceRecognitionService} from '../service/voice-recognition.service'

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [CommonModule, CeldasComponent],
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.css'],
  providers: [VoiceRecognitionService] 
})
export class TableroComponent implements OnInit {
  //celdas
  celdas: string[] = Array(9).fill(''); //generando el tablero de 9 celdas y rellenandolas con un string vacío
  jugadorActual: string = 'X';
  ganador: string | null = null;

  //funcion para hacer movimiento en el tablero
  hacerMovimiento (index: number) {
    //celda en el tablero que fue presionada
    //si la celda en la posición index no ha sido presionada (o está vacía) y si no hay ganador entonces
    if (!this.celdas[index] && !this.ganador) {
      this.celdas[index] = this.jugadorActual; //entonces se iguala la celda actual al jugadorActual con la 'X'
      // se revisa que ese movimiento que se hizo sea ganador con la función revisarGanador
      if (this.revisarGanador()) { //si es ganador entonces
        this.ganador = this. jugadorActual; //el ganador se iguala al jugador actual
        alert(`${this.jugadorActual} gana!!`); //Se manda un alert al jugador para que sepa que ha ganado
      } else if (this.celdas.every(casilla => casilla)) { //sino hay ganador entonces verifica si hay empate
        // el método every es para los arrays y verifica si todos los elementos del array cumplen con una condición especificada devolviendo true
        //verifica si todas las celdas del tablero están llenas y si todas las celdas están llenas y no hay un ganador, se declara un empate.
        alert('Empate!!');
      } else { //Sino hay ganador ni empate entonces cambia de turno el jugadorActual, el jugador actual se actualiza
        if (this.jugadorActual === 'X') { //si el jugador actual es X entonces actualiza a 'O'
          this.jugadorActual = 'O'
        } else (this.jugadorActual = 'X');// sino pues se actualiza a 'X'
      }
    }
  }


  //funcion para revisarGandor
  revisarGanador () {
    const combinacionesGanadoras = [
      [0, 1, 2], // linea horizontal 1 tomando en cuenta los indices del array
      [3, 4, 5], // linea horizontal 2
      [6, 7, 8], // linea horizontal 3
      [0, 3, 6], // linea vertical 1
      [1, 4, 7], // linea vertical 2
      [2, 5, 8], // linea vertical 3
      [0, 4, 8], // diagonal 1 \
      [2, 4, 6]  // diaganal 2 /
    ];

    // revisar si en el tablero hay alguna combinación ganadora
    return combinacionesGanadoras.some( combinacion => {// el metodo some es un metodo de los arrays que evalua una condición y si almenos una cumple la condición devuelve true
      return combinacion.every( index => this.celdas[index] === this.jugadorActual)//combinacion es el sub-array de las combinacioinesGanadoras es decir checa filas, columnas y diagonales si son iguales al jugadorActual para saber que todas son iguales
    })
  }

  //función resetear el tablero
  resetearTablero () {
    this.celdas = Array(9).fill(''); //crea un nuevo array con cadenas vacías para asegurarnos de limpiar las referencias de los datos anteriores
    this.jugadorActual = 'X';
    this.ganador = null;
  }


  //La parte del servicio de web speech api nativa
  aunEstaReconociendo = false; // bandera para saber si aún esta corriendo el servicio
  
  constructor(public servicio: VoiceRecognitionService) {
    this.servicio.iniciar();
    this.servicio.setTableroComponent(this);
  }

  ngOnInit(): void {}

  iniciarServicio() {
    this.aunEstaReconociendo = this.servicio.comenzar() === true ? true : false;
  }

  detenerServicio() {
    this.aunEstaReconociendo = this.servicio.detener() === false ? false : true;
    this.servicio.procesarComandos(this.servicio.temporales);
  }

}
