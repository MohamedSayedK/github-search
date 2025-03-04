import { Directive, ElementRef, HostListener, NgZone, Renderer2 } from '@angular/core';

@Directive({
  selector: '[shine]',
  standalone: true
})
export class ShineDirective {
  constructor(
    private el: ElementRef,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.ngZone.runOutsideAngular(() => {
      const rect = this.el.nativeElement.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.renderer.setStyle(this.el.nativeElement, '--mouse-x', `${x}px`);
      this.renderer.setStyle(this.el.nativeElement, '--mouse-y', `${y}px`);
    });
  }
}