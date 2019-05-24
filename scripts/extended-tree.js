var ExtendedTree = function () {
    this._urls = {};
    this._control = {};
};
ExtendedTree.prototype.initControl = function () {
    var that = this;
    // 初始化layui
    layui.use('tree', function () {
        layui.tree({
            elem: '#treeNav',
            skin: 'shihuang',
            nodes: [{ //节点
                name: '河南省',
                spread: true,
                children: [{
                    name: '郑州市',
                    spread: true,
                    children: [{
                            name: '二七区'
                        },
                        {
                            name: '二七区'
                        }, {
                            name: '二七区'
                        }, {
                            name: '二七区'
                        }, {
                            name: '二七区'
                        }
                    ]
                }, {
                    name: '洛阳',
                    children: [{
                            name: '二七区'
                        },
                        {
                            name: '二七区'
                        }, {
                            name: '二七区'
                        }, {
                            name: '二七区'
                        }, {
                            name: '二七区'
                        }
                    ]
                }, {
                    name: '新乡',
                    children: [{
                            name: '二七区'
                        },
                        {
                            name: '二七区'
                        }, {
                            name: '二七区'
                        }, {
                            name: '二七区'
                        }, {
                            name: '二七区'
                        }
                    ]
                }]
            }] 
        });
    });
};