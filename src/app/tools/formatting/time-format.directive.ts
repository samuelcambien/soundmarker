import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {Utils} from "../../app.component";

@Directive({
  selector: '[appTimeFormat]'
})
export class TimeFormatDirective {

  private el: HTMLInputElement;
  private backup;

  @Input("appTimeFormat") validator;
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
    this.el.value = value;
  }

  @HostListener("blur", ["$event.target.value"])
  @HostListener("keyup.enter", ["$event.target.value"])
  onBlur(value) {
    this.el.blur();
    let time = Utils.parseTime(value);
    if (value && this.validator(time)) {
      this.updated.emit(time);
    } else {
      this.el.value = this.backup;
    }
  }
}
