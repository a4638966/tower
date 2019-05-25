var CustomerCreate = function() {
    this._urls = {};
    this._controls = {};
};
CustomerCreate.prototype.initControl = function() {
    var that = this;
    layui.use(['form', 'laydate'], function() {
        var form = layui.form;
        var laydate = layui.laydate;
        laydate.render({
            elem: '#test1' //指定元素
        });
        laydate.render({
            elem: '#test2' //指定元素
        });

    });
    var formSelects = layui.formSelects;
    formSelects.render('selectId');
}