import { TestBed } from '@angular/core/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from './spinner.service';

describe('SpinnerService', () => {
  let service: SpinnerService;
  let ngxSpinnerMock: any;

  beforeEach(() => {
    ngxSpinnerMock = {
      show: vi.fn(),
      hide: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        SpinnerService,
        { provide: NgxSpinnerService, useValue: ngxSpinnerMock }
      ]
    });

    service = TestBed.inject(SpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call ngxSpinner.show on show()', () => {
    service.show();
    expect(ngxSpinnerMock.show).toHaveBeenCalled();
  });

  it('should call ngxSpinner.hide on hide()', () => {
    service.hide();
    expect(ngxSpinnerMock.hide).toHaveBeenCalled();
  });
});
