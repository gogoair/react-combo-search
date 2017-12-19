import React from 'react';
import PropTypes from 'prop-types';

export default class SmartButton extends React.Component {
    static propTypes = {
        isInPendingState: PropTypes.bool,
        isDisabled: PropTypes.bool,
        onClickCallback: PropTypes.func,
        text: PropTypes.any.isRequired,
        pendingText: PropTypes.any,
        className: PropTypes.string,
        dataAutomation: PropTypes.string,
        style: PropTypes.any,
    };

    static defaultProps = {
        pendingText: '',
    };

    _generatePendingOperationContent = () => {
        return (
            <span>
				<i className="fa fa-spinner fa-pulse"> </i> {this.props.pendingText}
			</span>
        );
    };

    render() {
        const {
            onClickCallback,
            isInPendingState,
            isDisabled,
            text,
            className,
            dataAutomation,
            type,
            title,
            onMouseOver,
            ...other
        } = this.props;

        const content = isInPendingState ? this._generatePendingOperationContent() : text;
        const classNameFinal = typeof className !== 'undefined' ? className : 'Button Button--small h-marginL--xs';

        return (
            <button
                style={this.props.style ? this.props.style : {}}
                className={classNameFinal}
                disabled={isInPendingState || isDisabled === true}
                onClick={onClickCallback}
                data-dismiss={other['data-dismiss'] || 'modal'}
                type={type}
                title={title}
                data-tip={other['data-tip']}
                onMouseOver={onMouseOver}
                data-automation={dataAutomation}
            >
                {content}
            </button>
        );
    }
}
