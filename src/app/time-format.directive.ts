import {Directive, ElementRef, HostListener} from '@angular/core';
import {Utils} from "./app.component";

@Directive({
  selector: '[appTimeFormat]'
})
export class TimeFormatDirective {

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = Utils.getTimeFormatted(this.el.value);
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.el.value = "";
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {

    this.el.value = "" + Utils.parseTime(value);
  }
}
