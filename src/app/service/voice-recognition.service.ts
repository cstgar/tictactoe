import { Injectable } from '@angular/core';
declare var webkitSpeechRecognition: any;


@Injectable({
  providedIn: 'root'
})
export class VoiceRecognitionService {

  reconocimiento = new webkitSpeechRecognition();
  estaDetenidoSpeechR = false;
  public texto = '';
  temporales: any;
  transcripcion_arr: string[] = [];
  confidencial_arr: string[] = [];
  estaInciado = false; // Bandera que revisa si el usuario detuvo el servicio
  estaDetenidoAutomatica = true; // Bandera que revisa si el servicio se detuvo automáticamente
  private tableroComponent: any;
  private partialCommand: string [] = [];
  private commandTimeout: any;
  
  constructor() { }

  setTableroComponent(component: any) {
    this.tableroComponent = component;
  }

  iniciar() {
    this.reconocimiento.continuous = true;
    this.reconocimiento.interimResults = true;
    this.reconocimiento.lang = 'es-MX';

    this.reconocimiento.addEventListener('result', (e: any) => {
      const transcript = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      this.transcripcion_arr.push(transcript)
      this.temporales = transcript;
      console.log(this.transcripcion_arr[this.transcripcion_arr.length -1]);

      // const confidence = Array.from(e.results)
      //   .map((result: any) => result[0])
      //   .map((result) => result.confidence)
      //   .join('');
      // this.confidencial_arr.push(confidence);
      // console.log(this.confidencial_arr);

      this.procesarComandos(transcript);
    });

    this.reconocimiento.addEventListener('end', (condition: any) => {
      this.palabrasConcatenadas();
      if (this.estaDetenidoAutomatica) {
        this.reconocimiento.stop();
        console.log('detenido automáticamente!!');
        this.reconocimiento.start();
        console.log('comenzado automaticamente!!');
        this.estaDetenidoAutomatica = true;
      }
    });

  }

  comenzar() {
    if (!this.estaInciado) {
      this.reconocimiento.start();
      this.estaInciado = true;
      console.log('Reconocimiento de voz iniciado');
    }
    return true;
  }

  detener() {
    if (this.estaInciado) {
      this.estaDetenidoAutomatica = false;
      this.palabrasConcatenadas();
      this.reconocimiento.stop();
      this.estaInciado = false;
      console.log('Reconocimiento de voz detenido por el usuario');
    }
    return false;
  }

  palabrasConcatenadas() {
    this.texto = this.texto + ' ' + this.temporales + '.';
    this.temporales = '';
  }

  procesarComandos(comando: string) {
    clearTimeout(this.commandTimeout);
    this.partialCommand.push(comando.trim());

    if (this.partialCommand.length === 2) { // **Cambio: Verificar si hay dos palabras**
      this.analyzeCommands();
    } else {
      this.commandTimeout = setTimeout(() => {
        this.partialCommand = []; // **Cambio: Reiniciar si no se completa el comando**
      }, 1000); // Espera 1 segundo para recibir la segunda palabra
    }
  }

  analyzeCommands() {
    const fullCommand = this.partialCommand.join(' ').trim();
    this.partialCommand = [];

    const comandosCasilla: { [key: string]: number } = {
      'arriba izquierda': 0,
      'arriba medio': 1,
      'arriba derecha': 2,
      'medio izquierda': 3,
      'medio medio': 4,
      'medio derecha': 5,
      'abajo izquierda': 6,
      'abajo medio': 7,
      'abajo derecha': 8,
    };
  ///////////
    

    const index = comandosCasilla[fullCommand];
      console.log(fullCommand);
      if (index !== undefined && this.tableroComponent) {
        this.tableroComponent.hacerMovimiento(index);
      } else {
        console.log('Comando no reconocido.');
        console.log('Aquiii lo que no reconocio: ', fullCommand);
      }
    
  }


}
