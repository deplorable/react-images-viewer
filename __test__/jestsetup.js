import { configure } from 'enzyme'
import Adapter from './enzymeAdapter'

configure({ adapter: new Adapter() })
