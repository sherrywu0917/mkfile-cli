import React from 'react';
import {render} from 'react-dom';
import {{name | capitalize }}App from '../component/{{name}}App.jsx';
import 'log-tool';
import '../style/comm.scss';

render(<{{name | capitalize }}App/>, document.getElementById('root'));
