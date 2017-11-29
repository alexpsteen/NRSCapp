import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MakeBidPage } from './make-bid';

@NgModule({
  declarations: [
    MakeBidPage,
  ],
  imports: [
    IonicPageModule.forChild(MakeBidPage),
  ],
})
export class MakeBidPageModule {}
