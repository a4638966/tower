var Monitoring = function () {
    this._urls = {};
    this._controls = {
            uploadDate: $('#uploadDate'),
            btnEnergy: $('#btnEnergy'),
            btnExtended: $('#btnExtended'),
            energyDetil: $('#energyDetil'),
            extendedDetil: $('#extendedDetil'),
            btnChart: $('#btnChart'),
            btnTable: $('#btnTable'),
            myChart: $('#myChart'),
            myTable: $('#myTable'),
            tableEnergy: $('#tableEnergy'),
            tableExtended: $('#tableExtended')
        },
        this._commonData = {
            chartType: false,
            dataType: 'energy'
        }
}
Monitoring.prototype.initControl = function () {
    var that = this;
    // 初始化日期
    this.initUpdate();
    // 初始化layui
    layui.use('element', function () {
        var element = layui.element;
    });
    // 初始化列表
    this.initTable();
    // 初始化地图
    this.initChart();
    // 加载储能数据
    this.energyStation();
    // 按钮事件
    // 储能
    this._controls.btnEnergy.on('click', function () {
        $(this).addClass('active');
        $(this).siblings().addClass('btn-this');
        that._controls.energyDetil.show();
        that._controls.extendedDetil.hide();
        that._controls.btnExtended.removeClass('active');
        that._controls.btnExtended.siblings().removeClass('btn-this');
        that._commonData.dataType = 'energy';
        that._controls.myChart.show();
        that._controls.myTable.hide();
        that.energyStation();
        that._controls.btnChart.addClass('layui-btn-normal').removeClass('layui-btn-primary');
        that._controls.btnTable.addClass('layui-btn-primary').removeClass('layui-btn-normal');
        setTimeout(function () {
            that.initChart();
        }, 100);
        that.initTable();
    });
    // 延寿
    this._controls.btnExtended.on('click', function () {
        $(this).addClass('active');
        $(this).siblings().addClass('btn-this');
        that._controls.energyDetil.hide();
        that._controls.extendedDetil.show();
        that._controls.btnEnergy.removeClass('active');
        that._controls.btnEnergy.siblings().removeClass('btn-this');
        that._commonData.dataType = 'extended';
        that._controls.myChart.show();
        that._controls.myTable.hide();
        that.prolongStation();
        that._controls.btnChart.addClass('layui-btn-normal').removeClass('layui-btn-primary');
        that._controls.btnTable.addClass('layui-btn-primary').removeClass('layui-btn-normal');
        setTimeout(function () {
            that.initChart();
        }, 100);
        that.initTable();
    });
    this._controls.btnChart.on('click', function () {
        that._controls.myChart.show();
        that._controls.myTable.hide();
        $(this).addClass('layui-btn-normal').removeClass('layui-btn-primary');
        that._controls.btnTable.addClass('layui-btn-primary').removeClass('layui-btn-normal');
        setTimeout(function () {
            that._commonData.chartType = true;
            that.initChart.getBoundary;
        }, 100);
    });
    that._controls.btnTable.on('click', function () {
        that._controls.myChart.hide();
        that._controls.myTable.show();
        $(this).addClass('layui-btn-normal').removeClass('layui-btn-primary');
        that._controls.btnChart.removeClass('layui-btn-normal').addClass('layui-btn-primary');
    });
    $('#btn1').on('click', function () {
        that.getList('101', 'table1')
    })
    $('#btn2').on('click', function () {
        that.getList('103', 'table1')
    })
    $('#btn3').on('click', function () {
        that.getList('104', 'table1')
    })
    $('#btn4').on('click', function () {
        that.getList('102', 'table1')
    })
    $('#btn5').on('click', function () {
        that.getList('106', 'table1')
    })
    $('#btn6').on('click', function () {
        that.getList('105', 'table1')
    })
    $('#btn7').on('click', function () {
        that.getList('107', 'table1')
    })
    $('#btn8').on('click', function () {
        that.getList('108', 'table1')
    })

    $('#btn9').on('click', function () {
        that.getList('201', 'table2')
    })
    $('#btn10').on('click', function () {
        that.getList('203', 'table2')
    })
    $('#btn11').on('click', function () {
        that.getList('205', 'table2')
    })
    $('#btn12').on('click', function () {
        that.getList('202', 'table2')
    })
    $('#btn13').on('click', function () {
        that.getList('204', 'table2')
    })
    $('#btn14').on('click', function () {
        that.getList('207', 'table2')
    })
    $('#btn15').on('click', function () {
        that.getList('208', 'table2')
    })
};
// 初始化日期
Monitoring.prototype.initUpdate = function () {
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
    that._controls.uploadDate.html(date_str)
};
// 初始化列表
Monitoring.prototype.initTable = function () {
    var that = this;
    if (that._commonData.dataType === 'energy') {
        that._controls.tableEnergy.show();
        that._controls.tableExtended.hide();
        $.ajax({
            url: 'http://www.baoxingtech.com:9603/sys/monitor_center/energy_station_prefecture_panel_list',
            type: 'GET',
            dataType: 'json',
            data: {
                prefectureId: ''
            },
            success: function (res) {
                if (res.code === 200) {
                    str = '';
                    for (var i = 0; i < res.result.length; i++) {
                        str += '<tr>';
                        res.result[i].name != '' ? str += '<td>' + res.result[i].name + '</td>' : str += '<td>-</td>';
                        res.result[i].deviceCode != '' ? str += '<td>' + res.result[i].deviceCode + '</td>' : str += '<td>-</td>';
                        res.result[i].pjfdsc != '' ? str += '<td>' + res.result[i].pjfdsc + '/H</td>' : str += '<td>-</td>';
                        res.result[i].syfdsc != '' ? str += '<td>' + res.result[i].syfdsc + '/H</td>' : str += '<td>-</td>';
                        res.result[i].hbyj != '' ? str += '<td>' + res.result[i].hbyj + '%</td>' : str += '<td>-</td>';
                        res.result[i].dcyxzt != '' ? str += '<td>' + res.result[i].dcyxzt + '</td>' : str += '<td>-</td>';
                        str += '</tr>';
                    }
                    $('#table1').html(str);
                }
            }
        });
    } else if (that._commonData.dataType === 'extended') {
        that._controls.tableEnergy.hide();
        that._controls.tableExtended.show();
        $.ajax({
            url: 'http://www.baoxingtech.com:9603/sys/monitor_center/prolong_station_prefecture_panel_list',
            type: 'GET',
            dataType: 'json',
            data: {
                prefectureId: ''
            },
            success: function (res) {
                if (res.code === 200) {
                    str = '';
                    for (var i = 0; i < res.result.length; i++) {
                        str += '<tr>';
                        res.result[i].name != '' ? str += '<td>' + res.result[i].name + '</td>' : str += '<td>-</td>';
                        res.result[i].deviceCode != '' ? str += '<td>' + res.result[i].deviceCode + '</td>' : str += '<td>-</td>';
                        res.result[i].pjfdsc != '' ? str += '<td>' + res.result[i].pjfdsc + '/H</td>' : str += '<td>-</td>';
                        res.result[i].syfdsc != '' ? str += '<td>' + res.result[i].syfdsc + '/H</td>' : str += '<td>-</td>';
                        res.result[i].hbyj != '' ? str += '<td>' + res.result[i].hbyj + '%</td>' : str += '<td>-</td>';
                        res.result[i].dcyxzt != '' ? str += '<td>' + res.result[i].dcyxzt + '</td>' : str += '<td>-</td>';
                        str += '</tr>';
                    }
                    $('#table2').html(str);
                }
            }
        });
    }
};
// 初始化地图
Monitoring.prototype.initChart = function () {
    var that = this;
    // 获取地图数据
    // 需要引入api.map.baidu.com/library/AreaRestriction/1.2/src/AreaRestriction_min.js
    // 创建百度地图map实例
    var map = new BMap.Map("myChart");
    // 初始化地图，设置中心点坐标和地图级别
    map.centerAndZoom(new BMap.Point(113.557234, 33.902115), 8);
    // 设置地图显示的城市，这项是必须的
    map.setCurrentCity("郑州");
    // 开启滚轮缩放
    map.enableScrollWheelZoom(true);
    // 声明一个数组，装行政区域的数据
    var blist = [];
    // 设置一个计数器，用来判断什么时候加载完成行政区域，然后画图
    var districtLoading = 0;
    // 添加行政区划
    function getBoundary() {
        // 计数器来控制加载过程
        districtLoading++;
        // 创建行政区划的对象实例
        var bdary = new BMap.Boundary();
        // 获取行政区域
        bdary.get("河南省", function (rs) {
            // 清除地图覆盖物
            // map.clearOverlays();
            // 行政区域的点有多少个
            var count = rs.boundaries.length;
            if (count === 0) {
                alert('未能获取当前输入行政区域');
                return;
            }
            var pointArray = [];
            for (var i = 0; i < count; i++) {
                blist.push({
                    points: rs.boundaries[i],
                    name: '河南'
                })
            }
            // 调整视野
            // map.setViewport(pointArray);
            // 执行完成后计数器 -1；
            districtLoading--;
            if (districtLoading === 0) {
                // 画多边形来框选地图范围（边界）
                drawBoundary();
            }
        });
    }

    function drawBoundary() {
        var bdary = new BMap.Boundary();
        bdary.get("河南省", function (rs) { //获取行政区域     
            var count = rs.boundaries.length; //行政区域的点有多少个
            if (count === 0) {
                alert('未能获取当前输入行政区域');
                return;
            }
            var pointArray = [];
            if (that._commonData.chartType === false) {
                for (var i = 0; i < count; i++) {
                    var ply = new BMap.Polygon(rs.boundaries[i], {
                        strokeWeight: 2,
                        strokeColor: "#2174ee",
                        fillOpacity: 0.07,
                        fillColor: '#2174ee'
                    }); //建立多边形覆盖物
                    map.addOverlay(ply); //添加覆盖物
                    pointArray = pointArray.concat(ply.getPath());
                }
            }
            map.setViewport(pointArray); //调整视野  
        });
    }
    // 使用添加点的方法
    addPoint();
    // 添加坐标点
    function addPoint() {
        // 生成坐标点
        // 我这里是随机取了河南省的几个坐标，用来添加坐标点
        var positionArray = [];
        if (that._commonData.dataType === 'energy') {
            positionArray = [
                [114.385112, 36.104493],
                [114.311523, 35.775339],
                [115.01062, 35.805319],
                [113.906782, 35.354419],
                [113.226082, 35.248841],
                [113.64922, 34.779614],
                [114.311523, 34.825142],
                [112.453396, 34.642879],
                [111.20238, 34.809969],
                [115.654526, 34.44497],
                [113.833193, 34.093663],
                [113.189288, 33.786977],
                [114.017166, 33.617825],
                [114.679469, 33.679373],
                [114.035563, 33.046399],
                [112.508588, 32.999902],
                [114.072358, 32.174383]
            ]
        } else if (that._commonData.dataType === 'extended') {
            positionArray = [
                [114.385112, 36.104493],
                [114.311523, 35.775339],
                [115.01062, 35.805319],
                [113.906782, 35.354419],
                [113.226082, 35.248841],
                [113.64922, 34.779614],
                [114.311523, 34.825142],
                [112.453396, 34.642879],
                [111.20238, 34.809969],
                [115.654526, 34.44497],
                [113.833193, 34.093663],
                [113.189288, 33.786977],
                [114.017166, 33.617825],
                [114.679469, 33.679373],
                [114.035563, 33.046399],
                [112.508588, 32.999902],
                [114.072358, 32.174383]
            ]
        }
        for (var i = 0; i < positionArray.length; i++) {
            // 一个坐标对应一个mark的生成
            var point = new BMap.Point(positionArray[i][0], positionArray[i][1]);
            var myIcon = new BMap.Icon('images/icon_point.png', new BMap.Size(24, 24));
            addMark(point, myIcon);
        }
    };

    function addMark(point, myIcon) {
        // 生成图像标注
        var mark = new BMap.Marker(point, {
            icon: myIcon
        });
        map.addOverlay(mark);
    }
    // 使用行政区划
    setTimeout(function () {
        getBoundary();
    }, 100);
}

Monitoring.prototype.energyStation = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/monitor_center/energy_station',
        type: 'GET',
        dataType: 'json',
        data: {
            provinceId: '17',
            cityId: '',
            prefectureId: ''
        },
        success: function (res) {
            if (res.code === 200) {
                var data = res.result;
                data.topDisChargeCount != 0 ? $('#topDisChargeCount').html(data.topDisChargeCount) : $('#topDisChargeCount').html('-').siblings().html('');
                data.normalDisChargeCount != 0 ? $('#normalDisChargeCount').html(data.normalDisChargeCount) : $('#normalDisChargeCount').html('-').siblings().html('');
                data.lowDisChargeCount != 0 ? $('#lowDisChargeCount').html(data.lowDisChargeCount) : $('#lowDisChargeCount').html('-').siblings().html('');
                data.averageDisChargeWaveCount != 0 ? $('#averageDisChargeWaveCount').html(data.averageDisChargeWaveCount) : $('#averageDisChargeWaveCount').html('-').siblings().html('');
                data.dtuSysWarnCount != 0 ? $('#dtuSysWarnCount').html(data.dtuSysWarnCount) : $('#dtuSysWarnCount').html('-').siblings().html('');
                data.dtuOfflineCount != 0 ? $('#dtuOfflineCount').html(data.dtuOfflineCount) : $('#dtuOfflineCount').html('-').siblings().html('');
                data.voltageWarnCount != 0 ? $('#voltageWarnCount').html(data.voltageWarnCount) : $('#voltageWarnCount').html('-').siblings().html('');
                data.tempWarnCount != 0 ? $('#tempWarnCount').html(data.tempWarnCount) : $('#tempWarnCount').html('-').siblings().html('');
            }
        }
    });
}

Monitoring.prototype.prolongStation = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/monitor_center/prolong_station',
        type: 'GET',
        dataType: 'json',
        data: {
            provinceId: '17',
            cityId: '',
            prefectureId: ''
        },
        success: function (res) {
            if (res.code === 200) {
                var data = res.result;
                data.topDisChargeCount != 0 ? $('#topDisChargeCount1').html(data.topDisChargeCount) : $('#topDisChargeCount1').html('-').siblings().html('');
                data.lowDisChargeCount != 0 ? $('#lowDisChargeCount1').html(data.lowDisChargeCount) : $('#lowDisChargeCount1').html('-').siblings().html('');
                data.dtuOfflineCount != 0 ? $('#dtuOfflineCount1').html(data.dtuOfflineCount) : $('#dtuOfflineCount1').html('-').siblings().html('');
                data.normalDisChargeCount != 0 ? $('#normalDisChargeCount1').html(data.normalDisChargeCount) : $('#normalDisChargeCount1').html('-').siblings().html('');
                data.dtuSysWarnCount != 0 ? $('#dtuSysWarnCount1').html(data.dtuSysWarnCount) : $('#dtuSysWarnCount1').html('-').siblings().html('');
                data.voltageWarnCount != 0 ? $('#voltageWarnCount1').html(data.voltageWarnCount) : $('#voltageWarnCount1').html('-').siblings().html('');
                data.tempWarnCount != 0 ? $('#tempWarnCount1').html(data.tempWarnCount) : $('#tempWarnCount1').html('-').siblings().html('');
            }
        }
    });
}

Monitoring.prototype.getList = function (code, tableId) {
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/monitor_center/panel_list',
        type: 'GET',
        dataType: 'json',
        data: {
            provinceId: '',
            cityId: '',
            prefectureId: '',
            code: code
        },
        success: function (res) {
            if (res.code === 200) {
                str = '';
                for (var i = 0; i < res.result.length; i++) {
                    str += '<tr>';
                    res.result[i].name != '' ? str += '<td>' + res.result[i].name + '</td>' : str += '<td>-</td>';
                    res.result[i].deviceCode != '' ? str += '<td>' + res.result[i].deviceCode + '</td>' : str += '<td>-</td>';
                    res.result[i].pjfdsc != '' ? str += '<td>' + res.result[i].pjfdsc + '/H</td>' : str += '<td>-</td>';
                    res.result[i].syfdsc != '' ? str += '<td>' + res.result[i].syfdsc + '/H</td>' : str += '<td>-</td>';
                    res.result[i].hbyj != '' ? str += '<td>' + res.result[i].hbyj + '%</td>' : str += '<td>-</td>';
                    res.result[i].dcyxzt != '' ? str += '<td>' + res.result[i].dcyxzt + '</td>' : str += '<td>-</td>';
                    str += '</tr>';
                }
                $('#' + tableId).html(str);
            }
        }
    });
}