import React from 'react';
import ComboSearch from '../Components/ComboSearch.jsx';

import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import moment from 'moment';

const onSearchMock = () => {};
const selectData = ['Role', 'Partner', 'Team', 'Date'];

ComboSearch.prototype.componentDidMount = () => {};

describe('Initialization of component', () => {

    beforeEach(() => {
        sinon.spy(ComboSearch.prototype, 'componentDidMount');
    });

    afterEach(() => {
        ComboSearch.prototype.componentDidMount.restore();
    });

    it('mounts', () => {
        const search = shallow(<ComboSearch onSearch={onSearchMock} selectData={selectData} />);

        expect(ComboSearch.prototype.componentDidMount.calledOnce).to.be.true;

        search.unmount();
    });

    it('calls custom select render function', () => {
        const cb = sinon.spy();
        const search = shallow(<ComboSearch onSearch={onSearchMock} selectData={selectData} selectRenderFn={cb} />);

        expect(cb.calledOnce).to.be.true;

        search.unmount();
    });

    it('calls custom date picker render function', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={onSearchMock} selectData={selectData} datePickerRenderFn={cb} datePickerCriteria="Date" />);

        search.setState({ criteria: 'Date' });

        expect(cb.calledOnce).to.be.true;

        search.unmount();
    });

    it('doesn\'t render radio buttons if showRadioButtons is false', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={onSearchMock} selectData={selectData} showRadioButtons={false} />);


        expect(search.find('.RadioGroup').length).to.equal(0);

        search.unmount();
    });

    it('renders a button if we ask it nicely', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={onSearchMock} selectData={selectData} hasButton />);


        expect(search.find('.RadioGroup').length).to.equal(0);

        search.unmount();
    });
});

describe('Select filtering', () => {

    it('switches to date picker when option is selected', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="Team" />);

        search.setState({ criteria: 'Team' });

        expect(search.find('.Datepicker__input').length).to.equal(1);
        expect(search.find('.ComboSearch__input').length).to.equal(0);

        search.unmount();
    });
});

describe('Form submit', () => {

    beforeEach(()=>{
        sinon.spy(ComboSearch.prototype, 'handleSubmit');
    });

    afterEach(()=>{
        ComboSearch.prototype.handleSubmit.restore();
    });

    it('doesn\'t call onSearch if input is invalid', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} />);

        search.simulate('submit', { preventDefault() {} });

        expect(ComboSearch.prototype.handleSubmit.calledOnce).to.be.true;
        expect(cb.notCalled).to.be.true;

        search.unmount();
    });

    it('calls onSearch if input is valid', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} />);

        search.find('.ComboSearch__input').simulate('change', { target: { value: 'Hello' } });
        search.simulate('submit', { preventDefault() {} });

        expect(ComboSearch.prototype.handleSubmit.calledOnce).to.be.true;
        expect(cb.calledOnce).to.be.true;

        search.unmount();
    });

    it('doesn\'t call onSearch if component is in fetching state', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} isInFetchingState={true} />);

        search.find('.ComboSearch__input').simulate('change', { target: { value: 'Hello' } });
        search.simulate('submit', { preventDefault() {} });

        expect(ComboSearch.prototype.handleSubmit.calledOnce).to.be.true;
        expect(cb.notCalled).to.be.true;

        search.unmount();
    });

    it('doesn\'t call onSearch if filter already exists', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} />);

        search.setState({ appliedFilters: [{ criteria: 'Role', search: 'Hello' }] });
        search.find('.ComboSearch__input').simulate('change', { target: { value: 'Hello' } });
        search.simulate('submit', { preventDefault() {} });

        expect(ComboSearch.prototype.handleSubmit.calledOnce).to.be.true;
        expect(cb.notCalled).to.be.true;

        search.unmount();
    });

    it('clears input text on submit', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} />);

        search.find('.ComboSearch__input').simulate('change', { target: { value: 'Hello' } });
        search.simulate('submit', { preventDefault() {} });

        expect(search.find('.ComboSearch__input').props().value.length).to.equal(0);
        expect(search.state().inputText.length).to.equal(0);

        search.unmount();
    });

});

describe('onSearch arguments', () => {

    it('calls onSearch with proper args when filtering by text', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} />);

        search.find('.ComboSearch__input').simulate('change', { target: { value: 'Hello' } });
        search.simulate('submit', { preventDefault() {} });

        expect(cb.calledWith([{ criteria: 'Role', search: 'Hello' }])).to.be.true;

        search.unmount();
    });

    it('calls onSearch with proper args when filtering by date', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="Date" />);

        search.setState({ criteria: 'Date' });
        search.find('.Datepicker__input').simulate('change', { target: { value: moment(new Date(2017, 12, 12)) } });
        search.simulate('submit', { preventDefault() {} });

        expect(cb.calledWith([{
            criteria: 'Role',
            search: 'before',
            date: moment(new Date(2017, 12, 12)).format('DD MMM YYYY'),
            momentDate: moment(new Date(2017, 12, 12))
        }])).to.be.true;

        search.unmount();
    });

    it('calls onSearch with proper args with simpleVersion enabled', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} simpleVersion />);

        search.find('.ComboSearch__input').simulate('change', { target: { value: 'Hello' } });
        search.simulate('submit', { preventDefault() {} });

        expect(cb.calledWith({ criteria: 'Role', search: 'Hello' })).to.be.true;

        search.unmount();
    });
});



describe('Validation of input', () => {

    it('sets input error and prevents submit', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} />);

        search.simulate('submit', { preventDefault() {} });

        expect(search.state().inputTextError).to.equal('This field is required and should be at least 3 characters long');
        expect(cb.notCalled).to.be.true;

        search.unmount();
    });

    it('applies custom validation', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} validationCallback={(value) => { return value && value.length > 10}} />);

        search.find('.ComboSearch__input').simulate('change', { target: { value: 'Hello' } });
        search.simulate('submit', { preventDefault() {} });

        expect(cb.notCalled).to.be.true;

        search.find('.ComboSearch__input').simulate('change', { target: { value: '1234567891011' } });
        search.simulate('submit', { preventDefault() {} });

        expect(cb.notCalled).to.be.true;

        search.unmount();
    });

    it('shows error message on text input', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} />);

        search.simulate('submit', { preventDefault() {} });

        expect(search.find('.ComboSearch__formError')).to.be.truthy;

        search.unmount();
    });

    it('shows error message on date picker', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="Date" />);

        search.setState({ criteria: 'Date' });
        search.simulate('submit', { preventDefault() {} });

        expect(search.find('.ComboSearch__formError')).to.be.truthy;

        search.unmount();
    });

    it('shows custom error message', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} inputErrorMessage="Fill out the input dude!" />);

        search.simulate('submit', { preventDefault() {} });

        expect(search.find('.ComboSearch__formError')).to.be.truthy;
        expect(search.state().inputTextError).to.equal('Fill out the input dude!');

        search.unmount();
    });

    it('shows error message when filter already exists', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} />);

        search.setState({
            appliedFilters: [
                { criteria: 'Role', search: 'partner admin' },
                { criteria: 'Team', search: 'Gogo' }
            ]
        });

        search.find('.ComboSearch__input').simulate('change', { target: { value: 'partner admin' }});
        search.simulate('submit', { preventDefault() {} });

        expect(search.find('.ComboSearch__formError')).to.be.truthy;
        expect(search.state().inputTextError).to.equal('Filter already exists!');

        search.unmount();
    });

    it('clears error message on input blur', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} />);

        search.simulate('submit', { preventDefault() {} });

        expect(search.find('.ComboSearch__formError')).to.be.truthy;

        search.find('.ComboSearch__input').simulate('blur');

        expect(search.find('.ComboSearch__formError').length).to.equal(0);

        search.unmount();
    });

    it('clears error message on select switch', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="Date" />);

        search.setState({ criteria: 'Date' });
        search.simulate('submit', { preventDefault() {} });

        expect(search.find('.ComboSearch__formError')).to.be.truthy;

        search.setState({ criteria: 'Role' });

        expect(search.find('.ComboSearch__formError').length).to.equal(0);

        search.unmount();
    });

    it('replaces before date filter with new before date filter', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="Date" />);

        search.setState({
            criteria: 'Date',
            beforeOrAfter: 'before',
            date: moment(new Date(2017, 11, 21)).format('DD MMM YYYY'),
            momentDate: moment(new Date(2017, 11, 21))
        });
        search.simulate('submit', { preventDefault() {} });

        search.setState({
            criteria: 'Date',
            beforeOrAfter: 'before',
            date: moment(new Date(2017, 11, 12)).format('DD MMM YYYY'),
            momentDate: moment(new Date(2017, 11, 12))
        });
        search.simulate('submit', { preventDefault() {} });

        expect(search.state().appliedFilters[0]).to.include({
            search: 'before',
            date: moment(new Date(2017, 11, 12)).format('DD MMM YYYY'),
        });

        search.unmount();
    });
});

describe('Filters rendering', () => {

    it('adds a filter on search apply', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="Team" />);

        search.find('.ComboSearch__input').simulate('change', { target: { value: 'partner admin' }});
        search.simulate('submit', { preventDefault() {} });

        expect(search.find('.FilterBar').length).to.equal(1);
        expect(search.find('.FilterBar__filter').length).to.equal(1);

        search.unmount();
    });

    it('removes a filter properly', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="Team" />);

        search.setState({ appliedFilters: [
            { criteria: 'Role', search: 'partner admin' },
            { criteria: 'Role', search: 'partner user' }
        ] });

        expect(search.find('.FilterBar').length).to.equal(1);
        expect(search.find('.FilterBar__filter').length).to.equal(2);

        search.setState({ appliedFilters: [{ criteria: 'Role', search: 'partner admin' }] });

        expect(search.find('.FilterBar').length).to.equal(1);
        expect(search.find('.FilterBar__filter').length).to.equal(1);

        search.unmount();
    });

    it('shouldn\'t add a duplicate filter', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="Team" />);

        search.setState({ appliedFilters: [
            { criteria: 'Role', search: 'partner admin' },
            { criteria: 'Role', search: 'partner user' }
        ] });

        search.find('.ComboSearch__input').simulate('change', { target: { value: 'partner admin' }});
        search.simulate('submit', { preventDefault() {} });


        expect(search.state().appliedFilters.length).to.equal(2);
        expect(search.find('.FilterBar__filter').length).to.equal(2);

        search.unmount();
    });
});