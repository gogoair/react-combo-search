import React from 'react';
import PropTypes from 'prop-types';

export default class RadioGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: this.props.defaultChecked || undefined,
        };
    }

    static propTypes = {
        defaultChecked: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        wrapperClassName: PropTypes.string,
        labelClassName: PropTypes.string,
        fakeRadioClassName: PropTypes.string,
        fakeRadioInnerClassName: PropTypes.string,
        disabled: PropTypes.bool,
    };

    checkInput = event => {
        this.setState({
            checked: event.target.value,
        });
    };

    render() {
        const wrapperClassName = this.props.wrapperClassName ? this.props.wrapperClassName : 'RadioGroup';
        const labelClassName = this.props.labelClassName ? this.props.labelClassName : 'RadioGroup__label';
        const fakeRadioClassName = this.props.fakeRadioClassName ? this.props.fakeRadioClassName : 'RadioGroup__fakeRadio';
        const fakeRadioInnerClassName = this.props.fakeRadioInnerClassName
            ? this.props.fakeRadioInnerClassName
            : 'RadioGroup__fakeRadioInner';

        return (
            <div className={wrapperClassName}>
                {this.props.data.map(item => {
                    return (
                        <label
                            key={item.value}
                            className={this.state.checked === item.value
                            ? `${labelClassName} ${labelClassName}--checked`
                            : labelClassName}
                        >
							<span
                                className={
                                    this.state.checked === item.value
                                        ? `${fakeRadioClassName} ${fakeRadioClassName}--checked`
                                        : fakeRadioClassName
                                }
                            >
								<span className={fakeRadioInnerClassName} />
							</span>
                            <input
                                type="radio"
                                name={this.props.name}
                                value={item.value}
                                checked={this.state.checked === item.value}
                                onChange={this.checkInput}
                                disabled={this.props.isInFetchingState}
                                data-automation="fieldComboSearchRadio"
                            />
                            <span>{item.label}</span>
                        </label>
                    );
                })}
            </div>
        );
    }
}
