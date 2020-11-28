import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {
  @Input() deviceXs: boolean;
  allExpandState = false;

  // Factory Modules
  factoryModules: any[] = [
    { module: 'production', label: 'Producción', active: true,
      subModules: [
        { name: 'manufacturing', label: 'Manufactura', active: true,
          features: [
            { name: 'productions', label: 'Producciones', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'productStock', label: 'Inventario de Productos', accessLevel: 0, options: [0, 1, 4] }
          ]
        },
        { name: 'products', label: 'Productos', active: true,
          features: [
            { name: 'products', label: 'Productos', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'categories', label: 'Categorías', accessLevel: 1, options: [1, 3] }
          ]
        },
        { name: 'inventory', label: 'Inventario', active: true,
          features: [
            { name: 'inventory', label: 'Existencias', accessLevel: 0, options: [0, 1] },
            { name: 'rawMaterial', label: 'Materia Prima', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'categories', label: 'Categorías', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'units', label: 'Unidades', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'services', label: 'Servicios', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'transfers', label: 'Transferencias', accessLevel: 0, options: [0, 3] },
          ]
        }
      ]
    },
    { module: 'purchases', label: 'Compras', active: true,
      features: [
        { name: 'purchases', label: 'Compras', accessLevel: 0, options: [0, 1, 2, 3] },
        { name: 'balance', label: 'Balance', accessLevel: 0, options: [0, 1, 2, 3] },
      ]
    },
    { module: 'sales', label: 'Ventas', active: true,
      subModules: [
        { name: 'billing', label: 'Facturación', active: true,
          features: [
            { name: 'sale', label: 'Ventas', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'bill', label: 'Facturación', accessLevel: 0, options: [0, 1, 4] }
          ]
        },
        { name: 'clients', label: 'Clientes', active: true,
          features: [
            { name: 'client', label: 'Clientes', accessLevel: 0, options: [0, 1, 2, 3] },
          ]
        },
      ]
    },
    { module: 'transferences', label: 'Transferencias', active: true,
      features: [
        { name: 'transferences', label: 'Transferencias', accessLevel: 0, options: [0, 1, 2, 3] },
      ]
    },
    { module: 'employees', label: 'Empleados', active: true,
      features: [
        { name: 'employees', label: 'Empleados', accessLevel: 0, options: [0, 1, 2, 3] },
        { name: 'jobs', label: 'Puestos', accessLevel: 1, options: [1, 2, 3] },
      ]
    },
    { module: 'reports', label: 'Reportes', active: true,
      features: [
        { name: 'reports', label: 'Reportes Generados', accessLevel: 0, options: [0, 1, 2, 3] },
      ]
    },
    { module: 'providers', label: 'Proveedores', active: true,
      features: [
        { name: 'providers', label: 'Proveedores', accessLevel: 0, options: [0, 1, 2, 3] },
      ]
    },
  ];

  shopModules: any[] = [
    { module: 'production', label: 'Producción', active: true,
      subModules: [
        { name: 'productinventory', label: 'Inventario de Productos', active: true,
          features: [
            { name: 'inventory', label: 'Existencias', accessLevel: 0, options: [0, 1] },
          ]
        }
      ]
    },
    { module: 'sales', label: 'Ventas', active: true,
      subModules: [
        { name: 'billing', label: 'Facturación', active: true,
          features: [
            { name: 'sale', label: 'Ventas', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'bill', label: 'Facturación', accessLevel: 0, options: [0, 1, 4] }
          ]
        },
        { name: 'clients', label: 'Clientes', active: true,
          features: [
            { name: 'client', label: 'Clientes', accessLevel: 0, options: [0, 1, 2, 3] },
          ]
        },
      ]
    },
    { module: 'transferences', label: 'Transferencias', active: true,
      features: [
        { name: 'transferences', label: 'Transferencias', accessLevel: 0, options: [0, 1, 2, 3] },
      ]
    },
    { module: 'employees', label: 'Empleados', active: true,
      features: [
        { name: 'employees', label: 'Empleados', accessLevel: 0, options: [0, 1, 2, 3] },
        { name: 'jobs', label: 'Puestos', accessLevel: 1, options: [1, 2, 3] },
      ]
    },
    { module: 'reports', label: 'Reportes', active: true,
      features: [
        { name: 'reports', label: 'Reportes Generados', accessLevel: 0, options: [0, 1, 2, 3] },
      ]
    },
  ];

  adminModules: any[] = [
    { module: 'cellars', label: 'Sucursales', active: true,
      features: [
        { name: 'cellars', label: 'Sucursales y Almacenes', accessLevel: 0, options: [0, 1, 2, 3] },
      ]
    },
    { module: 'production', label: 'Producción', active: true,
      subModules: [
        { name: 'manufacturing', label: 'Manufactura', active: true,
          features: [
            { name: 'productions', label: 'Producciones', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'productStock', label: 'Inventario de Productos', accessLevel: 0, options: [0, 1, 4] }
          ]
        },
        { name: 'products', label: 'Productos', active: true,
          features: [
            { name: 'products', label: 'Productos', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'categories', label: 'Categorías', accessLevel: 1, options: [1, 3] }
          ]
        },
        { name: 'inventory', label: 'Inventario', active: true,
          features: [
            { name: 'inventory', label: 'Existencias', accessLevel: 0, options: [0, 1] },
            { name: 'rawMaterial', label: 'Materia Prima', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'categories', label: 'Categorías', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'units', label: 'Unidades', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'services', label: 'Servicios', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'transfers', label: 'Transferencias', accessLevel: 0, options: [0, 3] },
          ]
        }
      ]
    },
    { module: 'purchases', label: 'Compras', active: true,
      features: [
        { name: 'purchases', label: 'Compras', accessLevel: 0, options: [0, 1, 2, 3] },
        { name: 'balance', label: 'Balance', accessLevel: 0, options: [0, 1, 2, 3] },
      ]
    },
    { module: 'sales', label: 'Ventas', active: true,
      subModules: [
        { name: 'billing', label: 'Facturación', active: true,
          features: [
            { name: 'sale', label: 'Ventas', accessLevel: 0, options: [0, 1, 2, 3] },
            { name: 'bill', label: 'Facturación', accessLevel: 0, options: [0, 1, 4] }
          ]
        },
        { name: 'clients', label: 'Clientes', active: true,
          features: [
            { name: 'client', label: 'Clientes', accessLevel: 0, options: [0, 1, 2, 3] },
          ]
        },
      ]
    },
    { module: 'transferences', label: 'Transferencias', active: true,
      features: [
        { name: 'transferences', label: 'Transferencias', accessLevel: 0, options: [0, 1, 2, 3] },
      ]
    },
    { module: 'employees', label: 'Empleados', active: true,
      features: [
        { name: 'employees', label: 'Empleados', accessLevel: 0, options: [0, 1, 2, 3] },
        { name: 'jobs', label: 'Puestos', accessLevel: 1, options: [1, 2, 3] },
      ]
    },
    { module: 'reports', label: 'Reportes', active: true,
      features: [
        { name: 'reports', label: 'Reportes Generados', accessLevel: 0, options: [0, 1, 2, 3] },
      ]
    },
    { module: 'providers', label: 'Proveedores', active: true,
      features: [
        { name: 'providers', label: 'Proveedores', accessLevel: 0, options: [0, 1, 2, 3] },
      ]
    },
    { module: 'users', label: 'Usuarios y Permisos', active: true,
      features: [
        { name: 'users', label: 'Usuarios', accessLevel: 0, options: [0, 1, 2, 3] },
        { name: 'roles', label: 'Roles', accessLevel: 0, options: [0, 1, 2, 3] },
      ]
    },
  ];

  newRole: any = {
    _id: '',
    roleName: '',
    roleType: 'FACTORY',
    modules: this.factoryModules
  };

  constructor() { }

  ngOnInit(): void {
  }

}
