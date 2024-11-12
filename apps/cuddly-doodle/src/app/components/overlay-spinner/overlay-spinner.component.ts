import { Component, Input, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-overlay-spinner',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './overlay-spinner.component.html',
  styleUrl: './overlay-spinner.component.css',
})
export class OverlaySpinnerComponent {
  loading = input<boolean>()
  @Input() spinnerWidth = 100
}
