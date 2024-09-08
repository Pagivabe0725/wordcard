import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetterPartComponent } from './setter-part.component';

describe('SetterPartComponent', () => {
  let component: SetterPartComponent;
  let fixture: ComponentFixture<SetterPartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetterPartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetterPartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
