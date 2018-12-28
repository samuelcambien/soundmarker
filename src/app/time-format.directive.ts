import {ChangeDetectorRef, Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {Utils} from "./app.component";

@Directive({
  selector: '[appTimeFormat]'
})
export class TimeFormatDirective {

  private el: HTMLInputElement;
  private backup;

  @Output() updated = new EventEmitter();

  constructor(
    private elementRef: ElementRef,
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    this.backup = this.el.value;
    this.el.value = "";
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    if (value) {
      this.updated.emit(Utils.parseTime(value));
    } else {
      this.el.value = this.backup;
    }
  }
}
