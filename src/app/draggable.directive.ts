import {Directive, EventEmitter, HostListener, Output} from "@angular/core";

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {

  @Output() dragStart = new EventEmitter<MouseEvent>();
  @Output() dragMove = new EventEmitter<MouseEvent>();
  @Output() dragEnd = new EventEmitter<MouseEvent>();

  private dragging = false;

  @HostListener('mousedown', ['$event'])
  @HostListener('touchdown', ['$event'])
  onPointerDown(event): void {
    this.dragging = true;
    this.dragStart.emit(event);
  }

  @HostListener('document:mousemove', ['$event'])
  onPointerMove(event): void {
    if (!this.dragging) {
      return;
    }

    this.dragMove.emit(event);
  }

  @HostListener('document:mouseup', ['$event'])
  @HostListener('document:touchup', ['$event'])
  onPointerUp(event: MouseEvent): void {
    if (!this.dragging) {
      return;
    }

    this.dragging = false;
    this.dragEnd.emit(event);
  }
}
