import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'app-update-notifications',
  templateUrl: './update-notifications.component.html',
  styleUrls: ['./update-notifications.component.scss']
})
export class UpdateNotificationsComponent implements OnInit {

  version = environment.version;

  updates: any[] = [
    // {
    //   icon: 'person_pin',
    //   name: 'Vendedores',
    //   details: 'Ahora se puede ingresar el código del vendedor al crear una nueva orden.',
    // },
    // {
    //   icon: 'electric_moped',
    //   name: 'Rutas y entregas',
    //   details: 'Se agregaron PEDIDOS Y TRASLADOS a las rutas por sucursal.',
    // },
    {
      icon: 'send',
      name: 'Pedidos',
      details: 'Se mejoró la interfaz de usuario para que se adapte mejor a pantallas pequeñas.',
    },
    {
      icon: 'send',
      name: 'Pedidos',
      details: 'Las bodegas pueden ingresar pedidos hacia otras sucursales.',
    },
    {
      icon: 'list_alt',
      name: 'Reporte de ordenes',
      details: 'Reporte de ordenes por repartidor y corrección de errores.',
    },
    {
      icon: 'construction',
      name: 'Mantenimiento',
      details: 'Mejoras de rendimiento y corrección de errores.',
    },
  ];

  constructor(
    public dialogRef: MatDialogRef<UpdateNotificationsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

}
