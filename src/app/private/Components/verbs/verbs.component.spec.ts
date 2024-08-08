import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerbsComponent } from './verbs.component';

describe('VerbsComponent', () => {
  let component: VerbsComponent;
  let fixture: ComponentFixture<VerbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerbsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
