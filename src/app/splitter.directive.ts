import {Directive, ElementRef, HostListener, Renderer2} from "@angular/core";
import {ControlValueAccessor} from "@angular/forms";

@Directive({
  selector: '[splitterControl]',
  // providers: [ SPLITTER_VALUE_ACCESSOR ]
})
export class SplitterDirective implements ControlValueAccessor {
  onChange;

  constructor( private renderer : Renderer2,
               private element : ElementRef ) {
  }
  @HostListener('input', [ '$event.target.value' ])
  input( value ) {
    this.onChange(value.split(',').filter(Boolean));
  }
  writeValue( value : any ) : void {
    const element = this.element.nativeElement;
    this.renderer.setProperty(element, 'value', value.join(','));
  }

  registerOnChange( fn : any ) : void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
  }
}
