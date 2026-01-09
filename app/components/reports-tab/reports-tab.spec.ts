import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsTab } from './reports-tab';

describe('ReportsTab', () => {
  let component: ReportsTab;
  let fixture: ComponentFixture<ReportsTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
