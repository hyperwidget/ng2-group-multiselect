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
  demoVals: Object;

  constructor() {
    this.demo1 = [{ id: 1, name: "Rose Tyler", type: "companion" }, { id: 2, name: "Donna Noble", type: "companion" }, { id: 3, name: "Martha Jones", type: "companion" }, { id: 4, name: "Dalek", type: "enemy" }];
    this.demo2 = [{}];
    this.demo3 = [{}];
  }

  public refreshValues(value: any): void {
    this.demoVals = value;
  }

};