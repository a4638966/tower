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
            tableExtended: $('#tableExtended'),
            roleName: $('#roleName')
        },
        this._commonData = {
            chartType: false,
            dataType: 'energy',
            provinceId: '',
            cityId: '',
            prefectureId: '',
            name: ''
        }
}
Monitoring.prototype.initControl = function () {
    var that = this;
    this._controls.roleName.html($.cookie('name'))
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
// 权限判断
Monitoring.prototype.cookieDeter = function () {
    var that = this;
    if ($.cookie('mapRange') === '1') {
        that._commonData.provinceId = $.cookie('mapRangeId');
    } else if ($.cookie('mapRange') === '2') {
        that._commonData.cityId = $.cookie('mapRangeId');
    } else if ($.cookie('mapRange') === '3') {
        that._commonData.prefectureId = $.cookie('mapRangeId');
    }
}
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
        this.cookieDeter();
        $.ajax({
            url: 'http://www.baoxingtech.com:9604/sys/monitor_center/energy_station_prefecture_panel_list',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Admin-Token': $.cookie('adminToken')
            },
            data: {
                provinceId: that._commonData.provinceId,
                cityId: that._commonData.cityId,
                prefectureId: that._commonData.prefectureId
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
        this.cookieDeter();
        $.ajax({
            url: 'http://www.baoxingtech.com:9604/sys/monitor_center/prolong_station_prefecture_panel_list',
            type: 'GET',
            dataType: 'json',
            headers: {
                'Admin-Token': $.cookie('adminToken')
            },
            data: {
                provinceId: that._commonData.provinceId,
                cityId: that._commonData.cityId,
                prefectureId: that._commonData.prefectureId
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
    var map = new BMap.Map("myChart");
    // 初始化地图，设置中心点坐标和地图级别
    map.centerAndZoom(new BMap.Point(113.557234, 33.902115), 8);
    map.setCurrentCity("郑州");
    var provinceId = 17;
    var cityId = '';
    var prefectureId = '';
    map.enableScrollWheelZoom(true);
    var scrollFunc = function (e) {
        e = e || window.event;
        if (map.getZoom() > 8 && map.getZoom() < 10) {
            that._commonData.provinceId = 17;
            that._commonData.cityId = '';
            that._commonData.prefectureId = '';
            map.clearOverlays();
            map.centerAndZoom(new BMap.Point(113.557234, 33.902115), 8);
            map.setCurrentCity("郑州");
            getCitySide();
        }
    }
    /*注册事件*/
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    } //W3C

    function ZoomControl() {
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new BMap.Size(10, 10);
    }
    ZoomControl.prototype = new BMap.Control();
    ZoomControl.prototype.initialize = function (map) {
        var div = document.createElement("div");
        div.appendChild(document.createTextNode("返回"));
        div.style.cursor = "pointer";
        div.style.border = "1px solid #1E9FFF";
        div.style.backgroundColor = "#1E9FFF";
        div.style.color = "#fff";
        div.style.padding = "5px 10px";
        div.style.borderRadius = '10px';
        div.onclick = function (e) {
            that._commonData.provinceId = 17;
            that._commonData.cityId = '';
            that._commonData.prefectureId = '';

            map.centerAndZoom(new BMap.Point(113.557234, 33.902115), 8);
            map.setCurrentCity("郑州");
            map.clearOverlays();
            getCitySide();
            that.initTable();
            that.energyStation();
            that.prolongStation();
        }
        map.getContainer().appendChild(div);
        return div;
    }
    var myZoomCtrl = new ZoomControl();
    map.addControl(myZoomCtrl);

    function getBoundary(name, num) {
        var bdary = new BMap.Boundary();
        bdary.get(name, function (rs) {
            // map.clearOverlays();              
            var count = rs.boundaries.length;
            if (count === 0) {
                alert('未能获取当前输入行政区域');
                return;
            }
            var pointArray = [];
            for (var i = 0; i < count; i++) {
                var ply = new BMap.Polygon(rs.boundaries[i], {
                    strokeWeight: 2,
                    strokeColor: "#2174ee",
                    fillOpacity: 0.07,
                    fillColor: '#2174ee'
                });
                map.addOverlay(ply);
                pointArray = pointArray.concat(ply.getPath());
            }
            if ($.cookie('userRole') != '河南') {
                map.setViewport(pointArray); //调整视野 
            } 
            if (num === 1) {
                getMap(that._commonData.provinceId, that._commonData.cityId, that._commonData.prefectureId);
            }
        });
    }


    function getMap(provinceId, cityId, prefectureId) {
        if (that._commonData.dataType === 'energy') {
            $.ajax({
                url: 'http://www.baoxingtech.com:9604/sys/monitor_center/energy_station_map',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Admin-Token': $.cookie('adminToken')
                },
                data: {
                    provinceId: provinceId,
                    cityId: cityId
                },
                success: function (res) {
                    if (res.code === 200) {
                        addPoint(res.result);
                    } else if (res.code === 500) {
                        layui.use('layer', function () {
                            var layer = layui.layer;
                            layer.msg(res.message);
                        });
                    }
                },
                error: function () {
                    layer.msg('数据异常！');
                }
            });
        } else {
            $.ajax({
                url: 'http://www.baoxingtech.com:9604/sys/monitor_center/prolong_station_map',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Admin-Token': $.cookie('adminToken')
                },
                data: {
                    provinceId: provinceId,
                    cityId: cityId
                },
                success: function (res) {
                    if (res.code === 200) {
                        addPoint(res.result);
                    } else if (res.code === 500) {
                        layui.use('layer', function () {
                            var layer = layui.layer;
                            layer.msg(res.message);
                        });
                    }
                },
                error: function () {
                    layer.msg('数据异常！');
                }
            });
        }
    }

    // 添加坐标点
    function addPoint(data) {
        // 生成坐标点
        // 我这里是随机取了河南省的几个坐标，用来添加坐标点
        var positionArray = []
        for (var i = 0; i < data.length; i++) {
            positionArray.push([data[i].longitude, data[i].latitude])
        }
        if (positionArray.length > 0) {
            for (var i = 0; i < positionArray.length; i++) {
                // 一个坐标对应一个mark的生成
                var point = new BMap.Point(positionArray[i][0], positionArray[i][1]);
                var myIcon = new BMap.Icon('images/icon_point.png', new BMap.Size(24, 24));
                addMark(point, myIcon, data[i]);
            }
        }
    };

    var provinceId1 = '17';
    var cityId1 = '';
    var prefectureId1 = '';

    function addMark(point, myIcon, data) {
        // 生成图像标注
        var mark = new BMap.Marker(point, {
            icon: myIcon
        });
        map.addOverlay(mark);
        // 添加鼠标划入坐标点的显示内容
        str = '';
        str += '<div class="info-box">';
        str += '<p>' + data.name + '</p>';
        if (that._commonData.dataType === 'energy') {
            data.topDisChargeCount != '' ? str += '<p>蓄电池放电8小时以上站点数量：' + data.topDisChargeCount + '个</p>' : str += '<p>蓄电池放电8小时以上站点数量：0</p>';
            data.lowDisChargeCount != '' ? str += '<p>蓄电池放电不足4小时站点数量：' + data.lowDisChargeCount + '个</p>' : str += '<p>蓄电池放电不足4小时站点数量：0</p>';
            data.dtuSysWarnCount != '' ? str += '<p>蓄电池管理设备/DTU系统告警数量：' + data.dtuSysWarnCount + '个</p>' : str += '<p>蓄电池管理设备/DTU系统告警数量：0</p>';
            data.normalDisChargeCount != '' ? str += '<p>蓄电池放电4~8小时站点数量：' + data.normalDisChargeCount + '个</p>' : str += '<p>蓄电池放电4~8小时站点数量：0</p>';
            data.averageDisChargeWaveCount != '' ? str += '<p>平均放电时长变动>20%站点数量：' + data.averageDisChargeWaveCount + '个</p>' : str += '<p>平均放电时长变动>20%站点数量：0</p>';
            data.dtuOfflineCount != '' ? str += '<p>蓄电池管理设备/DTU离线告警数量：' + data.dtuOfflineCount + '个</p>' : str += '<p>蓄电池管理设备/DTU离线告警数量：0</p>';
            data.voltageWarnCount != '' ? str += '<p>蓄电池电压告警数量：' + data.voltageWarnCount + '个</p>' : str += '<p>蓄电池电压告警数量：0</p>';
            data.tempWarnCount != '' ? str += '<p>蓄电池温度告警数量：' + data.tempWarnCount + '个</p>' : str += '<p>蓄电池温度告警数量：0</p>';
        } else {
            data.topDisChargeCount != '' ? str += '<p>蓄电池放电3小时以上站点数量：' + data.topDisChargeCount + '个</p>' : str += '<p>蓄电池放电3小时以上站点数量：0</p>';
            data.lowDisChargeCount != '' ? str += '<p>蓄电池放电不足1小时站点数量：' + data.lowDisChargeCount + '个</p>' : str += '<p>蓄电池放电不足1小时站点数量：0</p>';
            data.dtuOfflineCount != '' ? str += '<p>蓄电池管理设备/DTU离线告警数量：' + data.dtuOfflineCount + '个</p>' : str += '<p>蓄电池管理设备/DTU离线告警数量：0</p>';
            data.normalDisChargeCount != '' ? str += '<p>蓄电池放电1~3小时站点数量：' + data.normalDisChargeCount + '个</p>' : str += '<p>蓄电池放电1~3小时站点数量：0</p>';
            data.dtuSysWarnCount != '' ? str += '<p>蓄电池管理设备/DTU系统告警数量：' + data.dtuSysWarnCount + '个</p>' : str += '<p>蓄电池管理设备/DTU系统告警数量：0</p>';
            data.voltageWarnCount != '' ? str += '<p>蓄电池电压告警数量：' + data.voltageWarnCount + '个</p>' : str += '<p>蓄电池电压告警数量：0</p>';
            data.tempWarnCount != '' ? str += '<p>蓄电池温度告警数量：' + data.tempWarnCount + '个</p>' : str += '<p>蓄电池温度告警数量：0</p>';
        }
        str += '</div>';
        // 创建一个文本标注实例
        var lable = new BMap.Label(str);
        // 清除百度地图自带样式
        lable.setStyle({
            border: 'none',
            border: '1px solid rgba(36,110,221, .5)',
            borderRadius: '5px'
        });
        // 设置标注的地理坐标
        lable.setPosition(point);
        // 默认不显示文本标注
        lable.hide();
        // 在全景场景内添加覆盖物
        map.addOverlay(lable);
        mark.addEventListener('mouseover', function (e) {
            lable.show();
        });
        mark.addEventListener('mouseout', function () {
            lable.hide();
        });
        var label1 = new BMap.Label(data.name, {
            offset: new BMap.Size(20, -10)
        });
        label1.setStyle({
            border: 'none',
            border: '1px solid rgba(36,110,221, .5)',
            borderRadius: '5px'
        });
        mark.setLabel(label1);
        mark.addEventListener('click', function (e) {

            if (map.getZoom() === 8) {
                that._commonData.cityId = data.id;
            } else if (map.getZoom() >= 10) {
                that._commonData.prefectureId = data.id
            }
            pointClick(data.name);
            that.initTable();
            that.energyStation();
            that.prolongStation();
        });
    }

    // 市级点击事件
    function pointClick(name) {
        // 百度地图API功能
        map.enableScrollWheelZoom();
        map.clearOverlays(); //清除地图覆盖物  
        function getPointBoundary() {
            var bdary = new BMap.Boundary();
            bdary.get(name, function (rs) { //获取行政区域

                var count = rs.boundaries.length; //行政区域的点有多少个
                if (count === 0) {
                    alert('未能获取当前输入行政区域');
                    return;
                }
                var pointArray = [];
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
                map.setViewport(pointArray); //调整视野  
                getMap(that._commonData.provinceId, that._commonData.cityId, that._commonData.prefectureId);
                that.initTable();
                that.energyStation();
                that.prolongStation();
            });
        }

        setTimeout(function () {
            getPointBoundary();
        }, 100);
    }


    // 获取河南省各市区边界
    function getCitySide() {
        if ($.cookie('userRole') != '河南') {
            getBoundary($.cookie('userRole'), 1);
        } else {
            getBoundary('郑州', 1);
            getBoundary('开封', 2);
            getBoundary('洛阳', 3);
            getBoundary('平顶山', 4);
            getBoundary('安阳', 5);
            getBoundary('鹤壁', 6);
            getBoundary('新乡', 7);
            getBoundary('焦作', 8);
            getBoundary('濮阳', 9);
            getBoundary('许昌', 10);
            getBoundary('漯河', 11);
            getBoundary('三门峡', 12);
            getBoundary('南阳', 13);
            getBoundary('商丘', 14);
            getBoundary('信阳', 15);
            getBoundary('周口', 16);
            getBoundary('驻马店', 17);
            getBoundary('济源市', 18);
        }
    }
    setTimeout(function () {
        getCitySide();
    }, 100);
}

Monitoring.prototype.energyStation = function () {
    var that = this;
    this.cookieDeter();
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/monitor_center/energy_station',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Admin-Token': $.cookie('adminToken')
        },
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId
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
    this.cookieDeter();
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/monitor_center/prolong_station',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Admin-Token': $.cookie('adminToken')
        },
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId
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
    var that = this;
    this.cookieDeter();
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/monitor_center/panel_list',
        type: 'GET',
        dataType: 'json',
        headers: {
            'Admin-Token': $.cookie('adminToken')
        },
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId,
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