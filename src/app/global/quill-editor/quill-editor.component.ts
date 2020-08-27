import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import Quill from 'quill';

@Component({
  selector: 'app-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.css'],
})
export class QuillEditorComponent implements OnInit {
  blurred = false;
  focused = false;

  foldersAndNames: string[] = [];
  templateFolderAndName: string;
  htmlContent: string;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    
    this.templateFolderAndName = 'html/assurmifid.html';
    this.http
      .get('assets/templates/' + this.templateFolderAndName, {
        responseType: 'text',
      })
      .subscribe((data) => {
        this.htmlContent = data;
      });
  }

  showHtml() {
    // tslint:disable-next-line:no-console
    console.log(this.htmlContent);
  }

  created(event: Quill) {
    // tslint:disable-next-line:no-console
    console.log('editor-created', event);
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    console.log('editor-change', event);
  }

  focus($event) {
    // tslint:disable-next-line:no-console
    console.log('focus', $event);
    this.focused = true;
    this.blurred = false;
  }

  blur($event) {
    // tslint:disable-next-line:no-console
    console.log('blur', $event);
    this.focused = false;
    this.blurred = true;
  }
}
