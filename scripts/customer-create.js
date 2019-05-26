var CustomerCreate = function() {
    this._urls = {};
    this._controls = {};
};
CustomerCreate.prototype.initControl = function() {
    var that = this;
    layui.use(['form', 'laydate', 'element'], function() {
        var form = layui.form;
        var laydate = layui.laydate;
        var element = layui.element;
        laydate.render({
            elem: '#test1' //指定元素
        });
        laydate.render({
            elem: '#test2' //指定元素
        });

    });
    var formSelects = layui.formSelects;
    formSelects.render('selectId');
    formSelects.render('selectId1');
}