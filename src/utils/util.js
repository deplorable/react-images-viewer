//import deepMerge from 'merge-deep';


function deepMerge(sourceA = {}, sourceB = {}) {
  let extended = Object.assign({}, sourceA);

  Object.keys(sourceB).forEach((key) => {
    //console.log("SOURCEA= "+ JSON.stringify(sourceA) + " SOURCEB= "+JSON.stringify(sourceB));
    //console.log("sourceB key is " +JSON.stringify(key)+ '; sourceB[key] = ' + JSON.stringify(sourceB[key]));
    if (Array.isArray(sourceB[key])) {
      if (typeof sourceA[key] === 'undefined') extended[key] = [ ...(sourceB[key]) ]
      else extended[key] = { ...(sourceB[key]) };
    } else if (typeof sourceB[key] !== "object" || !sourceB[key]) {
      extended[key] = sourceB[key];
    } else {
      if (!sourceB[key]) {
        extended[key] = sourceB[key];
      } else {
        extended[key] = deepMerge(sourceA[key], sourceB[key]);
      }
    }
  });
  //console.log("RESULT="+JSON.stringify(extended));
  return extended;
}



// export function deepMerge(source, target = {}) {
//   // initialize with source styles
//   const styles = { ...source }

//   // massage in target styles
//   Object.keys(target).forEach(key => {
//     if (source[key]) {
//       styles[key] = (rsCss, props) => {
//         return target[key](source[key](rsCss, props), props)
//       }
//     } else {
//       styles[key] = target[key]
//     }
//   })

//   return styles
// }

const canUseDom = !!(
  typeof window !== "undefined" &&
  window.document &&
  window.document.createElement
);

/**
 * Bind multiple conponent methods:
 * @param {this} context
 * @param {Array} functions
 *
 * constructor() {
 *   ...
 *   bindFunctions.call(this, ['handleClick', 'handleOther'])
 * }
 */
function bindFunctions(functions) {
  functions.forEach((f) => (this[f] = this[f].bind(this)));
}


export { deepMerge, canUseDom, bindFunctions }
