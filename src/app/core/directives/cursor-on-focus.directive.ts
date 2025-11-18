import { Directive, Host, HostListener } from '@angular/core';

@Directive({
  selector: '[setCursorOnFocus]',
})
export class CursorOnFocusDirective {
  @HostListener('focus', ['$event'])
  onFocus(event: FocusEvent) {
    const inputElement = event.target as HTMLInputElement | HTMLTextAreaElement;
    // Set cursor to the end of the input value
    requestAnimationFrame(() => {
        const length = inputElement.value.length;
        inputElement.setSelectionRange(length, length);
    });
  }
}