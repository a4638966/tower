var CustomerMaintain = function () {
    this._urls = {};
    this._controls = {
        searchItem: $('.search-box > dd'),

        ddlProvince: $('#ddlProvince'),
        ddlCidy: $('#ddlCidy'),
        ddlprefecture: $('#ddlprefecture'),

        beginTime: $('#beginTime'),
        endTime: $('#endTime'),

        userTrueName: $('#userTrueName'),
        address: $('#address'),
        customerContact: $('#customerContact'),
        customerServer: $('#customerServer'),

        btnSearch: $('#btnSearch'),

        tbody: $('#tbody')
    };
    this._commonData = {
        form: null,
        provinceId: '',
        cityId: '',
        prefectureId: '',
        devType: '',
        customerType: ''
    }
};
CustomerMaintain.prototype.initControl = function () {
    var that = this;
    layui.use(['laydate','element', 'form'], function () {
        var laydate = layui.laydate;
        var form = layui.form;
        that._commonData.form = layui.form;
        var element = layui.element;
        form.on('select(ddlProvince)', function (data) {
            if (data.value != '') {
                that._commonData.provinceId = data.value;
                that.getCity();
            } else {
                that._controls.ddlCidy.html('<option value="">客户所在城市</option>');
                that._controls.ddlprefecture.html('<option value="">客户所在区县</option>');
                that._commonData.form.render()
                that._commonData.cityId = '';
                that._commonData.prefectureId = '';
            }
        });
        form.on('select(ddlCidy)', function (data) {
            if (data.value != '') {
                that._commonData.cityId = data.value;
                that.getPrefecture();
            } else {
                that._controls.ddlprefecture.html('<option value="">客户所在区县</option>');
                that._commonData.form.render()
                that._commonData.cityId = '';
                that._commonData.prefectureId = '';
            }
        });
        form.on('select(ddlprefecture)', function (data) {
            that._commonData.prefectureId = data.value;
        });

        form.on('select(customerType)', function (data) {
            that._commonData.customerType = data.value;
        });
        laydate.render({
            elem: '#beginTime'
        });
        laydate.render({
            elem: '#endTime'
        })
    });

    this._controls.searchItem.on('click', function () {
        if ($(this).attr('class') != 'date-box') {
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            that._commonData.devType = $(this).attr('devType');
        }
    });

    this.handleSearch();

    this._controls.btnSearch.on('click', function () {
        that.handleSearch();
    })
}

CustomerMaintain.prototype.getCity = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/area/shi',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Admin-Token': $.cookie('adminToken')
        },
        data: {
            provinceId: that._commonData.provinceId
        },
        success: function (res) {
            if (res.code === 200) {
                var str = '<option value="">客户所在城市</option>';
                for (var i = 0; i < res.result.length; i++) {
                    str += '<option value="' + res.result[i].id + '">' + res.result[i].name + '</option>'
                }
                that._controls.ddlCidy.html(str);
                that._commonData.form.render()
            }
        }
    });

}

CustomerMaintain.prototype.getPrefecture = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/area/qx',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Admin-Token': $.cookie('adminToken')
        },
        data: {
            cityId: that._commonData.cityId
        },
        success: function (res) {
            if (res.code === 200) {
                var str = '<option value="">客户所在区县</option>';
                for (var i = 0; i < res.result.length; i++) {
                    str += '<option value="' + res.result[i].id + '">' + res.result[i].name + '</option>'
                }
                that._controls.ddlprefecture.html(str);
                that._commonData.form.render()
            }
        }
    });
};

CustomerMaintain.prototype.handleSearch = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/customer_center/select_customer',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Admin-Token': $.cookie('adminToken')
        },
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId,
            devType: that._commonData.devType,
            beginTimeString: that._controls.beginTime.val(),
            endTimeString: that._controls.endTime.val(),
            userTrueName: that._controls.userTrueName.val(),
            customerType: that._commonData.customerType,
            address: that._controls.address.val(),
            customerContact: that._controls.customerContact.val(),
            customerServer: that._controls.customerServer.val()
        },
        success: function (res) {
            var str = '';
            if (res.code === 200) {
                if (res.result.length > 0) {
                    for (var i=0;i< res.result.length;i++) {
                        str += '<tr>';
                        str += '<td>' + res.result[i].userName + '</td>';
                        str += '<td>' + res.result[i].userTrueName + '</td>';
                        str += '<td>' + res.result[i].userIphone + '</td>';
                        if (res.result[i].userType === '0') {
                            str += '<td>个人用户</td>';
                        } else  if (res.result[i].userType === '1'){
                            str += '<td>企业用户</td>'
                        } else {
                            str += '<td>其他用户</td>'
                        }
                        str += '<td>' + res.result[i].address + '</td>';
                        str += '<td>' + res.result[i].customerContact + '</td>';
                        str += '<td>' + res.result[i].customerServer + '</td>';
                        str += '<td>';
                        str += '<a href="javascript:void(0)" style="color: #fff">详情</a>'
                        str += '</td>';
                        str += '</tr>';
                    }
                } else {
                    str = '<tr><td colspan="9" style="text-align:center">暂无数据</td></tr>'
                }
            } else {
                str = '<tr><td clospan="9" style="text-align:center">暂无数据</td></tr>';
            }
            that._controls.tbody.html(str);
        },
        error: function () {
            layer.msg('数据异常！');
            that._controls.tbody.html('<tr><td clospan="9" style="text-align:center">暂无数据</td></tr>')
        }
    });
}