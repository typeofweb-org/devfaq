export class FixBodyService {
  private windowOffsetY = 0;
  private scrollbarWidth = 0;

  constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    this.scrollbarWidth = this.getScrollbarWidth();
  }

  fixBody() {
    if (typeof window === 'undefined') {
      return;
    }

    this.windowOffsetY = window.pageYOffset;
    document.body.classList.add('not-scrollable');
    document.body.style.top = `-${this.windowOffsetY}px`;
    document.body.style.paddingRight = `${this.scrollbarWidth}px`;
    document.body.style.marginLeft = `-${this.scrollbarWidth / 2}px`;
  }

  unfixBody() {
    if (typeof window === 'undefined') {
      return;
    }

    document.body.classList.remove('not-scrollable');
    document.body.style.top = '';
    document.body.style.paddingRight = '';
    document.body.style.marginLeft = '';
    requestAnimationFrame(() => window.scrollTo(0, this.windowOffsetY));
  }

  private getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    // outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

    document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = 'scroll';

    // add innerdiv
    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode!.removeChild(outer);

    return widthNoScroll - widthWithScroll;
  }
}
