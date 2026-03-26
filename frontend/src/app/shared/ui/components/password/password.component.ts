import { Component, Input, Output, EventEmitter, forwardRef, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ReactiveControl } from '../../base/reactive-control';
import { Password } from 'primeng/password';

@Component({
  selector: 'mft-password',
  template: `
    <p-password
      [style]="{'width':'100%'}"  [inputStyle]="{'width':'100%'}"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [toggleMask]="toggleMask"
      [feedback]="feedback"
      [promptLabel]="promptLabel"
      [weakLabel]="weakLabel"
      [mediumLabel]="mediumLabel"
      [strongLabel]="strongLabel"
      [inputStyleClass]="inputStyleClass"
      [inputId]="inputId"
      [name]="name"
      [ngModel]="value"
      (ngModelChange)="handleInput($event)"
      (onInput)="onInput.emit($event)"
      (onFocus)="onFocus.emit($event)"
      (onBlur)="onBlur.emit($event)">
    </p-password>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PasswordComponent),
    multi: true
  }],
  imports: [Password , FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class PasswordComponent extends ReactiveControl<string> {
  @Output() valueChange = new EventEmitter<string>();

  @Input() placeholder?: string;
  @Input() toggleMask?: boolean = false;
  @Input() feedback?: boolean = false;
  @Input() promptLabel?: string;
  @Input() weakLabel?: string;
  @Input() mediumLabel?: string;
  @Input() strongLabel?: string;
  @Input() inputStyleClass?: string;
  @Input() inputId?: string;
  @Input() name: string = '';

  @Output() onInput = new EventEmitter<any>();
  @Output() onFocus = new EventEmitter<Event>();
  @Output() onBlur = new EventEmitter<Event>();

  handleInput(value: string): void {
    this.notifyValueChange(value);
    this.valueChange.emit(value);
  }
}