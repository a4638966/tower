var Business = function () {
    this._urls = {};
    this._controls = {
            uploadDate: $('#uploadDate'),
            btnChart: $('#btnChart'),
            btnTable: $('#btnTable'),
            myChart: $('#myChart'),
            myTable: $('#myTable'),
            _layuiTag: $('.layui-tag'),

            capacity: $('#capacity'),
            fdl: $('#fdl'),
            ljjfje: $('#ljjfje'),
            dzrjfdsc: $('#dzrjfdsc'),
            t0pjyjsc: $('#t0pjyjsc'),
            t1pjyjsc: $('#t1pjyjsc'),
            ysglts: $('#ysglts'),
            yjcs: $('#yjcs'),
            table1: $('#table1'),
            roleName: $('#roleName')
        },
        this._commonData = {
            chartType: false,
            provinceId: '',
            cityId: '',
            prefectureId: '',
            name: ''
        }
}
Business.prototype.initControl = function () {
    var that = this;
    this._controls.roleName.html($.cookie('name'));
    // 初始化日期
    this.initUpdate();
    // 初始化layui
    layui.use('element', function () {
        var element = layui.element;
    });
    // 初始化地图
    this.initChart();
    // 按钮事件
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

    this.energyStation();
    this.prolongStation();
};

// 权限判断
Business.prototype.cookieDeter = function () {
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
Business.prototype.initUpdate = function () {
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
Business.prototype.initChart = function () {
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
            if (that._commonData.name != '河南') {
                map.setViewport(pointArray); //调整视野 
            } 
            if (num === 1) {
                getMap(that._commonData.provinceId, that._commonData.cityId, that._commonData.prefectureId);    
            }
        });
    }
    

    function getMap(provinceId, cityId, prefectureId) {
        $.ajax({
            url: 'http://www.baoxingtech.com:9604/sys/business_center/map',
            type: 'GET',
            dataType: 'json',
            headers:{'Admin-Token':$.cookie('adminToken')},
            data: {
                provinceId: provinceId,
                cityId: cityId,
                prefectureId: prefectureId
            },
            success: function (res) {
                if (res.code === 200) {
                    addPoint(res.result);
                    str = '';
                    for (var i = 0; i < res.result.length; i++) {
                        str += '<tr>';
                        str += '<td>' + res.result[i].name + '</td>';
                        res.result[i].energyStation.capacity != '' ? str += '<td>' + res.result[i].energyStation.capacity + '</td>' : str += '<td>0</td>';
                        res.result[i].energyStation.fdl != '' ? str += '<td>' + res.result[i].energyStation.fdl + '</td>' : str += '<td>0</td>';
                        res.result[i].energyStation.ljjfje != '' ? str += '<td>' + res.result[i].energyStation.ljjfje + '</td>' : str += '<td>0</td>';
                        str += '</tr>';
                    }

                    that._controls.table1.html(str);
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
        var energyStation = data.energyStation;
        var prolongStation = data.prolongStation;
        // 生成图像标注
        var mark = new BMap.Marker(point, {
            icon: myIcon
        });
        map.addOverlay(mark);
        // 添加鼠标划入坐标点的显示内容
        str = '';
        str += '<div class="info-box">';
        str += '<p>' + data.name + '</p>';
        energyStation.capacity != '' ? str += '<p>储能电池容量总计：' + energyStation.capacity + 'KWH</p>' : str += '<p>储能电池容量总计：0</p>';
        energyStation.fdl != '' ? str += '<p>削峰填谷能力：' + energyStation.fdl + 'KWH</p>' : str += '<p>削峰填谷能力：0</p>';
        energyStation.ljjfje != '' ? str += '<p>累计节费金额：' + energyStation.ljjfje + '元</p>' : str += '<p>累计节费金额：0</p>';
        energyStation.dzrjfdsc != '' ? str += '<p>单站日均放电时长：' + energyStation.dzrjfdsc + 'H</p>' : str += '<p>单站日均放电时长：0</p>';
        prolongStation.t0pjyjsc != '' ? str += '<p>T0平均应急时长：' + prolongStation.t0pjyjsc + 'H</p>' : str += '<p>T0平均应急时长：0</p>';
        prolongStation.t1pjyjsc != '' ? str += '<p>T1平均应急时长：' + prolongStation.t1pjyjsc + 'H</p>' : str += '<p>T1平均应急时长：0</p>';
        prolongStation.t1pjyjsc != '' ? str += '<p>延寿管理提升：' + prolongStation.t1pjyjsc + '%</p>' : str += '<p>延寿管理提升：0</p>';
        prolongStation.t1pjyjsc != '' ? str += '<p>应急次数：' + prolongStation.t1pjyjsc + '次</p>' : str += '<p>应急次数：0</p>';
        // str += '<p>蓄电池规模：' + data.xdcgmBdCdHdSd + '</p>';
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
        var label1 = new BMap.Label(data.name,{offset:new BMap.Size(20,-10)});
        label1.setStyle({
            border: 'none',
            border: '1px solid rgba(36,110,221, .5)',
            borderRadius: '5px'
        });
	    mark.setLabel(label1);
        mark.addEventListener('click', function (e) {

            if (map.getZoom() === 8) {
                that._commonData.cityId = data.id;
                pointClick(data.name);
                that.energyStation();
                that.prolongStation();
            } else if (map.getZoom() >= 10) {
                that._commonData.prefectureId = data.id
            }
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
        that._commonData.name = $.cookie('name').replace('管理员', '');
        if (that._commonData.name != '河南') {
            getBoundary(that._commonData.name, 1);
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

Business.prototype.energyStation = function () {
    var that = this;
    this.cookieDeter();
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/business_center/energy_station',
        type: 'GET',
        dataType: 'json',
        headers:{'Admin-Token':$.cookie('adminToken')},
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId
        },
        success: function (res) {
            if (res.code === 200) {
                var data = res.result;
                data.capacity != '' ? that._controls.capacity.html(data.capacity) : that._controls.capacity.html(0);
                data.fdl != '' ? that._controls.fdl.html(data.fdl) : that._controls.fdl.html(0);
                data.ljjfje != '' ? that._controls.ljjfje.html(data.ljjfje) : that._controls.ljjfje.html(0);
                data.dzrjfdsc != '' ? that._controls.dzrjfdsc.html(data.dzrjfdsc) : that._controls.dzrjfdsc.html(0);
            }
        }
    });
}

Business.prototype.prolongStation = function () {
    var that = this;
    this.cookieDeter();
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/business_center/prolong_station',
        type: 'GET',
        dataType: 'json',
        headers:{'Admin-Token':$.cookie('adminToken')},
        data: {
            provinceId: that._commonData.provinceId,
            cityId: that._commonData.cityId,
            prefectureId: that._commonData.prefectureId
        },
        success: function (res) {
            if (res.code === 200) {
                var data = res.result;
                data.t0pjyjsc != '' ? that._controls.t0pjyjsc.html(data.t0pjyjsc) : that._controls.t0pjyjsc.html(0);
                data.t1pjyjsc != '' ? that._controls.t1pjyjsc.html(data.t1pjyjsc) : that._controls.t1pjyjsc.html(0);
                data.ysglts != '' ? that._controls.ysglts.html(data.ysglts) : that._controls.ysglts.html(0);
                data.yjcs != '' ? that._controls.yjcs.html(data.yjcs) : that._controls.yjcs.html(0);
            }
        }
    });
}