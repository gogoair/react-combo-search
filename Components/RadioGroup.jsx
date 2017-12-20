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
        disabled: PropTypes.bool,
    };

    checkInput = event => {
        this.setState({
            checked: event.target.value,
        });
    };

    render() {
        return (
            <div className={this.props.classNames.wrapper}>
                {this.props.data.map(item => {
                    return (
                        <label
                            key={item.value}
                            className={this.state.checked === item.value
                            ? `${this.props.classNames.label} ${this.props.classNames.label}--checked`
                            : this.props.classNames.label}
                        >
							<span
                                className={
                                    this.state.checked === item.value
                                        ? `${this.props.classNames.fakeRadio} ${this.props.classNames.fakeRadio}--checked`
                                        : this.props.classNames.fakeRadio
                                }
                            >
								<span className={this.props.classNames.fakeRadioInner} />
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
