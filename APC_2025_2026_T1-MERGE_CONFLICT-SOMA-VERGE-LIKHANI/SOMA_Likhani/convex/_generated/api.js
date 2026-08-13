/* eslint-disable */
// Browser-compatible Proxy for Convex API function references
const makeFunctionRef = (serviceName) => {
  return new Proxy({}, {
    get(_, functionName) {
      if (typeof functionName === 'symbol' || functionName === 'then') return undefined;
      return `${serviceName}:${functionName}`;
    }
  });
};

export const api = new Proxy({}, {
  get(_, serviceName) {
    if (typeof serviceName === 'symbol' || serviceName === 'then') return undefined;
    return makeFunctionRef(serviceName);
  }
});

export const internal = api;
export const components = {};
