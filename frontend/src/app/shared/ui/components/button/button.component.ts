import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Button } from "primeng/button";

@Component({
	selector: 'mft-button', 
	template: `<p-button 
        [label]="label"
        [loading]="loading"
        [disabled]="disabled"
        [icon]="icon"
        [severity]="severity"
        (onClick)="onClick.emit($event)"
    />`,
    imports: [Button],
})
export class ButtonComponent {
    @Input() label = 'Submit';
    @Input() disabled = false;
    @Input() loading = false;
    @Input() icon?: string;
    @Input() severity: 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast' | null | undefined;

    @Output() onClick = new EventEmitter<MouseEvent>();

}


