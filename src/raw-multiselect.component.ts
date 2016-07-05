import {
  Component,
  ViewEncapsulation,
  Inject,
  ApplicationRef,
  ViewContainerRef,
  Input
} from "@angular/core";


@Component({
  selector: "raw-multiselect",
  directives: [],
  // Global styles imported in the app component.
  encapsulation: ViewEncapsulation.None,
  styles: [require("./raw-multiselect.component.css")],
  template: require("./raw-multiselect.component.html"),
  providers: []
})

export class MultiSelectComponent {
  @Input() inbound: Array<any>;
  @Input() outbound: Array<any>;

  constructor() {

  }
};