# react-combo-search

React component encapsulating the logic for filtering with select dropdown and text / dates.
Comes with [react-combo-select](https://www.npmjs.com/package/react-combo-select) and [react-datetime](https://www.npmjs.com/package/react-datetime) out of the box, but can take render props for select and date picker so you are not forced to use these two packages.


## Usability
Peer dependencies: React and react-dom. 
Optional dependencies: react-combo-select, react-datetime *font-awesome(peer of react-combo-select) and moment(peer of react-datetime)
```javascript
import { ComboSearch } from 'react-combo-search';
```
and include css file (you may include this in different way) *if you use react-combo-select and react-datetime you are gonna need their css also
```javascript
require('../node_modules/react-combo-search/css/style.css');
```
## Demo
We prepared code sandbox demo. Unfortunately, we haven't found the time to add some generic data for you to filter, but you can freely play around with component ot get the feel of what it does.
[See demo here](https://codesandbox.io/embed/y0nzvl80lx)

## props/options

### onSearch and selectData
There are two mandatory props: first one is "onSearch" which gets fired on submit. Second one is "selectData", which is a required prop in react-combo-select and populates select with options

```javascript
import React, {Component} from 'react';
import ComboSearch from 'react-combo-search';
// You should not forget to include css

export default class FakeComponent extends Component {

	constructor(props) {
		super(props);

		this.searchCallback = this.searchCallback.bind(this);
	}

	searchCallback(data) {
		console.log(data);
		// you may do something with form data here
		// like call API by async action creator, do client side filtering
		// and transform the data first if you need it in slightly different format
	}

	render() {
		return (
			<div>
				<ComboSearch
					onSearch={this.searchCallback}
					selectData={['Name', 'Surname', 'Title', 'Date of birth']}
					datePickerCriteria='Date of birth'
				/>
			</div>
		);
	}
}
```

### classNames
If you decide on using existing components, you may want to style them differently. You can also pass any prop to style these two in additionalSelectProps and additionalDatePickerProps, see next table. 

| Property | Default | Description |
| ------------ | ------- | ----------- |
| **classNames** | --- | Object containing classnames listed below |
| **classNames.wrapper** | ComboSearch | Component root element |
| **classNames.datePickerRadioWrapper** | ComboSearch__datePicker | Element wrapping radio buttons and date picker input |
| **classNames.radioGroupWrapper** | ComboSearch__RadioWrapper | Element wrapping radio buttons component |
| **classNames.datePickerWrapper** | ComboSearch__datePickerWrapper | Element wrapping date picker component |
| **classNames.textInput** | ComboSearch__input InputBox | Text input field |
| **classNames.button** | Button Button--action | Apply button, should you choose to use it |
| **radioGroupClassNames** | --- | Object containing classnames for RadioGroup component listed below |
| **radioGroupClassNames.wrapper** | RadioGroup | Component root element |
| **radioGroupClassNames.label** | RadioGroup__label | Class name for label |
| **radioGroupClassNames.fakeRadio** | RadioGroup__fakeRadio | Outer span that can act as a fake radio button |
| **radioGroupClassNames.fakeRadioInner** | RadioGroup__fakeRadioInner | Inner span that can act as a part of a fake radio button |
| **filterBarClassNames** | --- | Object containing classnames for FilterBar component listed below |
| **filterBarClassNames.wrapper** | FilterBar | Component root element |
| **filterBarClassNames.filter** | FilterBar__filter | Class name for individual filter, black card wih filter info |
| **filterBarClassNames.removeButton** | FilterBar__filterClose | Span tag that destroys filter on click |
| **filterBarClassNames.text** | FilterBar__filterText | Paragraph tag containing text inside the filter card |

### All props

| Property         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| **onSearch** | function | none | Callback to invoke on filter apply, gets passed form data as only argument
| **selectData** | array of objects | none | Data for **react-combo-select** to populate select with options, with value and text props
| **datePickerCriteria** | string or array | none | One or more of the options from **selectData** prop on which we want to open a date picker, either a string or an array of strings (value prop)
| **selectRenderFn** | function | none | Function that returns jsx for your custom select component. Since select is a controlled component this function will get called like **selectRenderFn(selectData, selectedText, selectedValue, changeCallback, ...yourArguments)**, where returning component sets its options to selectData, text to selectedText(optional), value to selectedValue and onChange to changeCallback. 
| **selectRenderFnArgs** | array | none | Array of arguments that will get passed to **selectRenderFn** that you passed. Eg [1, 2, 3] will get spread as arguments
| **datePickerRenderFn** | function | none | Similar to selectRenderFn, will get called as **datePickerRenderFn(changeCallback, ..yourArgs)**
| **datePickerRenderFnArgs** | array | none | I'll make sure they find their way to **datePickerRenderFn**
| **simpleVersion** | boolean | false | If true, filter bar will not show and instead of accumulating filters, every submit will be separate
| **showRadioButtons** | boolean | true | If false, the buttons will not render
| **hasButton** | boolean | false | Shows "apply" button, and doesn't submit upon selecting date.
| **isInFetchingState** | boolean | false | If true, component will go into state where submit, destroying filters and date picker is disabled and there is visual indication that some data is being filtered
| **selectDefaultValue** | object | First item in **selectData** prop | option that is preselected in **react-combo-select** on component render, with value nad text props
| **validationCallback** | function | (value) => { return value && value.length >= 3; } | Function to run to validate text input, will get called with value as argument
| **inputErrorMessage** | string | "This field is required and should be at least 3 characters long" | Message to display if validation fails
| **dateFormat** | string | "DD MMM YYYY" | Prop to pass to date picker, takes any valid moment.js format
| **validDateFilter** | function | none | Function to validate which dates can be picked. See [react-datetime](https://www.npmjs.com/package/react-datetime) docs for more info 
| **additionalSelectProps** | object | none | Object to spread on **react-combo-select as props**. Takes any props react-combo-select takes
| **additionalDatePickerProps** | object | none | Object to spread on **react-datetime** as props. Takes any props react-datetime takes

### Customizing and contributing

You can contact us in case you need some feature or want to contribute, but keep in mind we don't want to go overboard with trying to make this component a "swiss knife".
It's possible that you may need additional className props, we haven't fully tested custom styling. Feel free to contact us should that be a case.
You can also freely fork and play around with the project.
