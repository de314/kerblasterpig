import _ from 'lodash'

const jsonpath = {
  read(model, path) {
    const parts = path.replace(/\$\./, "").split(/\./);
    for (let i in parts) {
      if (_.isUndefined(model[parts[i]])) {
        return undefined
      }
      model = model[parts[i]]
    }
    return model;
  },
  set(model, path, value) {
    const parts = path.replace(/\$\./, "").split(/\./);
    let temp = model;
    for (let i=0;i<parts.length-1;i++) {
      let part = parts[i];
      if (_.isUndefined(temp[part])) {
        temp[part] = {}
      }
      temp = temp[part]
    }
    temp[parts[parts.length-1]] = value
    return model
  }
}

export default jsonpath
