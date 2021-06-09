import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-notifications',
  templateUrl: './update-notifications.component.html',
  styleUrls: ['./update-notifications.component.scss']
})
export class UpdateNotificationsComponent implements OnInit {

  updates: any[] = [
    {
      icon: 'person_pin',
      name: 'Vendedores',
      details: 'Ahora se puede ingresar el código del vendedor al crear una nueva orden.',
    },
    {
      icon: 'electric_moped',
      name: 'Rutas y entregas',
      details: 'Módulo movilizado al menú de administradores, centralizando las ordenes, pedidos y traslados entre sucursales.',
    },
    {
      icon: 'ballot',
      name: 'Monitor de pedidos',
      details: 'Pantalla creada para control de pedidos en bodegas, manejo de estados y solicitudes en tiempo real.',
    },
    {
      icon: 'send',
      name: 'Pedidos y traslados',
      details: 'Se ha mejorado la definición de apartados para que sea más clara y fácil de entender, ahora se pueden crear pedidos y traslados desde la sucursal de origen así como sus respectivas solicitudes a otras sucursales.',
    },
    {
      icon: 'list_alt',
      name: 'Reporte de ordenes',
      details: 'Reporte de ordenes por mes y sucursales, contabilizando la cantidad de domicilios.',
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
