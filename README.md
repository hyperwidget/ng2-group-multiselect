# NG2-group-multiselect

*** ng2-group-multiselect*** is an Angular component that allows the selection of multiple items from a select style dropdown box.

It allows the entered values to be organized by groups to allow for easier sorting, and selection of all items in a group.


##Demo
[link](link)

##Installation:

```bash
npm install ng2-group-multiselect
```

#Use Example

```typescript
import{Component} from '@angular2/core';
import {MultiSelect} from 'raw-multiselect';

@Component({
    template: `
    <div>
    <raw-multiselect [inbound]="myDataSet" (outbound)="mySelectedValues"></raw-multiselect>
    </div> `,
    directives: [MultiSelect]
})

class App {}
```

## Author
[Hunter Jansen](github.com/rawkamatic)

## Licence

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.