import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteInputComponent } from './write-input.component';

describe('WriteInputComponent', () => {
  let component: WriteInputComponent;
  let fixture: ComponentFixture<WriteInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriteInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriteInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
