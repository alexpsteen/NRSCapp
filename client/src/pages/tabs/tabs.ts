import { Component } from '@angular/core'
import { ProjectOverviewPage } from '../project-overview/project-overview'
import { TasksPage } from '../tasks/tasks'

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = ProjectOverviewPage
  tab2Root: any = TasksPage
  constructor() {}
}
