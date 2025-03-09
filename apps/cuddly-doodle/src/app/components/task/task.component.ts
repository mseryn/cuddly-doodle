import { Component, ElementRef, Input, OnChanges, SimpleChanges, effect, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskChipComponent } from '../task-chip/task-chip.component';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../../services/data.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { Task } from '@cuddly-doodle/shared';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { OverlaySpinnerComponent } from '../overlay-spinner/overlay-spinner.component';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule,
    TaskChipComponent,
    MatCardModule,
    MatIconModule,
    OverlaySpinnerComponent
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent implements OnChanges {

  @Input() task!: Task
  icon = viewChild<MatIcon>('icon')
  observer: ResizeObserver
  oldIcon?: MatIcon
  //overlayRef: OverlayRef
  loading = false
  spinnerWidth = 100

  constructor(private readonly dataService: DataService, private readonly overlay: Overlay, private readonly elementRef: ElementRef) {
    this.observer = new ResizeObserver(this.resizeIcon.bind(this))
    /*
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().flexibleConnectedTo(this.elementRef).withPositions([{
        originX: 'center',
        originY: 'center',
        overlayX: 'center',
        overlayY: 'center'
      }])
    })
    */
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
    if (this.loading) {
      return
    }
    console.log('toggling task')
    try {
      this.loading = true
      //this.overlayRef.attach(new ComponentPortal(MatProgressSpinner))
      await this.dataService.setTaskDone(this.task.id, !this.task.isCompleted)
      this.task = await this.dataService.getTask(this.task.id)
    } finally {
      this.loading = false
      // this.overlayRef.detach()
    }
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

    /*
    this.overlayRef.updateSize({
      width: this.elementRef.nativeElement.offsetWidth,
      height: this.elementRef.nativeElement.offsetHeight
    })
    */
    this.spinnerWidth = this.elementRef.nativeElement.offsetWidth / 2
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
