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
  
  constructor() { }

  iniciar() {
    this.reconocimiento.continuous = true;
    this.reconocimiento.interimResults = true;
    this.reconocimiento.lang = 'es-ES';

    this.reconocimiento.addEventListener('resultado', (e: any) => {
      const transcripcion = Array.from(e.results)
        .map((resultado: any) => resultado[0])
        .map((resultado) => resultado.transcript)
        .join('');
      this.transcripcion_arr.push(transcripcion)
      this.temporales = transcripcion;
      console.log(this.transcripcion_arr);

      const confidence = Array.from(e.results)
        .map((result: any) => result[0])
        .map((result) => result.confidence)
        .join('');
      this.confidencial_arr.push(confidence);
      console.log(this.confidencial_arr);
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

}
