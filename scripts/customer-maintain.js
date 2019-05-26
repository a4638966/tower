var CustomerMaintain = function () {
    this._urls = {};
    this._controls = {
        searchItem: $('.search-box dd'),
        startDate: $('#startDate'),
        endDate: $('#endDate')
    }
};
CustomerMaintain.prototype.initControl = function () {
    var that = this;
    layui.use(['laydate','element'], function () {
        var laydate = layui.laydate;
        var element = layui.element;
        laydate.render({
            elem: '#startDate'
        });
        laydate.render({
            elem: '#endDate'
        })
    });

    this._controls.searchItem.on('click', function () {
        if ($(this).attr('class') != 'date-box') {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
        }
    });
}