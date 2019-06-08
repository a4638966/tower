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
            dataType: 'energy',
            provinceId: 17,
            cityId: '',
            prefectureId: ''
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
        $.ajax({
            url: 'http://www.baoxingtech.com:9603/sys/monitor_center/prolong_station_prefecture_panel_list',
            type: 'GET',
            dataType: 'json',
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
    this._commonData.provinceId = 17;
    this._commonData.cityId = '';
    this._commonData.prefectureId = '';
    // 获取地图数据
    // 需要引入api.map.baidu.com/library/AreaRestriction/1.2/src/AreaRestriction_min.js
    // 创建百度地图map实例
    var map = new BMap.Map("myChart");
    // 初始化地图，设置中心点坐标和地图级别
    map.centerAndZoom(new BMap.Point(113.557234, 33.902115), 8);
    // 设置地图显示的城市，这项是必须的
    map.setCurrentCity("郑州");
    // 开启滚轮缩放
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
            getBoundary('河南省');
            that.initTable();
            that.energyStation();
            that.prolongStation();
        }
    }
    /*注册事件*/
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    } //W3C
    window.onmousewheel = document.onmousewheel = scrollFunc; //IE/Opera/Chrome

    // 定义一个控件类,即function
    function ZoomControl() {
        // 默认停靠位置和偏移量
        this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
        this.defaultOffset = new BMap.Size(10, 10);
    }

    // 通过JavaScript的prototype属性继承于BMap.Control
    ZoomControl.prototype = new BMap.Control();

    // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
    // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
    ZoomControl.prototype.initialize = function (map) {
        // 创建一个DOM元素
        var div = document.createElement("div");
        // 添加文字说明
        div.appendChild(document.createTextNode("返回"));
        // 设置样式
        div.style.cursor = "pointer";
        div.style.border = "1px solid #1E9FFF";
        div.style.backgroundColor = "#1E9FFF";
        div.style.color = "#fff";
        div.style.padding = "5px 10px";
        div.style.borderRadius = '10px';
        // 绑定事件,点击一次放大两级
        div.onclick = function (e) {
            that._commonData.provinceId = 17;
            that._commonData.cityId = '';
            that._commonData.prefectureId = '';
            getBoundary('河南省');
            that.initTable();
            that.energyStation();
            that.prolongStation();
        }
        // 添加DOM元素到地图中
        map.getContainer().appendChild(div);
        // 将DOM元素返回
        return div;
    }
    // 创建控件
    var myZoomCtrl = new ZoomControl();
    // 添加到地图当中
    map.addControl(myZoomCtrl);

    // 声明一个数组，装行政区域的数据
    var blist = [];
    // 设置一个计数器，用来判断什么时候加载完成行政区域，然后画图
    var districtLoading = 0;
    // 添加行政区划
    function getBoundary(name) {
        // 计数器来控制加载过程
        districtLoading++;
        // 创建行政区划的对象实例
        var bdary = new BMap.Boundary();
        // 获取行政区域
        // 清除地图覆盖物
        map.clearOverlays();
        bdary.get(name, function (rs) {
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
                    name: name
                })
            }
            // 调整视野
            // map.setViewport(pointArray);
            // 执行完成后计数器 -1；
            districtLoading--;
            if (districtLoading === 0) {
                // 画多边形来框选地图范围（边界）
                drawBoundary(name);
            }
        });
    }

    function drawBoundary(name) {
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
        });
    }
    // 使用添加点的方法


    function getMap(provinceId, cityId, prefectureId) {
        if (that._commonData.dataType === 'energy') {
            $.ajax({
                url: 'http://www.baoxingtech.com:9603/sys/monitor_center/energy_station_map',
                type: 'GET',
                dataType: 'json',
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
                url: 'http://www.baoxingtech.com:9603/sys/monitor_center/prolong_station_map',
                type: 'GET',
                dataType: 'json',
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
        var label1 = new BMap.Label(data.name,{offset:new BMap.Size(20,-10)});
        label1.setStyle({
            border: 'none',
            border: '1px solid rgba(36,110,221, .5)',
            borderRadius: '5px'
        });
	    mark.setLabel(label1);
        mark.addEventListener('mouseover', function (e) {
            lable.show();
        });
        mark.addEventListener('mouseout', function () {
            lable.hide();
        });

        mark.addEventListener('click', function (e) {
            if (map.getZoom() === 8) {
                that._commonData.cityId = data.id;
                getBoundary(data.name);
                that.initTable();
                that.energyStation();
                that.prolongStation();
            } else if (map.getZoom() >= 10) {
                that._commonData.prefectureId = data.id
            }
        });
    }
    // 使用行政区划
    setTimeout(function () {
        getBoundary('河南省');
    }, 100);
}

Monitoring.prototype.energyStation = function () {
    var that = this;
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/monitor_center/energy_station',
        type: 'GET',
        dataType: 'json',
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
    $.ajax({
        url: 'http://www.baoxingtech.com:9603/sys/monitor_center/prolong_station',
        type: 'GET',
        dataType: 'json',
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