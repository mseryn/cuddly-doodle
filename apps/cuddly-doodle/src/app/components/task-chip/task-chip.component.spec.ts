import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskChipComponent } from './task-chip.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TaskChipComponent', () => {
  let component: TaskChipComponent;
  let fixture: ComponentFixture<TaskChipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TaskChipComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
