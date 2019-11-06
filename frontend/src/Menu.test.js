import React from 'react';
import { shallow } from 'enzyme';

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
import MyComponent from '../src/components/OwnerMenu/menu';
describe('MyComponent', () => {
    it('Rendering Login Page', () => {
        const component = shallow(<MyComponent debug />);
        expect(component).toMatchSnapshot();
    });
});