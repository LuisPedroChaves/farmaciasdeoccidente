import { Component, OnInit, AfterContentInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastyService } from 'src/app/core/services/internal/toasty.service';

@Component({
  selector: 'app-dashboard-delivery',
  templateUrl: './dashboard-delivery.component.html',
  styleUrls: ['./dashboard-delivery.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardDeliveryComponent implements OnInit, AfterContentInit {

    // subscriptions ------------------
    configSubscription: Subscription;
    sessionsubscription: Subscription;
    coursesubs: Subscription;
    searchtext: string;
  
      // screen
  smallScreen: boolean;
  
  courses: any[] =  [
    {
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      payment: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
  
  
    },
    {
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
  
    },
    {
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
    },
    {
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
    },
    {
  
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
  
    },
    {
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
    },
    {
  
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
    },
    {
  
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
  
    },
    {
  
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
  
    },
    {
  
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
  
    },
    {
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
  
    },
    {
  
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
  
    },
    {
  
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiuj',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
      _id:'123',
      isActive:true
  
    },
    {
  
      invoiceNumber: '5',
      nit: '730613-k',
      name: 'Farmacia1',
      address: '|Ciudad',
      phone: '2535354',
      town: 'almolonga',
      department: 'quetzaltenago',
      paymentMethod: '100',
      total: '300',
      details: 'detallesgfklgfuyglgñigiujhfggyfjyhgthgjgjlgtyhghgtglgbkjuhgjuhyjihyihyuihihyui8uyjhi9ujiujhiyhiy87i{9oujihyuihyñuihyiñ8huju8y8uyhñ8yñ8iyu8i8oyh8uyhi8ñýhiuyhuyv vfgfgcgcdgcgcggdmhgmgdcmgcgcdmgfdghgfhfvhfvfv,vf,jhf,jfgdgdffr,yhfrhfv,hfv,jh',
      image: 'imagen2.jpg',
      state:'entregado',
      timestamps: '25Days',
      timeOrder:'30Days',
      timeDispatch: '2Days',
      timeSend:'5Days',
      noOrder:'125',
       _id:'123',
       isActive:true
  
    },
  ];
  employeejobs: any[];
  loading = false;
  allsubscriptions;
  saving = false;
  
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  contextMenu2: MatMenuTrigger;
  
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    //TODO: public store: Store<AppState>,
    private bottomSheet: MatBottomSheet,
    public toasty: ToastyService,
    public dialog: MatDialog,
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

  ngAfterContentInit() {
  }

  ngOnDestroy(): void {
    this.configSubscription?.unsubscribe();
    this.sessionsubscription?.unsubscribe();
    this.allsubscriptions?.unsubscribe();
    }

  generateImage(): string {
    const image = 'Geometry.jpg';
    return image;
    }
    
    selectOrder(order: any) {
    this.router.navigate(['/order', order.name]);
    }

}
