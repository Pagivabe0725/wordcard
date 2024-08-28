import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningPartComponent } from './learning-part.component';

describe('LearningPartComponent', () => {
  let component: LearningPartComponent;
  let fixture: ComponentFixture<LearningPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningPartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
