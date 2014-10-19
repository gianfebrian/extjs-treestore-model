var ExtJSTreeStoreModel = function (docs, config) {
    var self = this;
    self.docs = 'string' === typeof docs ? eval(docs) : docs;
    self.iconCls = 'undefined' == typeof config.iconCls ? 'grid' : config.iconCls;
    self.expandField = 'undefined' == typeof config.expandField ? 'all' : config.expandedField;
    self.root = 'undefined' == typeof config.root ? 'none' : config.root;
    self.rootText = 'undefined' == config.rootText ? 'none' : config.rootText;
    self.text = 'undefined' == typeof config.text ? 'none' : config.text;
}

ExtJSTreeStoreModel.prototype.result = [];

ExtJSTreeStoreModel.prototype.toTreeStoreModel = function () {
    var self = this,
        obj = self.docs;
    self.recursive(obj);
    if (self.root == 'none') {
        var noRoot = {}, children = [];
        children.push(self.result);

        noRoot.text = '.';
        noRoot.children = children;
        self.result = noRoot;
    }
    if (self.rootText != 'none') {
        var root = {root: {}}, children = [];
        children.push(self.result);

        root.root.text = self.rootText == 'none' ? '.' : self.rootText;
        root.root.children = children;
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
                leaf = false && leaf;
                self.leaf(obj[prop]);
            }
        } else {
            leaf = true && leaf;
        }
    }
    if (leaf) obj.leaf = true;
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
                    self.recursive(obj['children'], ((typeof childs == 'undefined') ? false : true));
                }
            } else {
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
