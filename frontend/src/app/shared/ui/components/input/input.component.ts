import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ReactiveControl } from '../../base/reactive-control';

@Component({
  selector: 'mft-input-text',
  template: `
    <input
      type="text"
      pInputText
      [placeholder]="placeholder"
      [disabled]="disabled"
      [readonly]="readonly"
      [ngModel]="value" (ngModelChange)="handleInput($event)"
      [attr.aria-label]="ariaLabel"
      [attr.name]="name"
      [attr.id]="inputId"
      [attr.autocomplete]="autocomplete"
      (blur)="blur.emit($event)"
      (focus)="focus.emit($event)"
    />
  `,
  imports: [InputText, FormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputTextComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `input {width: 100%}`
})
export class InputTextComponent extends ReactiveControl<string | null> {
  @Output() valueChange = new EventEmitter<string>();

  @Input() placeholder?: string = '';
  @Input() readonly?: boolean = false;
  @Input() maxlength?: number;
  @Input() minlength?: number;
  @Input() ariaLabel?: string;
  @Input() name?: string;
  @Input() inputId?: string;
  @Input() autocomplete?: string;
  @Input() styleClass?: string;

  @Output() blur = new EventEmitter<FocusEvent>();
  @Output() focus = new EventEmitter<FocusEvent>();

  handleInput(value: string): void {
    this.notifyValueChange(value);
    this.valueChange.emit(value);
  }
}
