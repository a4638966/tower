var CustomerMaintain = function () {
    this._urls = {};
    this._controls = {
        searchItem: $('.search-box dd')
    }
};
CustomerMaintain.prototype.initControl = function () {
    var that = this;
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        laydate.render({
            elem: '#startDate'
        });
        laydate.render({
            elem: '#endDate'
        })
    });

    this._controls.searchItem.on('click', function () {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
    });
}