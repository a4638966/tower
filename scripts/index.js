var Index = function () {
    this._urls = {};
    this._controls = {
        userMin: $('#userMin'),
        btnLogin: $('#btnLogin'),
        loginAgo: $('#loginAgo'),
        loginAfter: $('#loginAfter'),
        btnLoginOut: $('#btnLoginOut'),
        // 备电，换电，发电，售电
        number: $('#number'),
        income: $('#income'),
        dapacity: $('#dapacity'),
        contractAmount: $('#contractAmount'),
        moneyBackAmount: $('#moneyBackAmount'),
        billingAmount: $('#billingAmount'),
        // 储能站
        energyTotal: $('#energyTotal'),
        energyCapacity: $('#energyCapacity'),
        energyPeakDischargeDuration: $('#energyPeakDischargeDuration'),
        energyCDL: $('#energyCDL'),
        energyFDL: $('#energyFDL'),
        // 延寿站
        extendTotal: $('#extendTotal'),
        extendCapacity: $('#extendCapacity'),
        extendPjxhnl: $('#extendPjxhnl'),
        extendXhnltsnl: $('#extendXhnltsnl'),
        extendFDL: $('#extendFDL'),
        roleName: $('#roleName')
    };
    this._commonData = {
        cdlbfb: 0,
        fdlbfb: 0,
        provinceId: '',
        cityId: '',
        prefectureId: '',
    }
};

Index.prototype.initControl = function () {
    var that = this;
    this._controls.roleName.html($.cookie('name'));
    // 初始化layui
    layui.use(['carousel', 'form', 'element'], function () {
        var carousel = layui.carousel;
        var form = layui.form;
        var element = layui.element;
        //建造实例
        carousel.render({
            elem: '#myCarousel',
            width: '100%' //设置容器宽度
                ,
            height: '348px',
            arrow: 'hover' //始终显示箭头
            //,anim: 'updown' //切换动画方式
        });
        element.progress('cdl', that._commonData.cdlbfb);
        element.progress('fdl', that._commonData.fdlbfb);
        element.progress('fdl1', that._commonData.fdlbfb);
        // 按钮事件
        that._controls.btnLogin.on('click', function () {
            that.login();
        });
        that._controls.btnLoginOut.on('click', function () {
            that.logout();
        });
    });

    // 切换效果
    var dataInfo = '';
    $('.energy-tip p').on('click', function () {
        $(this).children('.energy-block').addClass('active')
        $(this).siblings().children('.energy-block').removeClass('active');

        dataInfo = $(this).children('.energy-text').attr('dataInfo');
        switch (dataInfo) {
            case 'beidian':
                that.initSearch('bd');
                break;
            case 'fadian':
                that.initSearch('fd');
                break;
            case 'huandian':
                that.initSearch('hd');
                break;
            case 'shoudian':
                that.initSearch('sd');
                break;
            case 'jinrong':
                $('#jinrongInfo').show().siblings('.customer-box').hide();
                break;
            case 'yiliao':

                $('#yiliaoInfo').show().siblings('.customer-box').hide();
                break;
            case 'gongan':
                $('#gonganInfo').show().siblings('.customer-box').hide();
                break;
            case 'xuexiao':
                $('#xuexiaoInfo').show().siblings('.customer-box').hide();
                break;
            case 'danwei':
                $('#danweiInfo').show().siblings('.customer-box').hide();
                break;
            case 'shuju':
                $('#shujuInfo').show().siblings('.customer-box').hide();
                break;
            case 'wuye':
                $('#wuyeInfo').show().siblings('.customer-box').hide();
                break;
        }
    });

    // this.initUpdate();

    if ($.cookie('adminToken') != undefined && $.cookie('adminToken') != 'null') {
        that._controls.loginAgo.hide();
        that._controls.loginAfter.show();
        that._controls.userMin.show();
        that.initSearch('bd');
        that.initEnergyStation();
        that.initExtended();
    }
    that.getInfo()

}

//获取签约快讯
Index.prototype.getInfo = function () {
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/news/homeList',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Admin-Token': $.cookie('adminToken')
        },
        data: {
            size:7,
            type:0,
        },
        success: function (res) {
            console.log(res)
            let data = res.result; 
            var str = ''
            for (let i = 0; i < data.length; i++) {
                 str += "<li style='overflow: hidden;white-space: nowrap;text-overflow: ellipsis;' onclick="  + "window.open('new_detail_ifrom.html?id="+data[i].id+"')" + ">" +
                    '<p class="news-info">'+data[i].title+'</p>' +
                    '<p class="news-date">'+data[i].releaseTime+'</p>' +
                    '<div class="clearfix"></div>' +
                    '</li>';
            }
            $('#news_kx').html(str);
        },
        error: function () {
            layer.msg('数据异常！')
        }
    });
    
}
// 权限判断
Index.prototype.cookieDeter = function () {
    var that = this;
    if ($.cookie('mapRange') === '1') {
        that._commonData.provinceId = $.cookie('mapRangeId');
    } else if ($.cookie('mapRange') === '2') {
        that._commonData.cityId = $.cookie('mapRangeId');
    } else if ($.cookie('mapRange') === '3') {
        that._commonData.prefectureId = $.cookie('mapRangeId');
    }
}

// 初始化备电点
Index.prototype.initSearch = function (mode) {
    var that = this;
    this.cookieDeter();
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/index/big_type_data',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Admin-Token': $.cookie('adminToken')
        },
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId,
            mode: mode
        },
        success: function (res) {
            if (res.code === 200) {
                res.result.total === '' ? that._controls.number.html(0) : that._controls.number.html(res.result.total);
                res.result.income === '' ? that._controls.income.html(0) : that._controls.income.html(res.result.income);
                res.result.capacity === '' ? that._controls.dapacity.html(0) : that._controls.dapacity.html(res.result.capacity);
                res.result.contractAmount === '' ? that._controls.contractAmount.html(0) : that._controls.contractAmount.html(res.result.contractAmount);
                res.result.refundAmount === '' ? that._controls.moneyBackAmount.html(0) : that._controls.moneyBackAmount.html(res.result.refundAmount);
                res.result.accountAmount === '' ? that._controls.billingAmount.html(0) : that._controls.billingAmount.html(res.result.accountAmount);
                that.initChart(res.result)
            }
        },
        error: function () {
            layer.msg('数据异常！')
        }
    });
}

// 地图数据
Index.prototype.initChart = function (data) {
    // 调用charts.js
    var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
    var pieChart = new Chart(pieChartCanvas)
    var num = data.financeCount + data.medicalCount + data.policeCount + data.educationCount + data.unitComputerCount + data.dataCenterCount + data.estateManageCount;

    var PieData = [{
            value: data.financeCount,
            color: '#0070C9',
            highlight: '#0070C9',
            label: '金融机构'
        },
        {
            value: data.medicalCount,
            color: '#388acc',
            highlight: '#388acc',
            label: '医疗卫生'
        },
        {
            value: data.policeCount,
            color: '#5b8aaf',
            highlight: '#5b8aaf',
            label: '公安交警'
        },
        {
            value: data.educationCount,
            color: '#8cacc6',
            highlight: '#8cacc6',
            label: '学校教育'
        },
        {
            value: data.unitComputerCount,
            color: '#76bbf2',
            highlight: '#76bbf2',
            label: '单位机房'
        },
        {
            value: data.dataCenterCount,
            color: '#aed5f4',
            highlight: '#aed5f4',
            label: '数据中心'
        },
        {
            value: data.estateManageCount,
            color: '#e8e9ea',
            highlight: '#e8e9ea',
            label: '物业管理'
        }
    ]
    var pieOptions = {
        segmentShowStroke: true,
        segmentStrokeColor: '#fff',
        segmentStrokeWidth: 2,
        animationSteps: 100,
        animationEasing: 'easeOutBounce',
        animateRotate: true,
        animateScale: false,
        responsive: false,
        maintainAspectRatio: true,
        //String - A legend template
        legendTemplate: '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>'
    }
    console.log(num)
    if (num > 0) {
        pieChart.Doughnut(PieData, pieOptions);
    } else {
        pieChart.Doughnut(PieData, pieOptions);
    }

}

// 储能站
Index.prototype.initEnergyStation = function () {
    var that = this;
    this.cookieDeter();
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/index/energy_station',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Admin-Token': $.cookie('adminToken')
        },
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId,
        },
        success: function (res) {
            if (res.code === 200) {
                res.result.total === '' ? that._controls.energyTotal.html('0<span>个</span>') : that._controls.energyTotal.html(res.result.total + '<span>个</span>');
                res.result.totalcapacity === '' ? that._controls.energyCapacity.html('0<span>MWH</span>') : that._controls.energyCapacity.html(res.result.capacity + '<span>MWH</span>');
                res.result.peakDischargeDuration === '' ? that._controls.energyPeakDischargeDuration.html('0<span>H</span>') : that._controls.energyPeakDischargeDuration.html(res.result.peakDischargeDuration + '<span>H</span>');
                res.result.cdl === '' ? that._controls.energyCDL.html('0<span>MWH</span>') : that._controls.energyCDL.html(res.result.fdl + '<span>MWH</span>');
                res.result.fdl === '' ? that._controls.energyFDL.html('0<span>MWH</span>') : that._controls.energyFDL.html(res.result.fdl + '<span>MWH</span>');
                that._commonData.cdlbfb = res.result.cdl / (res.result.cdl + res.result.fdl) * 100;
                that._commonData.fdlbfb = res.result.fdl / (res.result.cdl + res.result.fdl) * 100;
                console.log(that._commonData.cdlbfb)
                layui.use(['carousel', 'form', 'element'], function () {
                    var carousel = layui.carousel;
                    var form = layui.form;
                    var element = layui.element;
                    element.progress('cdl', that._commonData.cdlbfb + '%');
                    element.progress('fdl', that._commonData.fdlbfb + '%');
                });
            }
        },
        error: function () {
            layer.msg('数据异常！');
        }
    });
}

// 延寿站
Index.prototype.initExtended = function () {
    var that = this;
    this.cookieDeter();
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/index/prolong_station',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Admin-Token': $.cookie('adminToken')
        },
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId,
        },
        success: function (res) {
            if (res.code === 200) {
                res.result.total === '' ? that._controls.extendTotal.html('0<span>个</span>') : that._controls.extendTotal.html(res.result.total + '<span>个</span>');
                res.result.capacity === '' ? that._controls.extendCapacity.html('0<span>MWH</span>') : that._controls.extendCapacity.html(res.result.capacity + '<span>MWH</span>');
                res.result.pjxhnl === '' ? that._controls.extendPjxhnl.html('0<span>H</span>') : that._controls.extendPjxhnl.html(res.result.pjxhnl + '<span>H</span>');
                res.result.xhnltsnl === '' ? that._controls.extendXhnltsnl.html('0<span>%</span>') : that._controls.extendXhnltsnl.html(res.result.xhnltsnl + '<span>%</span>');
                res.result.fdl === '' ? that._controls.extendFDL.html('0<span>MWH</span>') : that._controls.extendFDL.html(res.result.fdl + '<span>MWH</span>');
                layui.use(['carousel', 'form', 'element'], function () {
                    var carousel = layui.carousel;
                    var form = layui.form;
                    var element = layui.element;
                    element.progress('fdl1', +res.result.fdl / res.result.capacity * 100 + '%');
                });
            }
        },
        error: function () {
            layer.msg('数据异常！');
        }
    });
}

// 初始化日期
Index.prototype.initUpdate = function () {
    var that = this;

    function add(m) {
        return m < 10 ? '0' + m : m
    }

    function fortime(date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mm = date.getMinutes();
        var s = date.getSeconds();
        return (y + '-' + add(m) + '-' + add(d) + ' ' + add(h) + ':' + add(mm) + ':' + add(s));
    }

    var date = new Date(new Date().getTime()); // + (1000 * 60 * 60 * 72));
    var date_str = fortime(date);
    $('.news-date').html(date_str)
};

Index.prototype.login = function () {
    var that = this;
    var data = {
        userName: $('#userName').val(),
        userPwd: $('#userPwd').val()
    }
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/user/login',
        type: 'POST',
        dataType: 'json',
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(data),
        success: function (res) {
            if (res.code === 200) {
                $.cookie('adminToken', res.result.adminToken);
                $.cookie('mapRangeId', res.result.mapRangeId);
                $.cookie('mapRange', res.result.mapRange);
                $.cookie('name', res.result.name);
                if (res.result.mapRange === 1) {
                    $.cookie('userRole', '河南')
                } else if (res.result.mapRange === 2) {
                    $.ajax({
                        url: 'http://www.baoxingtech.com:9604/sys/area/shi',
                        type: 'GET',
                        dataType: 'json',
                        headers: {
                            'Admin-Token':  res.result.adminToken
                        },
                        data: {
                            provinceId: 17
                        },
                        success: function (res1) {
                            if (res.code === 200) {
                                for (var i=0;i< res1.result.length;i++) {
                                    if (res1.result[i].id === res.result.mapRangeId) {
                                        $.cookie('userRole', res1.result[i].name);
                                    }
                                }
                            }
                        }
                    });
                }
                layer.msg('登陆成功，欢迎您' + res.result.name + '', {
                    icon: 1,
                    time: 700 //2秒关闭（如果不配置，默认是3秒）
                }, function () {
                    that._controls.roleName.html($.cookie('name'))
                    that._controls.loginAgo.hide();
                    that._controls.loginAfter.show();
                    that._controls.userMin.show();
                    that.initSearch('bd');
                    that.getInfo();
                    that.initEnergyStation();
                    that.initExtended();
                });
            } else {
                layer.msg(res.message)
            }
        }
    });
};

Index.prototype.logout = function () {
    var that = this;
    layer.confirm('确认退出当前账户？', {
        icon: 3,
        title: '提示'
    }, function (index) {
        $.ajax({
            url: 'http://www.baoxingtech.com:9604/sys/user/logout',
            type: 'GET',
            dataType: 'json',
            headers: {
                "Content-Type": "application/json"
            },
            success: function (res) {
                if (res.code === 200) {
                    $.cookie('adminToken', null);
                    $.cookie('mapRange', null);
                    $.cookie('mapRangeId', null)
                    $.cookie('name', '')
                    $.cookie('userRole', '');
                    layer.close(index);
                    layer.msg('退出成功', {
                        icon: 1,
                        time: 500 //2秒关闭（如果不配置，默认是3秒）
                    }, function () {
                        that._controls.loginAgo.show();
                        that._controls.loginAfter.hide();
                        that._controls.userMin.hide();
                    });
                }
            }
        });
    });
}