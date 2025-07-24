import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleModelsForm } from './vehicle-models-form';

describe('VehicleModelsForm', () => {
  let component: VehicleModelsForm;
  let fixture: ComponentFixture<VehicleModelsForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleModelsForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleModelsForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
