import {Directive, EventEmitter, HostListener, Output} from "@angular/core";

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {

  @Output() dragStart = new EventEmitter<any>();
  @Output() mouseMove = new EventEmitter<any>();
  @Output() touchMove = new EventEmitter<any>();
  @Output() dragEnd = new EventEmitter<any>();

  private dragging = false;

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onPointerDown(event): void {
    this.dragging = true;
    this.dragStart.emit(event);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event): void {
    if (!this.dragging) {
      return;
    }

    this.mouseMove.emit(event);
  }

  @HostListener('document:touchmove', ['$event'])
  onTouchMove(event): void {
    if (!this.dragging) {
      return;
    }

    this.touchMove.emit(event);
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
