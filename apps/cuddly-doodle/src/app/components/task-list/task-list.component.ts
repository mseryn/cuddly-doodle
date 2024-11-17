import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from '../task/task.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Task, User } from '@cuddly-doodle/shared';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    TaskComponent,
    MatGridListModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnChanges{
  @Input() user!: User
  @Input() tasks!: Task[]

  columns = 2
  rowHeight = '29:32'

  ngOnInit(): void {
    this.sizeColumns()
  }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tasks']) {
      this.sizeColumns()
    }
  }

  sizeColumns(): void {
    if (this.tasks?.length > 12) {
      this.columns = 4;
      this.rowHeight = '25:32'
    } else if (this.tasks?.length > 6) {
      this.columns = 3;
      this.rowHeight = '27:32'
    } else {
      this.columns = 2;
      this.rowHeight = '29:32'
    }

    console.log('Tasks are ', this.tasks?.length)
    console.log('Setting columns to ', this.columns)
  }
}
