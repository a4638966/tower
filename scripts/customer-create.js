var CustomerCreate = function () {
    this._urls = {};
    this._controls = {
        userTrueName: $('#userTrueName'),
        contractCode: $('#contractCode'),
        userIphone: $('#userIphone'),
        processDate: $('#processDate'),
        devType: $('#devType'),
        signer: $('#signer'),
        money: $('#money'),
        beginTime: $('#beginTime'),
        ddlProvince: $('#ddlProvince'),
        ddlCidy: $('#ddlCidy'),
        ddlprefecture: $('#ddlprefecture'),
        readyTime: $('#readyTime'),
        address: $('#address'),
        processCycle: $('#processCycle'),
        customerContact: $('#customerContact'),
        customerServer: $('#customerServer'),
        btnSave: $('#btnSave'),
        roleName: $('#roleName')
    };
    this._commonData = {
        form: null,
        provinceId: '',
        cityId: '',
        prefectureId: '',
        devType: ''
    }
};
CustomerCreate.prototype.initControl = function () {
    var that = this;
    this._controls.roleName.html($.cookie('name'));
    layui.use(['form', 'laydate', 'element', 'upload'], function () {
        var form = layui.form;
        that._commonData.form = layui.form;
        var laydate = layui.laydate;
        var element = layui.element;
        var upload = layui.upload;
        laydate.render({
            elem: '#processDate' //指定元素
        });
        laydate.render({
            elem: '#beginTime' //指定元素
        });
        form.on('select(ddlProvince)', function (data) {
            if (data.value != '') {
                that._commonData.provinceId = data.value;
                that.getCity();
            } else {
                that._controls.ddlCidy.html('<option value="">请选择</option>');
                that._controls.ddlprefecture.html('<option value="">请选择</option>');
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
                that._controls.ddlprefecture.html('<option value="">请选择</option>');
                that._commonData.form.render()
                that._commonData.cityId = '';
                that._commonData.prefectureId = '';
            }
        });
        form.on('select(ddlprefecture)', function (data) {
            that._commonData.prefectureId = data.value;
        });

        form.on('select(devType)', function (data) {
            that._commonData.devType = data.value;
        });
    });
    var formSelects = layui.formSelects;
    formSelects.render('selectId');
    formSelects.render('selectId1');

    that._controls.btnSave.on('click', function () {
        that.saveData();
    });
}

CustomerCreate.prototype.getCity = function () {
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
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < res.result.length; i++) {
                    str += '<option value="' + res.result[i].id + '">' + res.result[i].name + '</option>'
                }
                that._controls.ddlCidy.html(str);
                that._commonData.form.render()
            }
        }
    });

}

CustomerCreate.prototype.getPrefecture = function () {
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
                var str = '<option value="">请选择</option>';
                for (var i = 0; i < res.result.length; i++) {
                    str += '<option value="' + res.result[i].id + '">' + res.result[i].name + '</option>'
                }
                that._controls.ddlprefecture.html(str);
                that._commonData.form.render()
            }
        }
    });
};

CustomerCreate.prototype.saveData = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/customer_center/add_customer',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Admin-Token': $.cookie('adminToken')
        },
        data: {
            userTrueName: that._controls.userTrueName.val(),
            contractCode: that._controls.contractCode.val(),
            userIphone: that._controls.userIphone.val(),
            processDateString: that._controls.processDate.val(),
            devType: that._commonData.devType,
            money: that._controls.money.val(),
            beginTimeString: that._controls.beginTime.val(),
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId,
            signer: that._controls.signer.val(),
            readyTime: that._controls.readyTime.val(),
            address: that._controls.address.val(),
            processCycle: that._controls.processCycle.val(),
            customerContact: that._controls.customerContact.val(),
            customerServer: that._controls.customerServer.val()
        },
        success: function (res) {
            if (res.code === 200) {
                layer.msg('添加成功！', {
                    icon: 1,
                    time: 700 //2秒关闭（如果不配置，默认是3秒）
                }, function () {
                    window.location.href="customer-maintain.html";
                });
            }
        }
    });
}