import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInfoElementComponent } from './card-info-element.component';

describe('CardInfoElementComponent', () => {
  let component: CardInfoElementComponent;
  let fixture: ComponentFixture<CardInfoElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardInfoElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardInfoElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
