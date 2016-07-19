# NG2-group-multiselect

***ng2-group-multiselect*** is an Angular 2 component that allows the selection of multiple items from a select style dropdown box.

It allows the entered values to be organized by groups to allow for easier sorting, and selection of all items in a group.

# **DISCLAIMER** 
This project is still in the works and as such, I strongly recommend against using it in its current state, as there will be sweeping changes during this period.
-July 18, 2016

# TODO:

 * ~~Demo Site~~
 * Ensure NPM install is working as expected
 * Unit Tests
 * Various coding tweaks
 * Handle none selected
 * Styling updates
 * Trim package.json


## Demo
[link](link)

## Installation:

```bash
npm install ng2-group-multiselect
```

# Use Example

```typescript
import{Component} from '@angular2/core';
import {MultiSelect} from 'raw-multiselect';

@Component({
    template: `
    <div>
        <raw-multiselect [inbound]="myDataSet" 
        (outbound)="mySelectedValues"
        [displayKey]="'keyName'"></raw-multiselect>
    </div> `,
    directives: [MultiSelect]
})

class App {}
```

# Configuration & Options
This section will list out the available attributes to configure the multi-select component

## Inbound - **Required**
This is the data that you're passing into the component to list out. This should be an array of objects. There are no required fields in this data, unless you want some options selected by default. 
If that's the case then the object must have a rawMSSelected: true property.

**Example**

In your template:
```html
<raw-multiselect [inbound]="demo1"...></raw-multiselect>
```
In your class:
```typescript
this.demo1 = [{id: 1, dispVal: 'Blue Jays'}, 
    {id: 2, dispVal: 'Maple Leafs'}, 
    {id: 3, dispVal: 'Raptors'}, 
    {id: 4, dispVal: 'Argos'}
];
```
**OR**
```typescript
this.demo1 = [{id: 1, dispVal: 'Blue Jays'}, 
    {id: 2, dispVal: 'Maple Leafs', selected: true}, 
    {id: 3, dispVal: 'Raptors'}, 
    {id: 4, dispVal: 'Argos', rawMSSelected:true}
];
```

## Outbound - **Required**
This is the callback that the component will trigger when the selected data has been updated. This is an eventEmitter that will call the callback with **ONLY** the selected items that the component knows about.
**Example**

In your template:
```html
<raw-multiselect (outbound)="refreshDemo1Values($event)"...></raw-multiselect>
```   
In your class:
```typescript
public refreshDemo1Values(value: any): void {
    this.demo1Vals = value;
}
```

## Display Name - **Required**
This is the property of your objects that you want to use to display in the selected values list, as well as in the list of available options. The value can be whatever you want, as long as it's a key value in your objects - this should be a string.

**Example**

In your template:
```html
<raw-multiselect [displayKey]="'dispVal"...></raw-multiselect>
```
In your class:
```typescript
this.demo1 = [{id: 1, dispVal: 'Blue Jays'}, 
    {id: 2, dispVal: 'Maple Leafs'}, 
    {id: 3, dispVal: 'Raptors'}, 
    {id: 4, dispVal: 'Argos'}
];
```

## Group By - optional
### Default - none
This is the property that you'd like to group your items by.

** If you use group by, **EVERY** object in your array must have a property with that name.

**Example**

In your template:
```html
<raw-multiselect [groupBy]="'type'"...></raw-multiselect>
```
In your class:
```typescript
this.demo2 = [{ id: 1, name: "Rose Tyler", type: "companion" }, 
    { id: 2, name: "Donna Noble", type: "companion" }, 
    { id: 3, name: "Martha Jones", type: "companion" }, 
    { id: 4, name: "Dalek", type: "enemy" }
];
```

## All Selected - optional
### Default - false
This is a boolean option that, if set to true, will automatically set all of your items passed in to be selected on initialization.

**Example**

In your template:
```html
<raw-multiselect [allSelected]="true"...></raw-multiselect>
```


# Author
[Hunter Jansen](github.com/rawkamatic)

# Licence

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.