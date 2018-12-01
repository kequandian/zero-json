import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { ZEle } from 'zero-element';
import config from './ZERO_childNameUpperCaseConfig';

@connect(({ ZERO_childName, loading }) => ({
  modelStatus: ZERO_childName,
  namespace: 'ZERO_childName',
  loading: loading.effects,
}))
export default class ZERO_childNameUpperCase extends PureComponent {
  render() {
    return (
      <ZEle { ...this.props } config={ config }/>
    );
  }
}