import {
  Directive,
  HostBinding,
  HostListener,
  Output,
  EventEmitter
} from "@angular/core";
import { keyframes } from '@angular/animations';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


export interface FileHandle {
  file: File,
  url: SafeUrl
}

@Directive({
  selector: '[appFiledir]'
})

export class FiledirDirective {
  @Output() files: EventEmitter<FileHandle[]> = new EventEmitter();
  @HostBinding('class.fileover') fileover : boolean ;
  @HostBinding("style.background") private background = "#fff";
  constructor(private sanitizer: DomSanitizer) { }
  @HostListener('dragover',['$event']) ondragover(evt)
  {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileover = true;
    this.background = '#eee';
    console.log("drag Over");
  }

  @HostListener('drop', ['$event']) public ondrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#fff';
    let files: FileHandle[] = [];
    for (let i = 0; i < evt.dataTransfer.files.length; i++) {
      const file = evt.dataTransfer.files[i];
      const url = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
      files.push({ file, url });
    }
    console.log(files);
    if (files.length > 0) {
      this.files.emit(files);
    }
  }

  @HostListener('dragleave',['$event']) public onDragLeave(evt)
  {
    evt.preventDefault();
    evt.stopPropagation();
    console.log("drag leave");
    this.background = '#fff';
  }
}
