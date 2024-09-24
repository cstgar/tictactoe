import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TableroComponent } from './tablero/tablero.component';

export const routes: Routes = [
    {
        //string en vacio para poder dejar el componente como la ruta principal
        path: '',
        component: HomeComponent
    },
    {
        path: 'partida',
        component: TableroComponent
    }
];
