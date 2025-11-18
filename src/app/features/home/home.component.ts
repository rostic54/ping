import { Component, computed, signal } from '@angular/core';

interface SwipeState {
  startX: number;
  startY: number;
  isDragging: boolean;
  translateX: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly swipeThreshold = 100; // мінімальна відстань для спрацювання свайпу
  private readonly swipeState = signal<SwipeState>({
    startX: 0,
    startY: 0,
    isDragging: false,
    translateX: 0,
  });

  // Обчислюємо стиль трансформації для кнопки
  readonly transformStyle = computed(() => `translateX(${this.swipeState().translateX}px)`);

  // Визначаємо напрямок свайпу
  readonly isSwipingLeft = computed(() => this.swipeState().translateX < -20);

  readonly isSwipingRight = computed(() => this.swipeState().translateX > 20);

  startDrag(event: MouseEvent | TouchEvent) {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;

    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    this.swipeState.update((state) => ({
      ...state,
      startX: clientX,
      startY: clientY,
      isDragging: true,
    }));

    // Запобігаємо виділенню тексту під час перетягування
    event.preventDefault();
  }

  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.swipeState().isDragging) return;

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;

    const deltaX = clientX - this.swipeState().startX;

    // Обмежуємо рух кнопки
    const boundedDeltaX = Math.max(Math.min(deltaX, 100), -100);

    this.swipeState.update((state) => ({
      ...state,
      translateX: boundedDeltaX,
    }));

    event.preventDefault();
  }

  endDrag() {
    const currentTranslateX = this.swipeState().translateX;

    if (Math.abs(currentTranslateX) >= this.swipeThreshold) {
      // Swipe handler
      if (currentTranslateX < 0) {
        this.onSwipeLeft();
      } else {
        this.onSwipeRight();
      }
    }

    // Back btn to initial position
    this.swipeState.update((state) => ({
      ...state,
      isDragging: false,
      translateX: 0,
    }));
  }

  private onSwipeLeft() {
    // TODO: Реалізувати логіку пошуку компанії
    console.log('Go with default');
  }

  private onSwipeRight() {
    // TODO: Реалізувати логіку створення повідомлення про прогулянку
    console.log('Create custom notification');
  }
}
