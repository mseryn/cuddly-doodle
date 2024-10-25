import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatCardModule} from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import { TaskChipComponent } from '../../components/task-chip/task-chip.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatTabsModule,
    TaskChipComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
