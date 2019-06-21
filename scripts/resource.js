var Resource = function () {
    this._urls = {};
    this._controls = {
            uploadDate: $('#uploadDate'),
            btnChart: $('#btnChart'),
            btnTable: $('#btnTable'),
            myChart: $('#myChart'),
            myTable: $('#myTable'),
            _layuiTag: $('.layui-tag'),
            // 能源保障
            bddsl: $('#bddsl'),
            cddsl: $('#cddsl'),
            hddsl: $('#hddsl'),
            sddsl: $('#sddsl'),
            xdcgm: $('#xdcgm'),
            cnzsl: $('#cnzsl'),
            yszsl: $('#yszsl'),
            xdcgm1: $('#xdcgm1'),
            tableList: $('#tableList'),
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
Resource.prototype.initControl = function () {
    var that = this;
    this._controls.roleName.html($.cookie('name'));
    // 初始化日期
    this.initUpdate();
    layui.use(['tree', 'element'], function () {
        var element = layui.element;
    });

    // 初始化地图
    this.initChart();

    this.initEnergyBusiness();

    this.initEnergyProduct();

    this.initResourceCenterList();
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

    this._controls._layuiTag.on('click', function () {
        var data_info = $(this).attr('data-info');
        window.location.href = 'resource1.html?dataInfo=' + data_info + '&provinceId=' + that._commonData.provinceId + '&cityId=' + that._commonData.cityId + '&prefectureId=' + that._commonData.prefectureId + '';
    });


};

// 权限判断
Resource.prototype.cookieDeter = function () {
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
Resource.prototype.initUpdate = function () {
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

    var date = new Date(new Date().getTime()); //+ (1000 * 60 * 60 * 72));
    var date_str = fortime(date);
    that._controls.uploadDate.html(date_str)
};
Resource.prototype.initChart = function () {
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
            that.initEnergyBusiness(17, '', '');
            that.initEnergyProduct(17, '', '');
            that.initResourceCenterList(17, '', '');
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
        $.ajax({
            url: 'http://www.baoxingtech.com:9604/sys/resource_center/resource_center_map',
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
        str += '<p>备电点：' + data.bddsl + '</p>';
        str += '<p>充点电：' + data.cddsl + '</p>';
        str += '<p>换电点：' + data.hddsl + '</p>';
        str += '<p>售电点：' + data.sddsl + '</p>';
        str += '<p>储能站：' + data.cnzsl + '</p>';
        str += '<p>延寿站：' + data.yszsl + '</p>';
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
            } else if (map.getZoom() >= 10) {
                that._commonData.prefectureId = data.id
            }
            pointClick(data.name);
            that.initEnergyBusiness(that._commonData.provinceId, that._commonData.cityId, that._commonData.prefectureId);
            that.initEnergyProduct(that._commonData.provinceId, that._commonData.cityId, that._commonData.prefectureId)
            that.initResourceCenterList(that._commonData.provinceId, that._commonData.cityId, that._commonData.prefectureId)
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
            });
        }

        setTimeout(function () {
            getPointBoundary();
        }, 100);
    }


    // 获取河南省各市区边界
    function getCitySide() {
        console.log($.cookie('userRole'))
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

Resource.prototype.initEnergyBusiness = function () {
    var that = this;
    this.cookieDeter();
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/resource_center/energy_business_data',
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
                console.log(res.result.bddrl)
                res.result.bddsl === 0 ? that._controls.bddsl.html('-') : that._controls.bddsl.html(res.result.bddsl);
                res.result.cddsl === 0 ? that._controls.cddsl.html('-') : that._controls.cddsl.html(res.result.cddsl);
                res.result.hddsl === 0 ? that._controls.hddsl.html('-') : that._controls.hddsl.html(res.result.hddsl);
                res.result.sddsl === 0 ? that._controls.sddsl.html('-') : that._controls.sddsl.html(res.result.sddsl);
                res.result.bddrl === 0 ? $('#bddnyb').html('0'): $('#bddnyb').html(res.result.bddrl);
                res.result.cddrl === 0 ? $('#cddnyb').html('0'): $('#cddnyb').html(res.result.cddrl);
                res.result.hddrl === 0 ? $('#hddnyb').html('0'): $('#hddnyb').html(res.result.hddrl);
                res.result.sdddl === 0 ? $('#sdddl').html('0'): $('#sdddl').html(res.result.sdddl);
                res.result.xdcgm === 0 ? $('#xdcgm').html('0') : $('#xdcgm').html(res.result.xdcgm);
            }
        },
        error: function () {
            layer.msg('数据异常！');
        }
    });
}

Resource.prototype.initEnergyProduct = function () {
    var that = this;
    this.cookieDeter();
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/resource_center/energy_product_guarantee',
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
                res.result.cnzsl === 0 ? $('#cnzsl').html('-') : $('#cnzsl').html(res.result.cnzsl);
                res.result.cnzrl === 0 ? $('#cnzrl').html('-') : $('#cnzrl').html(res.result.cnzrl);
                res.result.yszsl === 0 ? $('#yszsl').html('-') : $('#yszsl').html(res.result.yszsl);
                res.result.yszrl === 0 ? $('#yszrl').html('-') : $('#yszrl').html(res.result.yszrl);
            }
        },
        error: function () {
            layer.msg('数据异常！');
        }
    });
}

Resource.prototype.initResourceCenterList = function () {
    var that = this;
    this.cookieDeter();
    $.ajax({
        url: 'http://www.baoxingtech.com:9604/sys/resource_center/resource_center_list',
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
                if (res.result.length > 0) {
                    var str = '';
                    for (var i = 0; i < res.result.length; i++) {
                        str += '<tr onclick="jump(\'' + res.result[i].id + '\')">';
                        str += '<td>' + res.result[i].name + '</td>';
                        str += '<td>' + res.result[i].bddsl + '个</td>';
                        str += '<td>' + res.result[i].cddsl + '个</td>';
                        str += '<td>' + res.result[i].hddsl + '个</td>';
                        str += '<td>' + res.result[i].sddsl + '个</td>';
                        str += '<th style="border-right: 1px solid #e6e6e6">' + res.result[i].xdcgmBdCdHdSd + 'AH</th>'
                        str += '<td>' + res.result[i].cnzsl + '个</td>';
                        str += '<td>' + res.result[i].yszsl + '个</td>';
                        str += '<td>' + res.result[i].xdcgmCnzYsz + 'AH</td>';
                        str += '</tr>';
                    }
                    that._controls.tableList.html(str);
                } else {
                    that._controls.tableList.html('<td colspan="9" style="text-align:center">暂无数据</td>')
                }
            }
        },
        error: function () {
            layer.msg('数据异常！');
        }
    });
}

function jump(id) {
    window.location.href = "resource1.html?dataInfo=standbyPower&provinceId=17&cityId=" + id + "&prefectureId="
}

$('.energy-tip p').on('click', function () {
    $(this).children('.energy-block').addClass('active')
    $(this).children('.energy-text').addClass('text-active');
    $(this).siblings().children('.energy-block').removeClass('active');
    $(this).siblings().children('.energy-text').removeClass('text-active');
});