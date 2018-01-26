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
        <div className={props.classNames.wrapper}>
            {props.filters.map((filter, i) => {
                return (
                    <div
                        className={
                            !props.disabled
                                ? props.classNames.filter
                                : `${props.classNames.filter} ${props.classNames.filter}--disabled`
                        }
                        key={filter.criteria + filter.search + i}
                        data-automation="regionComboSearchFilterBar"
                    >
                        <span className={props.classNames.removeButton} onClick={destroyFilter.bind(null, filter)} data-automation="actionComboSearchDestroyFilter"/>
                        <p className={props.classNames.text} data-automation="textComboSearchFilterCriteria">{filter.selectText}</p>
                        {filter.date
                            ? <p className={props.classNames.text} data-automation="textComboSearchFilterSearchDate">{filter.search ? capitalize(filter.search) : ''} {filter.date}</p>
                            : <p className={props.classNames.text} data-automation="textComboSearchFilterSearchText">{filter.search}</p>}
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
