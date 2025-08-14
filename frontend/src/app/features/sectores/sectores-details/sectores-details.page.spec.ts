import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectoresDetailsPage } from './sectores-details.page';

describe('SectoresDetailsPage', () => {
  let component: SectoresDetailsPage;
  let fixture: ComponentFixture<SectoresDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SectoresDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
