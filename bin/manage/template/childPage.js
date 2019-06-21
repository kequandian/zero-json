import React from 'react';
import ZEle from 'zero-element';
import config from './config/ZERO_childName';

export default function ZERO_childNameUpperCase() {
  return <ZEle
    namespace="ZERO_parentName"
    config={config}
  />
}