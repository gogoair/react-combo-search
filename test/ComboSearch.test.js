import React from 'react';
import ComboSearch from '../Components/ComboSearch.jsx';

import { mount, shallow } from 'enzyme';
import sinon from 'sinon';
import {expect} from 'chai';
import moment from 'moment';

const onSearchMock = () => {};
const selectData = [
    { value: 'role_name', text: 'Role' },
    { value: 'partner_code', text: 'Partner' },
    { value: 'team_name', text: 'Team' },
    { value: 'created_date', text: 'Date' },
];

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
        const search = mount(<ComboSearch onSearch={onSearchMock} selectData={selectData} datePickerRenderFn={cb} datePickerCriteria="created_date" />);

        search.setState({ criteria: 'created_date' });

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
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="team_name" />);

        search.setState({ criteria: 'team_name' });

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

        search.setState({ appliedFilters: [{ criteria: 'role_name', search: 'Hello' }] });
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

        expect(cb.calledWith([{ criteria: 'role_name', search: 'Hello', selectText: 'Role' }])).to.be.true;

        search.unmount();
    });

    it('calls onSearch with proper args when filtering by date', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="created_date" />);

        search.setState({ criteria: 'created_date', selectText: 'Created date' });
        search.find('.Datepicker__input').simulate('change', { target: { value: moment(new Date(2017, 12, 12)) } });
        search.simulate('submit', { preventDefault() {} });

        expect(cb.calledWith([{
            criteria: 'created_date',
            selectText: 'Created date',
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

        expect(cb.calledWith({ criteria: 'role_name', search: 'Hello', selectText: 'Role' })).to.be.true;

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
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="created_date" />);

        search.setState({ criteria: 'created_date' });
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
                { criteria: 'role_name', search: 'partner admin', selectText: 'Role' },
                { criteria: 'team_name', search: 'Gogo', selectText: 'Team' }
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
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="created_date" />);

        search.setState({ criteria: 'created_date' });
        search.simulate('submit', { preventDefault() {} });

        expect(search.find('.ComboSearch__formError')).to.be.truthy;

        search.setState({ criteria: 'role_name' });

        expect(search.find('.ComboSearch__formError').length).to.equal(0);

        search.unmount();
    });

    it('replaces before date filter with new before date filter', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="created_date" />);

        search.setState({
            criteria: 'created_date',
            beforeOrAfter: 'before',
            date: moment(new Date(2017, 11, 21)).format('DD MMM YYYY'),
            momentDate: moment(new Date(2017, 11, 21))
        });
        search.simulate('submit', { preventDefault() {} });

        search.setState({
            criteria: 'created_date',
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
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="team_name" />);

        search.find('.ComboSearch__input').simulate('change', { target: { value: 'partner admin' }});
        search.simulate('submit', { preventDefault() {} });

        expect(search.find('.FilterBar').length).to.equal(1);
        expect(search.find('.FilterBar__filter').length).to.equal(1);

        search.unmount();
    });

    it('removes a filter properly', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="team_name" />);

        search.setState({ appliedFilters: [
            { criteria: 'role_name', search: 'partner admin' },
            { criteria: 'role_name', search: 'partner user' }
        ] });

        expect(search.find('.FilterBar').length).to.equal(1);
        expect(search.find('.FilterBar__filter').length).to.equal(2);

        search.setState({ appliedFilters: [{ criteria: 'role_name', search: 'partner admin' }] });

        expect(search.find('.FilterBar').length).to.equal(1);
        expect(search.find('.FilterBar__filter').length).to.equal(1);

        search.unmount();
    });

    it('shouldn\'t add a duplicate filter', () => {
        const cb = sinon.spy();
        const search = mount(<ComboSearch onSearch={cb} selectData={selectData} datePickerCriteria="team_name" />);

        search.setState({ appliedFilters: [
            { criteria: 'role_name', search: 'partner admin', selectText: 'Role' },
            { criteria: 'role_name', search: 'partner user', selectText: 'Role' }
        ] });

        search.find('.ComboSearch__input').simulate('change', { target: { value: 'partner admin' }});
        search.simulate('submit', { preventDefault() {} });


        expect(search.state().appliedFilters.length).to.equal(2);
        expect(search.find('.FilterBar__filter').length).to.equal(2);

        search.unmount();
    });
});