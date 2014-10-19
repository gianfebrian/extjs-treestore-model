extjs-treestore-model
=====================

To transform any nested Javascript object in node.js into ExtJs Tree Store Model

How it works:

no-config
var obj = [{ name: 'John', class: 'Human' }, { name: 'Kitty', class: 'cat'}];

var transformer = new ExtJSTreeStoreModel(obj);

console.log(transformer.toTreeStoreModel());

Config List: { text, root, rootText, expandedField, iconCls }
