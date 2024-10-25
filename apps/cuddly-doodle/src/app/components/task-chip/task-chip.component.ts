import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

export interface CardData {
  imageId: string;
  state: 'default' | 'flipped';
}

@Component({
  selector: 'app-task-chip',
  standalone: true,
  imports: [CommonModule],
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
  data: CardData = {
    imageId: "",
    state: 'default',
  };

  cardClicked() {
    if (this.data.state === 'default') {
      this.data.state = 'flipped';
    } else {
      this.data.state = 'default';
    }
  }
}
