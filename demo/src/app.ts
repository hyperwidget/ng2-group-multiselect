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
  demo1Vals: Object;
  demo2Vals: Object;
  demo3Vals: Object;

  constructor() {
    this.demo1 = [{id: 1, dispVal: 'Blue Jays'}, {id: 2, dispVal: 'Maple Leafs'}, {id: 3, dispVal: 'Raptors'}, {id: 4, dispVal: 'Argos'}];
    this.demo2 = [{ id: 1, name: "Rose Tyler", type: "companion" }, { id: 2, name: "Donna Noble", type: "companion" }, { id: 3, name: "Martha Jones", type: "companion" }, { id: 4, name: "Dalek", type: "enemy" }];
    this.demo3 = [{}];
  }

  public refreshDemo1Values(value: any): void {
    this.demo1Vals = value;
  }

  public refreshDemo2Values(value: any): void {
    this.demo2Vals = value;
  }

  public refreshDemo3Values(value: any): void {
    this.demo3Vals = value;
  }

};