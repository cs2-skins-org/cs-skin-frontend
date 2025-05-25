import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PistolsComponent } from './pistols.component';

describe('PistolsComponent', () => {
  let component: PistolsComponent;
  let fixture: ComponentFixture<PistolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PistolsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PistolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
