import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsTab } from './posts-tab';

describe('PostsTab', () => {
  let component: PostsTab;
  let fixture: ComponentFixture<PostsTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsTab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
