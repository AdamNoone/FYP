import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeofpostComponent } from './typeofpost.component';

describe('TypeofpostComponent', () => {
  let component: TypeofpostComponent;
  let fixture: ComponentFixture<TypeofpostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeofpostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeofpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
