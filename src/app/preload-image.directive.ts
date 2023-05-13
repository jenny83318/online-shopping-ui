import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
  selector: '[appPreloadImage]'
})
export class PreloadImageDirective {
  @Input('appPreloadImage') imageUrl!: string;

  @HostBinding('class') className = 'img';

  @HostBinding('attr.src')
  get setSrc() {
    return this.imageUrl;
  }

  @HostBinding('class.loaded')
  imageLoaded = false;

  @HostBinding('class.loading')
  imageLoading = false;

  onLoad() {
    this.imageLoaded = true;
    this.imageLoading = false;
  }
}
