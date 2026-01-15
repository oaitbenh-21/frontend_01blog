import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileNav } from './profile-nav';

describe('ProfileNav', () => {
  let component: ProfileNav;
  let fixture: ComponentFixture<ProfileNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileNav);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
