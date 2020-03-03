import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeRecycledPostComponent } from './make-recycled-post.component';

describe('MakeRecycledPostComponent', () => {
  let component: MakeRecycledPostComponent;
  let fixture: ComponentFixture<MakeRecycledPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakeRecycledPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeRecycledPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
