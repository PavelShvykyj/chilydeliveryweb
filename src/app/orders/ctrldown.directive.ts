import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[CtrlStatus]'
})
export class CtrlStatusDirective {

  @Output('OnDirectiveChange') OnDirectiveChange = new EventEmitter();

  constructor(private el: ElementRef) {
    console.log("DIRECTIVE",this.el);
   }

  @HostListener('keydown.control', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    console.log('DOWN');
    this.OnDirectiveChange.emit(true)
  }

  @HostListener('keyup.control', ['$event']) onKeyUpHandler(event: KeyboardEvent) {
    console.log('UP');
    this.OnDirectiveChange.emit(false)
  }



}
