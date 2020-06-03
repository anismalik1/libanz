import { Directive, HostListener, HostBinding } from '@angular/core';
import { keyframes } from '@angular/animations';

@Directive({
  selector: '[appFiledir]'
})

export class FiledirDirective {
  
  @HostBinding('class.fileover') fileover : boolean ;
  constructor() { }
  @HostListener('dragover',['$event']) ondragover(evt)
  {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileover = true;
    console.log("drag Over");
  }

  @HostListener('drop',['$event']) ondrop(evt)
  {
    this.fileover = true;
    evt.preventDefault();
    evt.stopPropagation();
    console.log(evt);
    const files = evt.dataTransfer.files;
    if(files.length > 0)
    {
      console.log('you dropped ${files}');
    }
    console.log("dropped");
  }

  @HostListener('dragleave',['$event']) public onDragLeave(evt)
  {
    evt.preventDefault();
    evt.stopPropagation();
    console.log("drag leave");
  }

  @HostListener('dragleave',['$event']) public onDrop(evt)
  {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileover = false;
    const files = evt.dataTransfer.files;
    if(files.length > 0)
    {
      console.log('you dropped ${files}');
    }
  }
}
