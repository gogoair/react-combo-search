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
                    selectData={[
                        { value: 'role_name', text: 'Role' },
                        { value: 'partner_code', text: 'Partner' },
                        { value: 'created_date', text: 'Created date' },
                    ]}
                    datePickerCriteria='created_date'
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
