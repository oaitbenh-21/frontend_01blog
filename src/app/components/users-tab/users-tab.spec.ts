import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTab } from './users-tab';

describe('UsersTab', () => {
  let component: UsersTab;
  let fixture: ComponentFixture<UsersTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
