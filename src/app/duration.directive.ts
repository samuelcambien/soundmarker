import {Directive, ElementRef, HostListener} from '@angular/core';
import {DurationFormatterPipe} from "./duration-formatter.pipe";

@Directive({
  selector: '[appDuration]'
})
export class DurationDirective {

  constructor(
    private el: ElementRef,
    private formatter: DurationFormatterPipe
  ) {
    this.format();
  }

  @HostListener("change", ["$event.target.value"])
  onChange(value) {
    this.format();
  }

  private format() {
    this.el.nativeElement.value = this.formatter.transform(this.el.nativeElement.value);
  }
}
