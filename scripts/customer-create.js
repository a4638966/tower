var CustomerCreate = function () {
    this._urls = {};
    this._controls = {};
};
CustomerCreate.prototype.initControl = function () {
    var that = this;
    layui.use(['form', 'laydate', 'element', 'upload'], function () {
        var form = layui.form;
        var laydate = layui.laydate;
        var element = layui.element;
        var upload = layui.upload;
        laydate.render({
            elem: '#test1' //指定元素
        });
        laydate.render({
            elem: '#test2' //指定元素
        });
        var uploadInst = upload.render({
            elem: '#uploadData',
            url: '/upload/',
            accept: 'file',
            done: function (res) {
                //上传完毕回调
            },
            error: function () {
                //请求异常回调
                layer.msg('没有上传接口，上传不成功')
            }
        });
    });
    var formSelects = layui.formSelects;
    formSelects.render('selectId');
    formSelects.render('selectId1');
}