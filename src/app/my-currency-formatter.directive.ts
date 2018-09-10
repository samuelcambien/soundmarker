import {HostListener, ElementRef, OnInit, Directive} from "@angular/core";
import { MyCurrencyPipe } from "./my-currency.pipe";

@Directive({ selector: "[myCurrencyFormatter]" })
export class MyCurrencyFormatterDirective implements OnInit {

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
    // private currencyPipe: MyCurrencyPipe
  ) {
    // this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.el.value = "0:00";
  }

  @HostListener("focus", ["$event.target.value"])
  onFocus(value) {
    // this.el.value = this.currencyPipe.parse(value); // opossite of transform
  }

  @HostListener("blur", ["$event.target.value"])
  onBlur(value) {
    // this.el.value = this.currencyPipe.transform(value);
  }

}
