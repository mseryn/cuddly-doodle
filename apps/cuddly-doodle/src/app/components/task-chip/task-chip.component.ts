import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-task-chip',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './task-chip.component.html',
  styleUrl: './task-chip.component.css',
  animations: [
    trigger('cardFlip', [
      state(
        'default',
        style({
          transform: 'none',
        })
      ),
      state(
        'flipped',
        style({
          transform: 'rotateY(180deg)',
        })
      ),
      transition('default => flipped', [animate('300ms')]),
      transition('flipped => default', [animate('300ms')]),
    ]),
  ],
})
export class TaskChipComponent {
  @Input()
  state: 'default' | 'flipped' = 'default';
}
