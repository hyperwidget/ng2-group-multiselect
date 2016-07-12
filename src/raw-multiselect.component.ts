import {
  Component,
  ViewEncapsulation,
  Inject,
  ApplicationRef,
  ViewContainerRef,
  Input,
  Output,
  EventEmitter,
  OnInit
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

export class MultiSelectComponent implements OnInit {
  @Input() inbound: Array<any>;
  @Input() displayKey: String;
  @Input() allSelected: Boolean;
  @Input() groupBy: string;

  @Output() outbound: EventEmitter<Array<any>> = new EventEmitter();

  groups: Array<any>;

  constructor() {
  }

  getSelectedItems(items): Array<any> {
    let selectedVals = [];
    if (this.inbound.length > 0) {
      this.inbound.forEach(object => {
        if (object.selected) {
          selectedVals.push(object);
        }
      });
    }
    return selectedVals;
  }

  toggleSelection(item) {
    item.selected = !item.selected;
    this.notifyParent();
  }

  notifyParent() {
    this.outbound.emit(this.getSelectedItems(this.inbound));
  }

  selectAll() {
    this.groups.forEach(object => {
      object.selected = false;
    });
    this.inbound.forEach(object => {
      object.selected = true;
    });
    this.notifyParent();
  }

  selectNone() {
    this.groups.forEach(object => {
      object.selected = false;
    });
    this.inbound.forEach(object => {
      object.selected = false;
    });
    this.notifyParent();
  }

  createGroups() {
    this.groups = [];
    this.inbound.forEach(item => {
      if (this.groups.indexOf(item[this.groupBy].toLowerCase()) === -1) {
        this.groups.push({ name: item[this.groupBy].toLowerCase(), selected: false });
      }
    });
  }

  ngOnInit() {
    this.createGroups();
    if (this.allSelected) {
      this.selectAll();
    }
  }
};