import React from 'react';
import PropTypes from 'prop-types';
import ComboSelect from 'react-combo-select';
import DateTimeField from 'react-datetime';
import isEqual from 'lodash.isequal';
import moment from 'moment';

import RadioGroup from './RadioGroup';
import SmartButton from './SmartButton';
import FilterBar from './FilterBar';

export default class ComboSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchCriteria: this.props.selectDefaultValue || this.props.selectData[0],
            selectText: this.props.selectDefaultValue || this.props.selectData[0],
            beforeOrAfter: 'before',
            inputText: undefined,
            inputTextError: undefined,
            date: undefined,
            appliedFilters: [],
        };

        this.changeCriteria = ::this.changeCriteria;
        this.handleSubmit = ::this.handleSubmit;
        this.onInputChange = ::this.onInputChange;
        this.validateTextInput = ::this.validateTextInput;
        this.clearErrorMessage = ::this.clearErrorMessage;
        this.submitOnDateChange = ::this.submitOnDateChange;
    }

    static defaultProps = {
        classNames: {
            wrapper: 'ComboSearch',
            datePickerRadioWrapper: 'ComboSearch__datePicker',
            radioGroupWrapper: 'ComboSearch__RadioWrapper',
            datePickerWrapper: 'ComboSearch__datePickerWrapper',
            textInput: 'ComboSearch__input InputBox',
            button: 'Button Button--action',
        },
        radioGroupClassNames: {
            wrapper: 'RadioGroup',
            label: 'RadioGroup__label',
            fakeRadio: 'RadioGroup__fakeRadio',
            fakeRadioInner: 'RadioGroup__fakeRadioInner',
        },
        filterBarClassNames: {
            wrapper: 'FilterBar',
            filter: 'FilterBar__filter',
            removeButton: 'FilterBar__filterClose',
            text: 'FilterBar__filterText',
        },
        dateFormat: 'DD MMM YYYY',
        showRadioButtons: true,
        inputErrorMessage: 'This field is required and should be at least 3 characters long',
    };

    static propTypes = {
        onSearch: PropTypes.func.isRequired,
        selectData: PropTypes.array,
        selectRenderFn: PropTypes.func,
        selectRenderFnArgs: PropTypes.array,
        datePickerRenderFn: PropTypes.func,
        datePickerRenderFnArgs: PropTypes.array,
        simpleVersion: PropTypes.bool,
        showRadioButtons: PropTypes.bool,
        hasButton: PropTypes.bool,
        buttonPendingText: PropTypes.string,
        isInFetchingState: PropTypes.bool,
        selectDefaultValue: PropTypes.string,
        datePickerCriteria: PropTypes.string,
        classNames: PropTypes.object,
        inputErrorMessage: PropTypes.string,
        validationCallback: PropTypes.func,
        dateFormat: PropTypes.string,
        validDateFilter: PropTypes.func,
        additionalSelectProps: PropTypes.object,
        additionalDatePickerProps: PropTypes.object,
    };

    changeCriteria(value, text) {
        this.setState({searchCriteria: value, selectText: text, inputText: undefined, date: undefined});
    }

    handleSubmit(event) {
        if (event) {
            event.preventDefault();
        }

        if (this.isFormValid() && !this.props.isInFetchingState) {
            const formData = new FormData(this.form);
            let data = {};
            for (let pair of formData.entries()) {
                data[pair[0]] = pair[1];
            }

            const filterAlreadyExists = this.state.appliedFilters.some(filter => {
                return isEqual(filter, data);
            });
            if (this.state.momentDate) {
                data.momentDate = this.state.momentDate;
                data.date = this.state.date;
            }
            if (filterAlreadyExists) {
                this.setState({
                    inputTextError: 'Filter already exists!',
                });
            } else {
                if (this.props.simpleVersion) {
                    this.props.onSearch(data);
                } else {
                    this.props.onSearch([...this.state.appliedFilters, {...data}]);

                    this.setState({
                        appliedFilters: [...this.state.appliedFilters, {...data}],
                    });
                }
            }
        }
    };

    submitOnDateChange(momentDate) {
        if (this.props.hasButton) {
            this.setState({momentDate, date: moment(momentDate).format(this.props.dateFormat)});
        } else {
            this.setState({
                momentDate, date: moment(momentDate).format(this.props.dateFormat)
            }, this.handleSubmit.bind(null));
        }

    };

    removeFilter = data => {
        let filters = this.state.appliedFilters;

        const newFilters = filters.filter(filter => {
            return !isEqual(filter, data);
        });

        this.props.onSearch(newFilters);
        this.setState({appliedFilters: newFilters});
    };

    validateTextInput(value) {
        if (this.props.validationCallback) {
            this.props.validationCallback(value);
        } else {
            return value && value.length >= 3;
        }
    };

    isFormValid() {
        if (this.textInput) {
            const isValidInput = this.validateTextInput(this.state.inputText);
            this.setState({
                inputTextError: !isValidInput ? this.props.inputErrorMessage : undefined,
            });

            return isValidInput;
        } else {
            return true;
        }
    }

    clearErrorMessage() {
        this.setState({
            inputTextError: undefined,
        });
    };

    onInputChange(event) {
        this.setState({
            inputText: event.target.value,
        });
    };

    render() {
        const selectRenderFnArgs = this.props.selectRenderFnArgs ? this.props.selectRenderFnArgs : [];
        const datePickerRenderFnArgs = this.props.datePickerRenderFnArgs ? this.props.datePickerRenderFnArgs : [];

        return (
            <form onSubmit={this.handleSubmit} ref={el => (this.form = el)} data-automation="regionComboSearchForm">
                <div className={this.props.classNames.wrapper}>
                    <p>Filter by:</p>
                    <div className="ComboStyleOverride">
                        {this.props.selectRenderFn
                            ? this.props.selectRenderFn(
                                this.props.selectData,
                                this.state.selectText,
                                this.state.searchCriteria,
                                this.changeCriteria,
                                ...selectRenderFnArgs
                            ) : <ComboSelect
                                data={this.props.selectData}
                                onChange={this.changeCriteria}
                                text={this.state.selectText}
                                value={this.state.searchCriteria}
                                name="criteria"
                                order="off"
                                sort="off"
                                {...this.props.additionalSelectProps}
                            />}
                    </div>
                    {this.props.datePickerCriteria === this.state.searchCriteria ? (
                        <div className={this.props.classNames.datePickerRadioWrapper}>
                            <div className={this.props.classNames.radioGroupWrapper}>
                                {this.props.showRadioButtons
                                    ? <RadioGroup
                                        name="search"
                                        defaultChecked="before"
                                        data={[
                                            {
                                                label: 'Before',
                                                value: 'before',
                                            },
                                            {
                                                label: 'After',
                                                value: 'after',
                                            },
                                        ]}
                                        classNames={this.props.radioGroupClassNames}
                                    /> : null}
                            </div>
                            <div className={this.props.classNames.datePickerWrapper}>
                                {this.props.datePickerRenderFn
                                    ? this.props.datePickerRenderFn(
                                        this.submitOnDateChange,
                                        ...datePickerRenderFnArgs
                                    )
                                    : <DateTimeField
                                        onChange={this.submitOnDateChange}
                                        dateFormat={this.props.dateFormat}
                                        timeFormat={false}
                                        isValidDate={this.props.validDateFilter}
                                        closeOnSelect={true}
                                        inputProps={{
                                            name: 'date',
                                            disabled: this.props.isInFetchingState,
                                            readOnly: true,
                                            className: 'Datepicker__input js-datepickerInput InputBox',
                                            'data-automation': 'fieldComboSearchDatePicker',
                                        }}
                                        {...this.props.additionalDatePickerProps}
                                    />}
                                <i className="Datepicker__icon"> </i>
                            </div>
                        </div>
                    ) : (
                        <div className="ComboSearch__inputWrapper">
                            <span className="ComboSearch__inputIcon"/>
                            <input
                                type="text"
                                name="search"
                                id="search"
                                ref={el => (this.textInput = el)}
                                value={this.state.inputText || ''}
                                className={this.props.classNames.textInput}
                                placeholder={this.state.searchCriteria || this.props.selectData[0]}
                                onChange={this.onInputChange}
                                onBlur={this.clearErrorMessage}
                                data-automation="fieldComboSearchTextInput"
                            />
                            {this.state.inputTextError ? (
                                <span className="ComboSearch__formError">{this.state.inputTextError}</span>
                            ) : (
                                false
                            )}
                        </div>
                    )}

                    {this.props.hasButton ? (
                        <SmartButton
                            text="Apply"
                            type="submit"
                            className={this.props.classNames.button}
                            isDisabled={!this.isFormValid() || this.props.isInFetchingState || !this.state.inputText}
                            isInPendingState={this.props.isInFetchingState}
                            pendingText={this.props.buttonPendingText || 'Loading...'}
                            dataAutomation="buttonComboSearchApply"
                        />
                    ) : (
                        false
                    )}
                    {!this.props.simpleVersion ? (
                        <FilterBar
                            filters={this.state.appliedFilters}
                            removeFilter={this.removeFilter}
                            disabled={this.props.isInFetchingState}
                            classNames={this.props.filterBarClassNames}
                        />
                    ) : (
                        false
                    )}
                </div>
            </form>
        );
    }
}
