import { ControlValueAccessor } from '@angular/forms';

export abstract class ReactiveControl<T = any> implements ControlValueAccessor {
  value: T | null = null;
  disabled = false;

  protected onChange: (value: T | null) => void = () => {};
  protected onTouched: () => void = () => {};

  writeValue(value: T): void {
    this.value = value;
  }

  registerOnChange(fn: (value: T | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  protected notifyValueChange(value: T | null): void {
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
  
}
