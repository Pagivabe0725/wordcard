import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickInputComponent } from './click-input.component';

describe('ClickInputComponent', () => {
  let component: ClickInputComponent;
  let fixture: ComponentFixture<ClickInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClickInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClickInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
