import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { DatePicker } from 'ui/date-picker';
import { TimePicker } from 'ui/time-picker';
import { ListPicker } from 'ui/list-picker';
import { Page } from 'ui/page';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    moduleId: module.id,
    templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {

    comment: FormGroup;

    constructor(private formBuilder: FormBuilder, private params: ModalDialogParams) {

        this.comment = this.formBuilder.group({
            rating: [5, Validators.required],
            author: ['', Validators.required],
            comment: ['', Validators.required]
        });
    }

    ngOnInit() {

    }

    public submit() {
        let comment = this.comment.value;
        
        comment.date = new Date().toISOString();

        this.params.closeCallback(comment);
    }
}