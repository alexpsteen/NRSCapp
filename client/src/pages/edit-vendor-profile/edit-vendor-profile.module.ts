import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditVendorProfilePage } from './edit-vendor-profile';

@NgModule({
  declarations: [
    EditVendorProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(EditVendorProfilePage),
  ],
})
export class EditVendorProfilePageModule {}
