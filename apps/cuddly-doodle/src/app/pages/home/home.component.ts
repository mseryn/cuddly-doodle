import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { DataService } from '../../services/data.service';
import { TaskComponent } from '../../components/task/task.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { Task, User } from '@cuddly-doodle/shared';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatTabsModule,
    TaskComponent,
    MatGridListModule,
    TaskListComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {

    tasks: Record<string, Task[]> = {}
    users: User[] = []
    parents = false
    cols = 3
    interval = 0
  
    constructor(private readonly dataService: DataService) { }
  
    async ngOnInit(): Promise<void> {
      this.interval = window.setInterval(() => {
        this.fetchTasks()
      }, 5 * 60 * 1000)
      this.fetchTasks()
    }

    async ngOnDestroy(): Promise<void> {
      window.clearInterval(this.interval)
    }

    async fetchTasks(): Promise<void> {
      this.users = await this.dataService.getUsers()
      console.warn(this.users)
      const allTasks = await this.dataService.getTasks()
      for (const user of this.users) {
        this.tasks[user.id] = allTasks.filter((task: Task) => task.sectionId === user.id)
      }
      console.warn(this.tasks)
      this.setCols()
    }

    setCols() {
      this.cols = this.users.filter((user) => user.isParent === this.parents).length
    }

    toggleParents() {
      this.parents = !this.parents
      this.setCols()
    }
}
