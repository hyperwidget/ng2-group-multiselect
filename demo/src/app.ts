import {
  Component,
  ViewEncapsulation,
  Inject,
  ApplicationRef,
  ViewContainerRef
} from "@angular/core";

import {MultiSelectComponent} from "../../src/";

@Component({
  selector: "app",
  directives: [MultiSelectComponent],
  // Global styles imported in the app component.
  encapsulation: ViewEncapsulation.None,
  styles: [require("./app.css")],
  template: require("./app.html"),
  providers: []
})

export class DemoAppComponent {
  demo1: Array<any>;
  demo2: Array<any>;
  demo3: Array<any>;

  constructor() {
    this.demo1 = ['a', 'n'];
    this.demo2 = [{}];
    this.demo3 = [{}];
  }
};