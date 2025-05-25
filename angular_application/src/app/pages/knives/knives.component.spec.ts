import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KnivesComponent } from './knives.component';

describe('KnivesComponent', () => {
  let component: KnivesComponent;
  let fixture: ComponentFixture<KnivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KnivesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KnivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
