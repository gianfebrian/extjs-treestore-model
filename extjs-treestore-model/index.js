var ExtJSTreeStoreModel = function (docs, config) {
    var self = this;
    config = ('undefined' === typeof config) ? {} : config;
    self.docs = ('string' === typeof docs) ? eval(docs) : docs;
    self.iconCls = ('undefined' === typeof config.iconCls) ? 'grid' : config.iconCls;
    self.expandField = ('undefined' === typeof config.expandField) ? 'all' : config.expandedField;
    self.root = ('undefined' === typeof config.root) ? 'none' : config.root;
    self.rootText = ('undefined' === config.rootText) ? 'none' : config.rootText;
    self.text = ('undefined' === typeof config.text) ? 'none' : config.text;
}

ExtJSTreeStoreModel.prototype.result = [];

ExtJSTreeStoreModel.prototype.toTreeStoreModel = function () {
    var self = this,
        obj = self.docs;
    self.recursive(obj);
    if (self.root == 'none') {
        var noRoot = {};

        noRoot.text = '.';
        noRoot.children = self.result;
        self.result = noRoot;
    }
    if (self.root != 'none') {
        var root = {
            root: {}
        };
        root.root.text = self.rootText == 'none' ? '.' : self.rootText;
        root.root.children = self.result;
        self.result = root;
    }
    return self.result;
}

ExtJSTreeStoreModel.prototype.leaf = function (obj) {
    var self = this,
        leaf = true;
    for (var prop in obj) {
        if (typeof obj[prop] == 'object') {
            if (Array.isArray(obj[prop][0])) {
                if (typeof obj[prop][0] == 'object') {
                    return obj;
                }
            } else {
                if (typeof obj[prop] === 'undefined') {
                    leaf = false && leaf;
                }
                self.leaf(obj[prop]);
            }
        } else {
            leaf = true && leaf;
        }
    }
    if (leaf && !Array.isArray(obj)) {
        obj.leaf = true;
    }
    return obj;
};

ExtJSTreeStoreModel.prototype.recursive = function (obj, childs) {
    var self = this;
    for (var prop in obj) {
        if (typeof obj[prop] == 'object') {
            if (Array.isArray(obj[prop])) {
                if (typeof obj[prop][0] != 'object') {
                    continue;
                } else {
                    var temp = self.leaf(obj[prop]);
                    delete obj[prop];
                    obj['children'] = temp;
                    if (obj.hasOwnProperty('children') && obj.hasOwnProperty('leaf')) {
                        delete obj.leaf;
                    }
                    self.recursive(obj['children'], ((typeof childs == 'undefined') ? false : true));
                }
            } else {
                self.leaf(obj[prop]);
                obj[prop].iconCls = self.iconCls;
                if (self.text != 'none') {
                    if (obj[prop].hasOwnProperty(self.text)) {
                        var tempText = obj[prop][self.text]
                        delete obj[prop][self.text];
                        obj[prop].text = tempText;
                    }
                }
            }
            self.recursive(obj[prop], ((typeof childs == 'undefined') ? false : true));
        }
        if (typeof childs == 'undefined') {
            self.result = obj;
        }
    }
};

module.exports = ExtJSTreeStoreModel;
