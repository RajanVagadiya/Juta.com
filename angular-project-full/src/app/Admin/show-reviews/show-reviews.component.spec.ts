import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowReviewsComponent } from './show-reviews.component';

describe('ShowReviewsComponent', () => {
  let component: ShowReviewsComponent;
  let fixture: ComponentFixture<ShowReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowReviewsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
