import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartCompatibility } from './part-compatibility';

describe('PartCompatibility', () => {
  let component: PartCompatibility;
  let fixture: ComponentFixture<PartCompatibility>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartCompatibility]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartCompatibility);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
