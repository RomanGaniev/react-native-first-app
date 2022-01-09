import React from 'react'
const fakedata = false
import * as Namespaces from './api/index'

class Api {
  constructor (namespace) {
    this.Namespaces = Namespaces
    this.namespace = namespace

    if (!this.Namespaces[this.namespace]) {
      return
    }
    this.injected = new this.Namespaces[this.namespace](fakedata)
  }

  call (callable, data) {
    return this.injected[callable](data)
  }
}
export default Api
