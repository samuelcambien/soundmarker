import {Directive, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild} from "@angular/core";

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit {

  constructor(
    private elementRef: ElementRef,
  ) {
  }

  ngOnInit(): void {
    this.elementRef.nativeElement.querySelector('.phone-draggable')
      .ontouchstart = e => this.onPointerDown(e);
  }

  @Output() dragStart = new EventEmitter<any>();
  @Output() dragMove = new EventEmitter<any>();
  @Output() dragEnd = new EventEmitter<any>();

  private dragging = false;

  @HostListener('mousedown', ['$event'])
  onPointerDown(event): void {
    this.dragging = true;
    this.dragStart.emit(event);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event): void {
    if (!this.dragging) {
      return;
    }

    this.dragMove.emit(event.x);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event): void {
    if (!this.dragging) {
      return;
    }

    this.dragMove.emit(event.touches[0].clientX);
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchend', ['$event'])
  onPointerUp(event): void {

    if (!this.dragging) {
      return;
    }

    this.dragging = false;
    this.dragEnd.emit(event);
  }
}
