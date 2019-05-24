var DemandDetail = function () {
    this._urls = {};
    this._control = {};
}

DemandDetail.prototype.initControl = function () {
    var that = this;

    // 初始化layui
    layui.use('form', function () {
        var form = layui.form;
    });
}