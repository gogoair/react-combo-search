import React from 'react';
import PropTypes from 'prop-types';

const FilterBar = props => {
    const destroyFilter = filter => {
        if (!props.disabled) {
            props.removeFilter(filter);
        } else {
            return undefined;
        }
    };

    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className="FilterBar">
            {props.filters.map((filter, i) => {
                return (
                    <div
                        className={
                            !props.disabled
                                ? 'FilterBar__filter'
                                : 'FilterBar__filter FilterBar__filter--disabled'
                        }
                        key={filter.criteria + filter.search + i}
                        data-automation="regionComboSearchFilterBar"
                    >
                        <span className="FilterBar__filterClose" onClick={destroyFilter.bind(null, filter)} data-automation="actionComboSearchDestroyFilter"/>
                        <p className="FilterBar__filterText" data-automation="textComboSearchFilterCriteria">{filter.criteria}</p>
                        {filter.date
                            ? <p className="FilterBar__filterText" data-automation="textComboSearchFilterSearchDate">{filter.search ? capitalize(filter.search) : ''} {filter.date}</p>
                            : <p className="FilterBar__filterText" data-automation="textComboSearchFilterSearchText">{filter.search}</p>}
                    </div>
                );
            })}
        </div>
    );
};

FilterBar.propTypes = {
    filters: PropTypes.array,
    removeFilter: PropTypes.func,
    disabled: PropTypes.bool,
};

export default FilterBar;
