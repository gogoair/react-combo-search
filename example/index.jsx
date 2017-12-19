import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer as HotContainer } from 'react-hot-loader';
import ComboSearch from '../Components/ComboSearch.jsx';

function render(Component) {
	ReactDOM.render(
		<HotContainer>
			<div style={{ "padding": "30px" }}>
				<Component
                    onSearch={(data) => { console.log(data) }}
                    selectData={['Role', 'Partner', 'Team', 'Date']}
                    datePickerCriteria='Date'
                    isInFetchingState={false}
                />
			</div>
		</HotContainer>,
		document.getElementById('react')
	);
}

render(ComboSearch);

if (module.hot) {
	module.hot.accept('../Components/ComboSearch', () => {
		render(ComboSearch);
	});
}
