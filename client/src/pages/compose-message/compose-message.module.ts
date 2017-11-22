import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComposeMessagePage } from './compose-message';

@NgModule({
  declarations: [
    ComposeMessagePage,
  ],
  imports: [
    IonicPageModule.forChild(ComposeMessagePage),
  ],
})
export class ComposeMessagePageModule {}
