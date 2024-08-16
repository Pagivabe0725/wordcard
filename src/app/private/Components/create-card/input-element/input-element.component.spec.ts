import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputElementComponent } from './input-element.component';

describe('InputElementComponent', () => {
  let component: InputElementComponent;
  let fixture: ComponentFixture<InputElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
