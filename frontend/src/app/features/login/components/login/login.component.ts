import { Component, } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextComponent } from "../../../../shared/ui/components/input/input.component";
import { PasswordComponent } from "../../../../shared/ui/components/password/password.component";
import { ButtonComponent } from "../../../../shared/ui/components/button/button.component";

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, InputTextComponent, PasswordComponent, ButtonComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

    form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email, ]],
        password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit() {
        if (this.form.valid) {
        console.log('Форма отправлена:', this.form.value);
        // Здесь обработка регистрации
        }
    }

}
