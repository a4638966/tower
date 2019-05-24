var EnergyTable = function () {
    this._urls = {};
    this._controls = {
        regional: $('#regional dd'),
        business: $('#business dd'),
        date: $('#date dd')
    };
}
EnergyTable.prototype.initControl = function () {
    // 点击事件
    this._controls.regional.on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
    })
    this._controls.business.on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
    })
    this._controls.date.on('click', function () {
        $(this).addClass('active').siblings().removeClass('active');
    })
}