import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryDetailsComponent } from './components/delivery-details/delivery-details.component';
import { RouterModule } from '@angular/router';
import { DeliveryRoutes } from './delivery.routing';
import { CoreModule } from 'src/app/core/core.module';
import { SharedComponentsModule } from '../../shared-components/shared-components.module';



@NgModule({
  declarations: [DeliveryDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(DeliveryRoutes),
    CoreModule,
    SharedComponentsModule
  ]
})
export class DeliveryModule { }
