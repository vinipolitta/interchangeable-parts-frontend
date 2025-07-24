import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModelsList } from './vehicle-models-list';

describe('VehicleModelsList', () => {
  let component: VehicleModelsList;
  let fixture: ComponentFixture<VehicleModelsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModelsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleModelsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
