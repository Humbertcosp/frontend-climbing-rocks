import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SectoresListPage } from './sectores-list.page';

describe('SectoresListPage', () => {
  let component: SectoresListPage;
  let fixture: ComponentFixture<SectoresListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SectoresListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
