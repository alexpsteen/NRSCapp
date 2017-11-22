import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventPlannerHomePage } from './event-planner-home';

@NgModule({
  declarations: [
    EventPlannerHomePage,
  ],
  imports: [
    IonicPageModule.forChild(EventPlannerHomePage),
  ],
})
export class EventPlannerHomePageModule {}
