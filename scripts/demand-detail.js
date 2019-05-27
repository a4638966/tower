var DemandDetail = function () {
    this._urls = {};
    this._control = {
        company1: $('company1'),
        company2: $('company2'),
    };
}

DemandDetail.prototype.initControl = function () {
    var that = this;
    var companyNames = ['河南旭东点气科技有限公司', '新乡市公安局交通管理支队'];
    layui.use(['form', 'element'], function () {
        var form = layui.form;
        var element = layui.element;
    });
    $('#company1').on('mouseenter', function () {
        layer.tips(companyNames[0], '#company1', {
            tips: [1, '#061a3f']
        });

    });
    $('#company1').on('mouseout', function () {
        layer.close(layer.tips(companyNames[0], '#company1', {
            tips: [1, '#061a3f']
        }))
    });

    $('#company2').on('mouseenter', function () {
        layer.tips(companyNames[1], '#company2', {
            tips: [1, '#061a3f']
        });

    });
    $('#company2').on('mouseout', function () {
        layer.close(layer.tips(companyNames[1], '#company2', {
            tips: [1, '#061a3f']
        }))
    });

}