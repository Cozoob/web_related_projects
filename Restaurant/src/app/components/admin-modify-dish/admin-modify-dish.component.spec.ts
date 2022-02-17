import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminModifyDishComponent } from './admin-modify-dish.component';

describe('AdminModifyDishComponent', () => {
  let component: AdminModifyDishComponent;
  let fixture: ComponentFixture<AdminModifyDishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminModifyDishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminModifyDishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
