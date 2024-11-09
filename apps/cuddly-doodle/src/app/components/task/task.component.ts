import { Component, Input, OnChanges, SimpleChanges, effect, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskChipComponent } from '../task-chip/task-chip.component';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../../services/data.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Task } from '@cuddly-doodle/shared';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule,
    TaskChipComponent,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnChanges {

  @Input() task!: Task
  icon = viewChild<MatIcon>('icon')
  observer: ResizeObserver
  oldIcon?: MatIcon

  constructor(private readonly dataService: DataService) {
    this.observer = new ResizeObserver(this.resizeIcon.bind(this))
    effect(() => {
      if (this.oldIcon) {
        this.observer.unobserve(this.oldIcon._elementRef.nativeElement)
      }
      this.oldIcon = this.icon()
      if (this.oldIcon != null) {
        this.observer.observe(this.oldIcon._elementRef.nativeElement)
      }
      this.resizeIcon()
    })
   }

  state: 'default' | 'flipped' = 'default'

  async toggleTask() {
    console.log('toggling task')
    await this.dataService.setTaskDone(this.task.id, !this.task.isCompleted)
    this.task = await this.dataService.getTask(this.task.id)
    // this.task.isCompleted = !this.task.isCompleted
    this.state = this.task.isCompleted ? 'flipped' : 'default'
    console.log(this.state)
  }

  resizeIcon() {
    const icon = this.icon()?._elementRef.nativeElement
    const width = icon?.offsetWidth

    icon?.style.setProperty('font-size', `${width}px`)
    icon?.style.setProperty('line-height', `${width}px`)
    icon?.style.setProperty('height', `${width}px`)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task']) {
      this.state = this.task.isCompleted ? 'flipped' : 'default'
    }
  }

  ngOnDestory() {
    if (this.oldIcon) {
      this.observer.unobserve(this.oldIcon._elementRef.nativeElement)
    }
  }
}
