import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select'
@Component({
  selector: 'app-edit-role',
  imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './edit-role.html',
  styleUrl: './edit-role.css'
})
export class EditRole implements OnInit {
  userForm!: FormGroup;
  formBuilder = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<EditRole>);

  roles: string[] = ["User", "Admin", "StoreManager"];

  data = inject<{ roles: [] }>(MAT_DIALOG_DATA);

  userRoles = this.data.roles;

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      roles: [this.data.roles || [], Validators.required]
    });
  }

  onSubmit() {
    this.dialogRef.close(this.userForm.value);
  }
}
