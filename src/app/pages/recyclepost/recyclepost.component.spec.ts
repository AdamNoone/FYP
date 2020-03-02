import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecyclepostComponent } from './recyclepost.component';

describe('RecyclepostComponent', () => {
  let component: RecyclepostComponent;
  let fixture: ComponentFixture<RecyclepostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecyclepostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecyclepostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
